'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Send, Smile, Image as ImageIcon, Gif, 
  Crown, Shield, User, MoreVertical,
  Volume2, VolumeX, Ban, Flag
} from 'lucide-react';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isCreator: boolean;
  isModerator: boolean;
  badges?: string[];
}

interface ChatProps {
  messages: Message[];
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  sendMessage: () => void;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  messageInputRef: React.RefObject<HTMLInputElement>;
}

export default function Chat({
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  chatContainerRef,
  messageInputRef
}: ChatProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatSettings, setChatSettings] = useState({
    slowMode: false,
    subscribersOnly: false,
    emoteOnly: false
  });

  const emojis = ['😀', '😂', '🤣', '😍', '🤔', '🎉', '🔥', '💯', '👏', '🙌', '🎮', '🎵'];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current && !isPaused) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isPaused, chatContainerRef]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputMessage(inputMessage + emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  const toggleChatSetting = (setting: keyof typeof chatSettings) => {
    setChatSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const getBadgeIcons = (badges?: string[]) => {
    if (!badges) return null;
    
    return badges.map((badge, index) => {
      switch (badge) {
        case 'creator':
          return <Crown key={index} className="w-3 h-3 text-yellow-500 ml-1" />;
        case 'moderator':
          return <Shield key={index} className="w-3 h-3 text-green-500 ml-1" />;
        case 'subscriber':
          return <User key={index} className="w-3 h-3 text-purple-500 ml-1" />;
        default:
          return null;
      }
    });
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <Volume2 className="w-4 h-4 mr-2" />
            Live Chat
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 hover:bg-gray-700 rounded-lg"
              title={isPaused ? 'Resume chat' : 'Pause chat'}
            >
              {isPaused ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <Smile className="w-4 h-4" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-xl p-2 grid grid-cols-4 gap-1 z-10">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiClick(emoji)}
                      className="w-8 h-8 hover:bg-gray-800 rounded flex items-center justify-center text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="p-2 hover:bg-gray-700 rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Settings */}
        <div className="flex items-center space-x-4 mt-3 text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={chatSettings.slowMode}
              onChange={() => toggleChatSetting('slowMode')}
              className="mr-2"
            />
            <span className="text-gray-400">Slow Mode</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={chatSettings.subscribersOnly}
              onChange={() => toggleChatSetting('subscribersOnly')}
              className="mr-2"
            />
            <span className="text-gray-400">Subs Only</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={chatSettings.emoteOnly}
              onChange={() => toggleChatSetting('emoteOnly')}
              className="mr-2"
            />
            <span className="text-gray-400">Emote Only</span>
          </label>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {messages.map((message) => (
          <div key={message.id} className="group">
            <div className="flex items-start space-x-2 p-2 hover:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  message.isCreator ? 'bg-yellow-600' :
                  message.isModerator ? 'bg-green-600' : 'bg-purple-600'
                }`}>
                  {message.user[0]}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <span className={`font-medium ${
                    message.isCreator ? 'text-yellow-400' :
                    message.isModerator ? 'text-green-400' : 'text-gray-300'
                  }`}>
                    {message.user}
                  </span>
                  {getBadgeIcons(message.badges)}
                  <span className="text-xs text-gray-500 ml-2">{message.timestamp}</span>
                </div>
                <p className="text-gray-200 mt-1 break-words">{message.text}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-1">
                  <button className="p-1 hover:bg-gray-600 rounded" title="Ban user">
                    <Ban className="w-3 h-3" />
                  </button>
                  <button className="p-1 hover:bg-gray-600 rounded" title="Report message">
                    <Flag className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Welcome Message */}
        <div className="text-center py-4 text-gray-500 text-sm">
          <p>Welcome to the chat! Be respectful and follow community guidelines.</p>
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              ref={messageInputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send a message..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
              disabled={chatSettings.subscribersOnly || chatSettings.emoteOnly}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <Smile className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded">
                <ImageIcon className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded">
                <Gif className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Chat Status */}
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <div>
            {chatSettings.slowMode && <span className="text-yellow-400 mr-2">⏱️ Slow mode (5s)</span>}
            {chatSettings.subscribersOnly && <span className="text-purple-400 mr-2">⭐ Subs only</span>}
            {chatSettings.emoteOnly && <span className="text-blue-400">😀 Emote only</span>}
          </div>
          <span>{messages.length} messages</span>
        </div>
      </div>
    </div>
  );
}
