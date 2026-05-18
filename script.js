const fs = require('fs');
let content = fs.readFileSync('d:/MY PROJECTS/my-dldl-web/data/types.ts', 'utf8');

const target = '  };\n}\n\n//==========================================================================';
const targetWin = '  };\r\n}\r\n\r\n//==========================================================================';

const replacement = `  };

  // Hệ thống Đệ thất, Đệ bát, Đệ cửu hồn kỹ
  seventhSkill?: {
    y250k: { name: string; description: string };
    y350k: { name: string; description: string };
    y400k: { name: string; description: string };
    y450k: { name: string; description: string };
    y500k: { name: string; description: string };
  };
  eighthSkill?: {
    active?: { name: string; description: string };
    passives?: {
      honHoanSongHe?: { name: string; description: string; unlockCondition?: string };
      nguyenHonLuc?: { name: string; description: string; unlockCondition?: string };
      uyApChanThan?: { name: string; description: string; unlockCondition?: string };
    };
  };
  ninthSkill?: {
    active?: { name: string; description: string };
    passive?: { name: string; description: string; unlockCondition?: string }; // Khí Nguyên Thần Khí
  };
}

//==========================================================================`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
} else {
  content = content.replace(targetWin, replacement);
}

fs.writeFileSync('d:/MY PROJECTS/my-dldl-web/data/types.ts', content, 'utf8');
console.log('Done');
