import { NextRequest, NextResponse } from 'next/server';

import { fetchYandexDiskFileDownloadUrl } from '@/services/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');

  try {
    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    const safeFilePath = getSafeFilePath(filePath);
    
    if (!safeFilePath) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    const downloadUrl = await fetchYandexDiskFileDownloadUrl(safeFilePath);
    
    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'File not found in public folder' },
        { status: 404 }
      );
    }

    const fileResponse = await fetch(downloadUrl);
    
    if (!fileResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to download file' },
        { status: 500 }
      );
    }

    const fileBuffer = await fileResponse.arrayBuffer();

    const parts = safeFilePath.split('/');
    const fileName = parts[parts.length - 1] || 'file';
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': fileResponse.headers.get('content-type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileResponse.headers.get('content-length') || '0',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error in API Route (downloading from Yandex Disk):', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getSafeFilePath(filePath: string): string | null {
  try {
    const decodedPath = decodeURIComponent(filePath);
    
    if (decodedPath.includes('..')) {
      return null;
    }
    
    // Убираем начальные и конечные слэши
    const cleanPath = decodedPath.replace(/^\/+|\/+$/g, '');
    
    if (!cleanPath) {
      return null;
    }

    return cleanPath;
  } catch (error) {
    return null;
  }
}
