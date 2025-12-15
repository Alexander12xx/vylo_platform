import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const type = formData.get('type') as 'video' | 'image' | 'thumbnail';
    
    if (!file || !userId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = type === 'video' ? 2 * 1024 * 1024 * 1024 : // 2GB for videos
                    type === 'image' ? 50 * 1024 * 1024 : // 50MB for images
                    5 * 1024 * 1024; // 5MB for thumbnails
    
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max size: ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = {
      video: ['video/mp4', 'video/webm', 'video/quicktime'],
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      thumbnail: ['image/jpeg', 'image/png', 'image/webp']
    };

    if (!allowedTypes[type].includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${allowedTypes[type].join(', ')}` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileName = `${type}/${userId}/${timestamp}-${randomString}.${fileExt}`;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('vylo-platform')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json(
        { error: 'Upload failed' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('vylo-platform')
      .getPublicUrl(fileName);

    // If it's a video, you might want to trigger processing
    if (type === 'video') {
      // Here you could trigger video processing (transcoding, thumbnails, etc.)
      // For now, we'll just return the URL
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: fileName,
      size: file.size,
      type: file.type,
      metadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const type = searchParams.get('type');

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID required' },
      { status: 400 }
    );
  }

  try {
    const { data: files, error } = await supabaseAdmin.storage
      .from('vylo-platform')
      .list(`${type}/${userId}`, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('List files error:', error);
      return NextResponse.json(
        { error: 'Failed to list files' },
        { status: 500 }
      );
    }

    // Get URLs for each file
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('vylo-platform')
          .getPublicUrl(`${type}/${userId}/${file.name}`);
        
        return {
          ...file,
          url: publicUrl
        };
      })
    );

    return NextResponse.json({
      success: true,
      files: filesWithUrls,
      count: filesWithUrls.length
    });

  } catch (error) {
    console.error('List API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json();
    
    if (!path) {
      return NextResponse.json(
        { error: 'File path required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.storage
      .from('vylo-platform')
      .remove([path]);

    if (error) {
      console.error('Delete file error:', error);
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
