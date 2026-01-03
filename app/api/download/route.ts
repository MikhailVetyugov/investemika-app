import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { statSync } from 'fs';

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), 'data');

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

    try {
      await fs.access(safeFilePath);
    } catch (error) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    if (!safeFilePath.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'File is not a PDF' },
        { status: 400 }
      );
    }

    const stats = statSync(safeFilePath);
    
    if (!stats.isFile()) {
      return NextResponse.json(
        { error: 'Path is not a file' },
        { status: 400 }
      );
    }

    const fileBuffer = await fs.readFile(safeFilePath);
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${path.basename(safeFilePath)}"`,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error in API route (read PDF):', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getSafeFilePath(filePath: string): string | null {
  try {
    const decodedPath = decodeURIComponent(filePath);
    const normalized = path.normalize(decodedPath);
    
    if (normalized.includes('..')) {
      return null;
    }
    
    const absolutePath = path.join(DATA_DIR, normalized);
    
    if (!absolutePath.startsWith(DATA_DIR)) {
      return null;
    }

    return absolutePath;
  } catch (error) {
    return null;
  }
}
