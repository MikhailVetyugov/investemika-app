import { NextRequest, NextResponse } from 'next/server';
import { getS3Object } from '@/services/server';

/**
 * Accepts a file path: polyus/2025.pdf or t_tehnologii/TCS Group Holding PLC/2022-en.pdf
 * 
 * Returns the file (Buffer).
 */
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
        { error: `Invalid file path: ${filePath}` },
        { status: 400 }
      );
    }

    const s3Object = await getS3Object(`investemika/${safeFilePath}`);

    if (!s3Object) {
      return NextResponse.json(
        { error: `Failed to get file: ${safeFilePath}` },
        { status: 404 }
      );
    }

    if (!s3Object.Body) {
      return NextResponse.json(
        { error: `Failed to get file body: ${safeFilePath}` },
        { status: 500 }
      );
    }

    const fileBuffer = s3Object.Body as Buffer;

    const parts = safeFilePath.split('/');
    const fileName = parts[parts.length - 1] || 'file';
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': s3Object.ContentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': String(s3Object.ContentLength ?? fileBuffer.length),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error in API Route (downloading from S3):', filePath, error);

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
