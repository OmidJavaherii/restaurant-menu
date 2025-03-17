import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop();
    
    // Generate a unique filename
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Convert the file to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Define the path where the file will be saved
    const publicDir = path.join(process.cwd(), 'public');
    const imagesDir = path.join(publicDir, 'images');
    const filePath = path.join(imagesDir, fileName);
    
    // Write the file to the images directory
    await writeFile(filePath, buffer);
    
    // Return the path to the saved image
    return NextResponse.json({ 
      success: true, 
      filePath: `/images/${fileName}` 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
} 