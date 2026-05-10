import fs from 'fs';
import path from 'path';

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.css')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      let newContent = content.replace(/max-w-\[1700px\] w-\[98%\] mx-auto/g, 'w-full');
      newContent = newContent.replace(/max-w-\[1700px\] w-\[98%\]/g, 'w-full');
      
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${filePath}`);
      }
    }
  }
}

walk('./src');
