import { supabase, supabaseAdmin } from './supabase'

export interface RechargeRequest {
  token: string
  altAmount: number
  usdValue: number
}

export interface WithdrawalRequest {
  amount: number
  paymentMethod: 'bank' | 'paypal' | 'crypto'
  paymentDetails: {
    accountName: string
    accountNumber: string
    bankName?: string
    paypalEmail?: string
    cryptoAddress?: string
    cryptoNetwork?: string
  }
}

export class AltCoinsSystem {
  // Get user balance
  static async getBalance(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('users')
      .select('alt_balance')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data.alt_balance || 0
  }

  // Request ALT recharge
  static async requestRecharge(request: RechargeRequest) {
    const user = await getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    // Generate unique token
    const token = `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const { error } = await supabase
      .from('recharge_tokens')
      .insert([
        {
          token,
          alt_amount: request.altAmount,
          usd_value: request.usdValue,
          user_id: user.id,
          status: 'pending'
        }
      ])

    if (error) throw error

    // Notify admin
    await this.notifyAdmin('recharge_request', {
      userId: user.id,
      username: user.username,
      token,
      amount: request.altAmount,
      usdValue: request.usdValue
    })

    return { token }
  }

  // Approve recharge (admin only)
  static async approveRecharge(tokenId: string, adminId: string) {
    const { data: token, error: tokenError } = await supabase
      .from('recharge_tokens')
      .select('*, users!recharge_tokens_user_id_fkey(*)')
      .eq('id', tokenId)
      .single()

    if (tokenError) throw tokenError

    // Start transaction
    const { error: updateError } = await supabaseAdmin
      .from('recharge_tokens')
      .update({
        status: 'approved',
        admin_id: adminId,
        approved_at: new Date().toISOString()
      })
      .eq('id', tokenId)

    if (updateError) throw updateError

    // Add ALT to user balance
    const { error: balanceError } = await supabaseAdmin
      .rpc('process_alt_transaction', {
        p_user_id: token.user_id,
        p_type: 'recharge',
        p_amount: token.alt_amount,
        p_description: `ALT recharge via token ${token.token}`
      })

    if (balanceError) throw balanceError

    // Notify user
    await this.sendNotification(token.user_id, 'Recharge Approved', `Your ALT recharge of ${token.alt_amount} has been approved.`)

    return { success: true }
  }

  // Process payment for content
  static async payForContent(userId: string, contentId: string, creatorId: string) {
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('alt_price')
      .eq('id', contentId)
      .single()

    if (contentError) throw contentError

    // Check balance
    const balance = await this.getBalance(userId)
    if (balance < content.alt_price) {
      throw new Error('Insufficient ALT balance')
    }

    // Process transaction
    const { error: spendError } = await supabaseAdmin
      .rpc('process_alt_transaction', {
        p_user_id: userId,
        p_type: 'spend',
        p_amount: content.alt_price,
        p_description: `Payment for content ${contentId}`
      })

    if (spendError) throw spendError

    // Pay creator (with commission)
    const { error: earnError } = await supabaseAdmin
      .rpc('process_alt_transaction', {
        p_user_id: creatorId,
        p_type: 'earn',
        p_amount: content.alt_price,
        p_description: `Earnings from content ${contentId}`
      })

    if (earnError) throw earnError

    // Log transaction relationship
    await supabaseAdmin
      .from('alt_transactions')
      .update({
        metadata: { content_id: contentId, related_user_id: creatorId }
      })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)

    return { success: true }
  }

  // Process subscription payment
  static async processSubscription(fanId: string, creatorId: string, amount: number) {
    // Check balance
    const balance = await this.getBalance(fanId)
    if (balance < amount) {
      throw new Error('Insufficient ALT balance for subscription')
    }

    // Charge fan
    const { error: spendError } = await supabaseAdmin
      .rpc('process_alt_transaction', {
        p_user_id: fanId,
        p_type: 'spend',
        p_amount: amount,
        p_description: `Subscription to creator ${creatorId}`
      })

    if (spendError) throw spendError

    // Pay creator
    const { error: earnError } = await supabaseAdmin
      .rpc('process_alt_transaction', {
        p_user_id: creatorId,
        p_type: 'earn',
        p_amount: amount,
        p_description: `Subscription from fan ${fanId}`
      })

    if (earnError) throw earnError

    return { success: true }
  }

  // Request withdrawal
  static async requestWithdrawal(creatorId: string, request: WithdrawalRequest) {
    const balance = await this.getBalance(creatorId)
    
    // Check minimum withdrawal
    const { data: settings } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'min_withdrawal_alt')
      .single()

    const minWithdrawal = settings?.value?.value || 1000
    
    if (balance < request.amount) {
      throw new Error('Insufficient ALT balance')
    }

    if (request.amount < minWithdrawal) {
      throw new Error(`Minimum withdrawal amount is ${minWithdrawal} ALT`)
    }

    // Lock ALT for withdrawal
    const { error: lockError } = await supabaseAdmin
      .rpc('process_alt_transaction', {
        p_user_id: creatorId,
        p_type: 'withdrawal',
        p_amount: request.amount,
        p_description: 'Withdrawal request'
      })

    if (lockError) throw lockError

    // Create withdrawal record
    const { error: withdrawalError } = await supabase
      .from('withdrawals')
      .insert([
        {
          creator_id: creatorId,
          amount: request.amount,
          payment_method: request.paymentMethod,
          payment_details: request.paymentDetails,
          status: 'pending'
        }
      ])

    if (withdrawalError) throw withdrawalError

    // Notify admin
    await this.notifyAdmin('withdrawal_request', {
      creatorId,
      amount: request.amount,
      paymentMethod: request.paymentMethod
    })

    return { success: true }
  }

  // Approve withdrawal (admin only)
  static async approveWithdrawal(withdrawalId: string, adminId: string) {
    const { data: withdrawal, error } = await supabase
      .from('withdrawals')
      .select('*, users!withdrawals_creator_id_fkey(*)')
      .eq('id', withdrawalId)
      .single()

    if (error) throw error

    // Update withdrawal status
    const { error: updateError } = await supabaseAdmin
      .from('withdrawals')
      .update({
        status: 'approved',
        processed_by: adminId,
        processed_at: new Date().toISOString()
      })
      .eq('id', withdrawalId)

    if (updateError) throw updateError

    // Notify creator
    await this.sendNotification(
      withdrawal.creator_id,
      'Withdrawal Approved',
      `Your withdrawal request of ${withdrawal.amount} ALT has been approved and will be processed shortly.`
    )

    return { success: true }
  }

  // Get transaction history
  static async getTransactionHistory(userId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('alt_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  // Helper methods
  private static async sendNotification(userId: string, title: string, message: string) {
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title,
          message,
          type: 'transaction'
        }
      ])
  }

  private static async notifyAdmin(type: string, data: any) {
    // Get all admins
    const { data: admins } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')

    if (!admins) return

    for (const admin of admins) {
      await this.sendNotification(
        admin.id,
        `${type.replace('_', ' ').toUpperCase()} Required`,
        JSON.stringify(data)
      )
    }
  }
}