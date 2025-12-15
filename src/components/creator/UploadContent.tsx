'use client';

import { useState, useCallback } from 'react';
import { Upload, Video, Image, File, X, Check, Cloud, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UploadedFile {
  id: string;
  name: string;
  type: 'video' | 'image' | 'other';
  size: number;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

export default function UploadContent() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<'video' | 'image' | 'all'>('all');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleFileSelect = useCallback(async (selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    Array.from(selectedFiles).forEach((file) => {
      const fileType = file.type.startsWith('video/') ? 'video' :
                      file.type.startsWith('image/') ? 'image' : 'other';
      
      if (selectedType !== 'all' && fileType !== selectedType) return;
      
      const fileId = Math.random().toString(36).substr(2, 9);
      newFiles.push({
        id: fileId,
        name: file.name,
        type: fileType,
        size: file.size,
        progress: 0,
        status: 'uploading'
      });
    });

    setFiles(prev => [...newFiles, ...prev]);
    
    // Simulate upload process for each file
    newFiles.forEach(async (fileObj, index) => {
      await simulateUpload(fileObj, index);
    });
  }, [selectedType]);

  const simulateUpload = async (fileObj: UploadedFile, index: number) => {
    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, progress: i } : f
      ));
    }

    // Here you would implement actual Supabase upload
    try {
      // Example actual upload code (commented out for now):
      /*
      const fileExt = fileObj.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `creator-content/${fileName}`;

      const { data, error } = await supabase.storage
        .from('vylo-content')
        .upload(filePath, selectedFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('vylo-content')
        .getPublicUrl(filePath);
      */

      // For now, simulate success
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { 
            ...f, 
            progress: 100, 
            status: 'success',
            url: `https://example.com/uploads/${fileObj.name}`
          } : f
        ));
      }, 500);

    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { 
          ...f, 
          status: 'error',
          error: 'Upload failed. Please try again.'
        } : f
      ));
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const filteredFiles = selectedType === 'all' 
    ? files 
    : files.filter(f => f.type === selectedType);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold flex items-center">
          <Cloud className="w-5 h-5 mr-2" />
          Upload Content
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Upload videos, images, and other content
        </p>
      </div>

      <div className="p-6">
        {/* Type Filter */}
        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            {['all', 'video', 'image'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as any)}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  selectedType === type
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300'
                }`}
              >
                {type === 'video' && <Video className="w-4 h-4 mr-2" />}
                {type === 'image' && <Image className="w-4 h-4 mr-2" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer mb-6"
        >
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            accept={selectedType === 'video' ? 'video/*' : 
                   selectedType === 'image' ? 'image/*' : 
                   'video/*,image/*'}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="font-medium mb-2">Drag & drop files here</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              or click to browse files
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Video className="w-4 h-4 mr-1" />
                Videos up to 2GB
              </span>
              <span className="flex items-center">
                <Image className="w-4 h-4 mr-1" />
                Images up to 50MB
              </span>
            </div>
          </label>
        </div>

        {/* Uploaded Files List */}
        {filteredFiles.length > 0 && (
          <div>
            <h4 className="font-medium mb-4">Upload Queue ({filteredFiles.length})</h4>
            <div className="space-y-3">
              {filteredFiles.map((file) => (
                <div key={file.id} className="border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="mr-3">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="mx-2">•</span>
                          <span className="capitalize">{file.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Progress/Status */}
                      {file.status === 'uploading' && (
                        <>
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{file.progress}%</span>
                        </>
                      )}

                      {file.status === 'success' && (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <Check className="w-4 h-4 mr-1" />
                          <span className="text-sm">Uploaded</span>
                        </div>
                      )}

                      {file.status === 'error' && (
                        <div className="flex items-center text-red-600 dark:text-red-400">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">Failed</span>
                        </div>
                      )}

                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {file.error && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {file.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Stats */}
        <div className="mt-6 pt-6 border-t dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Files</p>
              <p className="text-xl font-bold mt-1">{files.length}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Videos</p>
              <p className="text-xl font-bold mt-1">{files.filter(f => f.type === 'video').length}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Images</p>
              <p className="text-xl font-bold mt-1">{files.filter(f => f.type === 'image').length}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Size</p>
              <p className="text-xl font-bold mt-1">
                {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Storage Info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Storage Usage</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                You've used 2.4GB of your 10GB storage
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Upgrade Storage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
