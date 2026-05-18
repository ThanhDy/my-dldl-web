const fs = require('fs');
const lines = fs.readFileSync('d:/MY PROJECTS/my-dldl-web/app/components/HeroDetailClient.tsx', 'utf8').split('\n');

const newLines = [];
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    if (line.includes('label="Đệ Thất"') || line.includes('label="Đệ Bát"') || line.includes('label="Đệ Cửu"')) {
        continue;
    }
    
    if (line.includes('activeTab === "seventh" && hero.seventhSkill')) {
        line = line.replace('activeTab === "seventh"', '(activeTab === "build" || activeTab === "skills")');
    }
    if (line.includes('activeTab === "eighth" && hero.eighthSkill')) {
        line = line.replace('activeTab === "eighth"', '(activeTab === "build" || activeTab === "skills")');
    }
    if (line.includes('activeTab === "ninth" && hero.ninthSkill')) {
        line = line.replace('activeTab === "ninth"', '(activeTab === "build" || activeTab === "skills")');
    }
    
    if (line.includes('className="space-y-6"') && 
       ((i > 0 && lines[i-1].includes('Đệ Thất')) || (i < lines.length-1 && lines[i+1].includes('Đệ Thất')) || 
        (i > 1 && lines[i-2].includes('Đệ Thất')) || (i < lines.length-2 && lines[i+2].includes('Đệ Thất')))) {
        line = line.replace('className="space-y-6"', 'className="space-y-6 mt-8"');
    }

    if (line.includes('className="space-y-8"') && 
       ((i > 0 && lines[i-1].includes('Đệ Bát')) || (i < lines.length-1 && lines[i+1].includes('Đệ Bát')) || 
        (i > 1 && lines[i-2].includes('Đệ Bát')) || (i < lines.length-2 && lines[i+2].includes('Đệ Bát')))) {
        line = line.replace('className="space-y-8"', 'className="space-y-8 mt-8"');
    }
    
    if (line.includes('className="space-y-8"') && 
       ((i > 0 && lines[i-1].includes('Đệ Cửu')) || (i < lines.length-1 && lines[i+1].includes('Đệ Cửu')) || 
        (i > 1 && lines[i-2].includes('Đệ Cửu')) || (i < lines.length-2 && lines[i+2].includes('Đệ Cửu')))) {
        line = line.replace('className="space-y-8"', 'className="space-y-8 mt-8"');
    }

    if (line.includes('rounded-[1.5rem]') && line.includes('group-hover:scale-110') && line.includes('shadow-2xl')) {
        line = line.replace('rounded-[1.5rem]', 'rounded-full');
    }

    newLines.push(line);
}

fs.writeFileSync('d:/MY PROJECTS/my-dldl-web/app/components/HeroDetailClient.tsx', newLines.join('\n'), 'utf8');
console.log('Done script9.js');
