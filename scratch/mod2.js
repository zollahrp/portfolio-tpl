const fs = require('fs');

const filePath = 'src/app/add-portfolio/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all 'purple' with 'primary'
content = content.replace(/purple/g, 'primary');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully replaced purple with primary in page.tsx');
