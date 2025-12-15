'use client';

import { useState } from 'react';
import { Calendar, Clock, Tag, Globe, Lock, Video, Bell } from 'lucide-react';

export default function ScheduleStream() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'gaming',
    scheduledDate: '',
    scheduledTime: '19:00',
    duration: '60',
    visibility: 'public',
    thumbnail: null as File | null,
  });

  const categories = [
    { id: 'gaming', name: 'Gaming', color: 'bg-red-500' },
    { id: 'music', name: 'Music', color: 'bg-blue-500' },
    { id: 'education', name: 'Education', color: 'bg-green-500' },
    { id: 'talk', name: 'Talk Show', color: 'bg-purple-500' },
    { id: 'creative', name: 'Creative', color: 'bg-yellow-500' },
    { id: 'fitness', name: 'Fitness', color: 'bg-pink-500' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the actual scheduling logic
    console.log('Scheduling stream:', formData);
    alert('Stream scheduled successfully!');
  };

  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Schedule Stream
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Plan your next live stream in advance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Stream Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Stream Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a catchy title for your stream"
            className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="What will your stream be about?"
            rows={3}
            className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                className={`p-3 border dark:border-gray-700 rounded-lg text-sm flex items-center justify-center ${
                  formData.category === cat.id
                    ? 'bg-purple-100 dark:bg-purple-900 border-purple-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${cat.color}`}></div>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Date
            </label>
            <input
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate || defaultDate}
              onChange={handleInputChange}
              min={defaultDate}
              className="w-full px-4 py-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Time & Duration
            </label>
            <div className="flex space-x-2">
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none"
                required
              />
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-32 px-4 py-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none"
              >
                <option value="30">30 min</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Thumbnail</label>
          <div className="border-2 border-dashed dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
            <input
              type="file"
              id="thumbnail-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label htmlFor="thumbnail-upload" className="cursor-pointer">
              {formData.thumbnail ? (
                <div className="flex items-center justify-center">
                  <img
                    src={URL.createObjectURL(formData.thumbnail)}
                    alt="Thumbnail preview"
                    className="h-32 w-48 object-cover rounded-lg"
                  />
                </div>
              ) : (
                <>
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium">Click to upload thumbnail</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Recommended: 1280x720px, max 5MB
                  </p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Visibility Settings */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3 flex items-center">
            {formData.visibility === 'public' ? (
              <Globe className="w-4 h-4 mr-2" />
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            Visibility
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, visibility: 'public' }))}
              className={`flex-1 p-4 border rounded-lg flex items-center justify-center ${
                formData.visibility === 'public'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <Globe className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Public</p>
                <p className="text-sm text-gray-500">Anyone can watch</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, visibility: 'private' }))}
              className={`flex-1 p-4 border rounded-lg flex items-center justify-center ${
                formData.visibility === 'private'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <Lock className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Private</p>
                <p className="text-sm text-gray-500">Followers only</p>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 flex items-center justify-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Stream
          </button>
          <button
            type="button"
            className="px-6 py-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center"
          >
            <Bell className="w-4 h-4 mr-2" />
            Set Reminder
          </button>
        </div>

        {/* Schedule Preview */}
        {formData.title && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm font-medium mb-2">Schedule Preview</p>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{formData.title}</span>
              <span className="mx-2">•</span>
              <span>{formData.scheduledDate || defaultDate} at {formData.scheduledTime}</span>
              <span className="mx-2">•</span>
              <span>{formData.visibility === 'public' ? 'Public' : 'Private'}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
