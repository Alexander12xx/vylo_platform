// ALT coin functionality
export async function getBalance(userId: string) {
  console.log('Getting balance for:', userId);
  return { balance: 1000, currency: 'ALT' };
}

export async function transferALT(fromUserId: string, toUserId: string, amount: number) {
  console.log('Transfer:', amount, 'ALT from', fromUserId, 'to', toUserId);
  return { success: true, transactionId: 'tx_' + Date.now() };
}

export async function tipStreamer(viewerId: string, streamerId: string, amount: number) {
  console.log('Tip:', amount, 'ALT from', viewerId, 'to', streamerId);
  return { success: true, message: 'Tip sent!' };
}

// Add common exports that might be missing
export const ALTTransactionSystem = {
  getRecentTransactions: async () => {
    return [
      { id: '1', from: 'user1', to: 'streamer1', amount: 50, timestamp: new Date() },
      { id: '2', from: 'user2', to: 'streamer2', amount: 100, timestamp: new Date() },
    ];
  }
};

export const ALTStats = {
  getTotalCirculation: async () => 1000000,
  getDailyVolume: async () => 50000,
};
