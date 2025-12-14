import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const visibility = formData.get('visibility') as string
    const altPrice = parseInt(formData.get('altPrice') as string) || 0
    const caption = formData.get('caption') as string
    const scheduledFor = formData.get('scheduledFor') as string

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and userId are required' },
        { status: 400 }
      )
    }

    // Verify user exists and is creator
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, role, status')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.role !== 'creator') {
      return NextResponse.json(
        { error: 'Only creators can upload content' },
        { status: 403 }
      )
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Account is not active' },
        { status: 403 }
      )
    }

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
    const maxSize = 100 * 1024 * 1024 // 100MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large (max 100MB)' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${userId}/${uuidv4()}.${fileExtension}`
    
    // Determine content type
    const isVideo = file.type.startsWith('video/')
    const contentType = isVideo ? 'video' : 'image'

    // Upload to Supabase Storage
    const buffer = await file.arrayBuffer()
    const { data: storageData, error: storageError } = await supabaseAdmin
      .storage
      .from('content')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (storageError) {
      console.error('Storage error:', storageError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get signed URL for the file
    const { data: urlData } = await supabaseAdmin
      .storage
      .from('content')
      .createSignedUrl(fileName, 60 * 60 * 24 * 365) // 1 year expiry

    // Create content record in database
    const { data: content, error: contentError } = await supabaseAdmin
      .from('content')
      .insert([
        {
          creator_id: userId,
          storage_path: fileName,
          content_type: contentType,
          caption,
          visibility,
          alt_price: altPrice,
          scheduled_for: scheduledFor || null,
          is_scheduled: !!scheduledFor,
          status: 'pending'
        }
      ])
      .select()
      .single()

    if (contentError) {
      // Clean up uploaded file if database insert fails
      await supabaseAdmin.storage.from('content').remove([fileName])
      
      return NextResponse.json(
        { error: 'Failed to create content record' },
        { status: 500 }
      )
    }

    // If auto-approve is enabled
    const { data: settings } = await supabaseAdmin
      .from('platform_settings')
      .select('value')
      .eq('key', 'content_auto_approve')
      .single()

    if (settings?.value?.value === true) {
      await supabaseAdmin
        .from('content')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', content.id)
      
      content.status = 'approved'
    }

    return NextResponse.json({
      success: true,
      content,
      url: urlData?.signedUrl
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    )
  }

  try {
    let query = supabaseAdmin
      .from('content')
      .select('*')
      .eq('creator_id', userId)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    // Generate signed URLs for each content
    const contentWithUrls = await Promise.all(
      data.map(async (item) => {
        const { data: urlData } = await supabaseAdmin
          .storage
          .from('content')
          .createSignedUrl(item.storage_path, 3600) // 1 hour expiry

        return {
          ...item,
          url: urlData?.signedUrl || null
        }
      })
    )

    return NextResponse.json(contentWithUrls)

  } catch (error: any) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}