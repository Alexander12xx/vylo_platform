import { Heart, DollarSign, Clock } from 'lucide-react';

export default function RecentTips() {
  const tips = [
    { id: 1, creator: 'GamerPro', amount: 250, date: '2 hours ago', stream: 'Gaming with Fans' },
    { id: 2, creator: 'ArtistLife', amount: 150, date: '5 hours ago', stream: 'Art Tutorial' },
    { id: 3, creator: 'MusicMaster', amount: 300, date: '1 day ago', stream: 'Music Performance' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <Heart className="w-5 h-5 mr-2 text-red-500" />
        Recent Tips
      </h3>
      
      <div className="space-y-3">
        {tips.map((tip) => (
          <div key={tip.id} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-sm">{tip.creator}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{tip.stream}</p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <Clock className="w-3 h-3 mr-1" />
                {tip.date}
              </div>
            </div>
            
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-green-500 mr-1" />
              <span className="font-semibold text-sm">{tip.amount} ALT</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-center text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">
        View All Tips
      </button>
    </div>
  );
}