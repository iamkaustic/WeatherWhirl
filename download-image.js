import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL of the image shown in the conversation
const imageUrl = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80';
const outputPath = path.join(__dirname, 'src', 'assets', 'images', 'mountain-bg.jpg');

console.log(`Downloading image from ${imageUrl} to ${outputPath}...`);

https.get(imageUrl, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download image: ${response.statusCode} ${response.statusMessage}`);
    return;
  }

  const fileStream = fs.createWriteStream(outputPath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log('Image downloaded successfully!');
  });

  fileStream.on('error', (err) => {
    console.error(`Error writing file: ${err.message}`);
  });
}).on('error', (err) => {
  console.error(`Error downloading image: ${err.message}`);
});
