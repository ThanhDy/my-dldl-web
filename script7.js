const fs = require('fs');
let content = fs.readFileSync('d:/MY PROJECTS/my-dldl-web/app/components/HeroDetailClient.tsx', 'utf8');

// 1. Remove 7th, 8th, 9th tabs
const tab1 = '{hero.seventhSkill?.y250k?.name && <TabButton active={activeTab === "seventh"} onClick={() => setActiveTab("seventh")} icon={<Sparkles size={14} />} label="Đệ Thất" color="rose" />}';
const tab2 = '{(hero.eighthSkill?.active?.name || Object.values(hero.eighthSkill?.passives || {}).some((p: any) => p?.name)) && <TabButton active={activeTab === "eighth"} onClick={() => setActiveTab("eighth")} icon={<Hexagon size={14} />} label="Đệ Bát" color="amber" />}';
const tab3 = '{(hero.ninthSkill?.active?.name || hero.ninthSkill?.passive?.name) && <TabButton active={activeTab === "ninth"} onClick={() => setActiveTab("ninth")} icon={<Crown size={14} />} label="Đệ Cửu" color="pink" />}';

content = content.replace(tab1, '');
content = content.replace(tab2, '');
content = content.replace(tab3, '');

// 2. Change activeTab conditions
content = content.replace(
  '{activeTab === "seventh" && hero.seventhSkill && (\n              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">',
  '{(activeTab === "build" || activeTab === "skills") && hero.seventhSkill && (\n              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mt-8">\n                <h3 className="text-2xl font-black text-rose-500 uppercase tracking-widest border-b border-rose-500/20 pb-4 mb-6 flex items-center gap-3">\n                  <Sparkles size={24} /> Đệ Thất Hồn Kỹ\n                </h3>'
);

content = content.replace(
  '{activeTab === "eighth" && hero.eighthSkill && (\n              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">',
  '{(activeTab === "build" || activeTab === "skills") && hero.eighthSkill && (\n              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 mt-8">\n                <h3 className="text-2xl font-black text-amber-500 uppercase tracking-widest border-b border-amber-500/20 pb-4 mb-6 flex items-center gap-3">\n                  <Hexagon size={24} /> Đệ Bát Hồn Kỹ\n                </h3>'
);

content = content.replace(
  '{activeTab === "ninth" && hero.ninthSkill && (\n              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">',
  '{(activeTab === "build" || activeTab === "skills") && hero.ninthSkill && (\n              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 mt-8">\n                <h3 className="text-2xl font-black text-purple-500 uppercase tracking-widest border-b border-purple-500/20 pb-4 mb-6 flex items-center gap-3">\n                  <Crown size={24} /> Đệ Cửu Hồn Kỹ\n                </h3>'
);

// 3. SP+ skill rounded-full
content = content.replace(
  '<div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] border-2 border-white/10 relative overflow-hidden shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">',
  '<div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/10 relative overflow-hidden shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">'
);

fs.writeFileSync('d:/MY PROJECTS/my-dldl-web/app/components/HeroDetailClient.tsx', content, 'utf8');
console.log('Done script7.js');
