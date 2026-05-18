const fs = require('fs');
let content = fs.readFileSync('d:/MY PROJECTS/my-dldl-web/app/components/HeroDetailClient.tsx', 'utf8');

// 1. Add Tabs
const tabsTarget = `                 {isTranTam && <TabButton active={activeTab === "thien_phu"} onClick={() => setActiveTab("thien_phu")} icon={<Sparkles size={14} />} label="Thiên Phú" color="cyan" />}
                 {isVinhVinh && hero.nvvCardSystem && <TabButton active={activeTab === "nvv_cards"} onClick={() => setActiveTab("nvv_cards")} icon={<Gamepad2 size={14} />} label="Thẻ Bài" color="pink" />}
                 <TabButton active={activeTab === "bones"} onClick={() => setActiveTab("bones")} icon={<Shield size={14} />} label="Hồn Cốt" color="amber" />`;

const tabsReplacement = `                 {hero.seventhSkill?.y250k?.name && <TabButton active={activeTab === "seventh"} onClick={() => setActiveTab("seventh")} icon={<Sparkles size={14} />} label="Đệ Thất" color="rose" />}
                 {(hero.eighthSkill?.active?.name || Object.values(hero.eighthSkill?.passives || {}).some((p: any) => p?.name)) && <TabButton active={activeTab === "eighth"} onClick={() => setActiveTab("eighth")} icon={<Hexagon size={14} />} label="Đệ Bát" color="amber" />}
                 {(hero.ninthSkill?.active?.name || hero.ninthSkill?.passive?.name) && <TabButton active={activeTab === "ninth"} onClick={() => setActiveTab("ninth")} icon={<Crown size={14} />} label="Đệ Cửu" color="pink" />}
                 {isTranTam && <TabButton active={activeTab === "thien_phu"} onClick={() => setActiveTab("thien_phu")} icon={<Sparkles size={14} />} label="Thiên Phú" color="cyan" />}
                 {isVinhVinh && hero.nvvCardSystem && <TabButton active={activeTab === "nvv_cards"} onClick={() => setActiveTab("nvv_cards")} icon={<Gamepad2 size={14} />} label="Thẻ Bài" color="pink" />}
                 <TabButton active={activeTab === "bones"} onClick={() => setActiveTab("bones")} icon={<Shield size={14} />} label="Hồn Cốt" color="amber" />`;

if(content.includes(tabsTarget)) {
  content = content.replace(tabsTarget, tabsReplacement);
} else {
    // Windows line ending variant if needed
    const tabsTargetWin = tabsTarget.replace(/\n/g, '\r\n');
    content = content.replace(tabsTargetWin, tabsReplacement);
}


// 2. Add Content
const contentTarget = `            {/* HỒN CỐT (SOUL BONES) */}`;

