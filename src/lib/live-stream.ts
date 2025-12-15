// Live stream functionality
export async function getLiveSession(sessionId: string) {
  console.log('Getting live session:', sessionId);
  return { id: sessionId, title: 'Live Session', isActive: true };
}

export async function joinLiveSession(sessionId: string, userId: string) {
  console.log('Joining session:', sessionId, 'user:', userId);
  return { success: true, sessionId };
}

export async function leaveLiveSession(sessionId: string, userId: string) {
  console.log('Leaving session:', sessionId, 'user:', userId);
  return { success: true };
}

// Add the missing export
export const LiveStreamSystem = {
  getSessions: async () => {
    return [
      { id: '1', title: 'Gaming Stream', viewers: 1500, status: 'live' },
      { id: '2', title: 'Music Session', viewers: 800, status: 'live' },
      { id: '3', title: 'Tech Talk', viewers: 450, status: 'ended' },
    ];
  },
  getStats: async () => {
    return { totalStreams: 3, activeStreams: 2, totalViewers: 2750 };
  }
};
