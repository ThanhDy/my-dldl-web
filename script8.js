const fs = require('fs');
let content = fs.readFileSync('d:/MY PROJECTS/my-dldl-web/app/components/HeroDetailClient.tsx', 'utf8');

// 1. Remove 7th, 8th, 9th tab buttons by matching the label
content = content.replace(/.*label="Đệ Thất".*\n/g, '');
content = content.replace(/.*label="Đệ Bát".*\n/g, '');
content = content.replace(/.*label="Đệ Cửu".*\n/g, '');

// 2. Change activeTab === "seventh", "eighth", "ninth" to "(activeTab === 'build' || activeTab === 'skills')"
content = content.replace(
  /\{activeTab === "seventh" && hero\.seventhSkill && \(\n\s*<motion\.div initial=\{\{ opacity: 0, y: 10 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="space-y-6">/g,
  '{(activeTab === "build" || activeTab === "skills") && hero.seventhSkill && (\n              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mt-8">\n                <h3 className="text-2xl font-black text-rose-500 uppercase tracking-widest border-b border-rose-500/20 pb-4 mb-6 flex items-center gap-3">\n                  <Sparkles size={24} /> Đệ Thất Hồn Kỹ\n                </h3>'
);

content = content.replace(
  /\{activeTab === "eighth" && hero\.eighthSkill && \(\n\s*<motion\.div initial=\{\{ opacity: 0, y: 10 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="space-y-8">/g,
  '{(activeTab === "build" || activeTab === "skills") && hero.eighthSkill && (\n              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 mt-8">\n                <h3 className="text-2xl font-black text-amber-500 uppercase tracking-widest border-b border-amber-500/20 pb-4 mb-6 flex items-center gap-3">\n                  <Hexagon size={24} /> Đệ Bát Hồn Kỹ\n                </h3>'
);

content = content.replace(
  /\{activeTab === "ninth" && hero\.ninthSkill && \(\n\s*<motion\.div initial=\{\{ opacity: 0, y: 10 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className="space-y-8">/g,
  '{(activeTab === "build" || activeTab === "skills") && hero.ninthSkill && (\n              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 mt-8">\n                <h3 className="text-2xl font-black text-purple-500 uppercase tracking-widest border-b border-purple-500/20 pb-4 mb-6 flex items-center gap-3">\n                  <Crown size={24} /> Đệ Cửu Hồn Kỹ\n                </h3>'
);

// 3. Make SP+ skill image rounded-full (grid view)
// Look for className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem]...
content = content.replace(
  /className="w-16 h-16 md:w-20 md:h-20 rounded-\[1\.5rem\]/g,
  'className="w-16 h-16 md:w-20 md:h-20 rounded-full'
);

fs.writeFileSync('d:/MY PROJECTS/my-dldl-web/app/components/HeroDetailClient.tsx', content, 'utf8');
console.log('Update finished regex');