const contentReplacement = `            {/* ĐỆ THẤT HỒN KỸ */}
            {activeTab === "seventh" && hero.seventhSkill && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {[
                  { key: 'y250k', label: '25 Vạn Năm', color: 'text-rose-400', bg: 'bg-rose-500/10' },
                  { key: 'y350k', label: '35 Vạn Năm', color: 'text-rose-400', bg: 'bg-rose-500/10' },
                  { key: 'y400k', label: '40 Vạn Năm', color: 'text-red-500', bg: 'bg-red-500/10' },
                  { key: 'y450k', label: '45 Vạn Năm', color: 'text-red-500', bg: 'bg-red-500/10' },
                  { key: 'y500k', label: '50 Vạn Năm', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                ].map(({ key, label, color, bg }) => {
                  const skill = hero.seventhSkill[key];
                  if (!skill?.name) return null;
                  return (
                    <div key={key} className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 flex gap-8 items-start shadow-xl hover:bg-white/[0.04] transition-all group">
                      <div className={\`px-6 py-3 rounded-2xl border-2 font-black text-sm flex items-center gap-2 shrink-0 shadow-2xl \${color} \${bg} border-current\`}>
                        {label} <Star size={16} fill="currentColor" />
                      </div>
                      <div className="space-y-3">
                         <h4 className={\`text-xl font-black uppercase italic tracking-tight \${color}\`}>
                           {skill.name}
                         </h4>
                         <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                           {formatText(skill.description)}
                         </p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* ĐỆ BÁT HỒN KỸ */}
            {activeTab === "eighth" && hero.eighthSkill && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Chủ động */}
                {hero.eighthSkill.active?.name && (
                  <div className="bg-gradient-to-br from-amber-500/5 to-transparent p-8 rounded-[2.5rem] border border-amber-500/20 relative shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Zap size={120} className="text-amber-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                        <Zap size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-500/50 tracking-[0.3em]">Kỹ năng chủ động</span>
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter text-amber-400">{hero.eighthSkill.active.name}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap relative z-10">
                      {formatText(hero.eighthSkill.active.description)}
                    </p>
                  </div>
                )}

                {/* Bị động */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'honHoanSongHe', label: 'Hồn Hoàn Song Hệ', icon: <Dna size={20} /> },
                    { key: 'nguyenHonLuc', label: 'Nguyên Hồn Lực', icon: <Hexagon size={20} /> },
                    { key: 'uyApChanThan', label: 'Uy Áp Chân Thân', icon: <Shield size={20} /> },
                  ].map(({ key, label }) => {
                    const skill = hero.eighthSkill.passives?.[key as 'honHoanSongHe' | 'nguyenHonLuc' | 'uyApChanThan'];
                    if (!skill?.name) return null;
                    return (
                      <div key={key} className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 space-y-6 hover:border-amber-500/30 transition-all group shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                          <div className="flex items-center gap-3 text-slate-400">
                            <span className="text-xs font-black uppercase tracking-widest">{label}</span>
                          </div>
                          <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                            Bị Động
                          </span>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-xl font-black uppercase italic tracking-tighter text-amber-400 group-hover:text-amber-300 transition-colors">
                            {skill.name}
                          </h4>
                          {skill.unlockCondition && (
                            <div className="inline-flex items-center px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-500">
                              Mở khóa: {skill.unlockCondition}
                            </div>
                          )}
                          <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                            {formatText(skill.description)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ĐỆ CỬU HỒN KỸ */}
            {activeTab === "ninth" && hero.ninthSkill && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Chủ động */}
                {hero.ninthSkill.active?.name && (
                  <div className="bg-gradient-to-br from-purple-500/5 to-transparent p-8 rounded-[2.5rem] border border-purple-500/20 relative shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Zap size={120} className="text-purple-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500">
                        <Zap size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-purple-500/50 tracking-[0.3em]">Kỹ năng chủ động</span>
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter text-purple-400">{hero.ninthSkill.active.name}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap relative z-10">
                      {formatText(hero.ninthSkill.active.description)}
                    </p>
                  </div>
                )}

                {/* Bị động */}
                {hero.ninthSkill.passive?.name && (
                  <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 space-y-6 hover:border-purple-500/30 transition-all group shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3 text-slate-400">
                        <Crown size={20} className="text-purple-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-purple-400">Khí Nguyên Thần Khí</span>
                      </div>
                      <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                        Bị Động
                      </span>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-black uppercase italic tracking-tighter text-purple-400 group-hover:text-purple-300 transition-colors">
                        {hero.ninthSkill.passive.name}
                      </h4>
                      {hero.ninthSkill.passive.unlockCondition && (
                        <div className="inline-flex items-center px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-500">
                          Mở khóa: {hero.ninthSkill.passive.unlockCondition}
                        </div>
                      )}
                      <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                        {formatText(hero.ninthSkill.passive.description)}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* HỒN CỐT (SOUL BONES) */}`;

content = content.replace(contentTarget, contentReplacement);

fs.writeFileSync('d:/MY PROJECTS/my-dldl-web/app/components/HeroDetailClient.tsx', content, 'utf8');
console.log('Done Client UI');
