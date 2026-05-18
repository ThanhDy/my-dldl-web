const fs = require('fs');
let content = fs.readFileSync('d:/MY PROJECTS/my-dldl-web/app/admin/edit/[id]/page.tsx', 'utf8');

const initialHeroTarget = `const INITIAL_HERO = {
  id: "",
  name: "",
  title: "",
  rarity: "SP",
  type: "Cường Công",
  image: "",
  builds: [{ title: "PvE" }, { title: "PvP" }],
  skillDetails: INITIAL_SKILLS,
  soulBones: INITIAL_SOUL_BONES,
  nvvCardSystem: { cards: [] },
  starUpgrades: [],
  amKhiNote: "",
  thienPhu: [],
  divineSystem: {`;

const initialHeroReplacement = `const INITIAL_SEVENTH_SKILL = {
  y250k: { name: "", description: "" },
  y350k: { name: "", description: "" },
  y400k: { name: "", description: "" },
  y450k: { name: "", description: "" },
  y500k: { name: "", description: "" },
};

const INITIAL_EIGHTH_SKILL = {
  active: { name: "", description: "" },
  passives: {
    honHoanSongHe: { name: "", description: "", unlockCondition: "" },
    nguyenHonLuc: { name: "", description: "", unlockCondition: "" },
    uyApChanThan: { name: "", description: "", unlockCondition: "" },
  }
};

const INITIAL_NINTH_SKILL = {
  active: { name: "", description: "" },
  passive: { name: "", description: "", unlockCondition: "" }
};

const INITIAL_HERO = {
  id: "",
  name: "",
  title: "",
  rarity: "SP",
  type: "Cường Công",
  image: "",
  builds: [{ title: "PvE" }, { title: "PvP" }],
  skillDetails: INITIAL_SKILLS,
  soulBones: INITIAL_SOUL_BONES,
  nvvCardSystem: { cards: [] },
  starUpgrades: [],
  amKhiNote: "",
  thienPhu: [],
  seventhSkill: INITIAL_SEVENTH_SKILL,
  eighthSkill: INITIAL_EIGHTH_SKILL,
  ninthSkill: INITIAL_NINTH_SKILL,
  divineSystem: {`;

content = content.replace(initialHeroTarget, initialHeroReplacement);

const fetchMergeTarget = `        setFormData({
          ...foundHero,
          skillDetails: mergedSkills,
          soulBones: mergedBones,
          nvvCardSystem: foundHero.nvvCardSystem || { cards: [] },
          starUpgrades: foundHero.starUpgrades || [],
          amKhiNote: foundHero.amKhiNote || "",
          thienPhu: foundHero.thienPhu || [],
          divineSystem: mergedDivine,
        });`;

const fetchMergeReplacement = `        // Merge 7th, 8th, 9th skills
        const mergedSeventhSkill = {
          ...INITIAL_SEVENTH_SKILL,
          ...(foundHero.seventhSkill || {})
        };
        const mergedEighthSkill = {
          ...INITIAL_EIGHTH_SKILL,
          ...(foundHero.eighthSkill || {}),
          active: { ...INITIAL_EIGHTH_SKILL.active, ...(foundHero.eighthSkill?.active || {}) },
          passives: {
            honHoanSongHe: { ...INITIAL_EIGHTH_SKILL.passives.honHoanSongHe, ...(foundHero.eighthSkill?.passives?.honHoanSongHe || {}) },
            nguyenHonLuc: { ...INITIAL_EIGHTH_SKILL.passives.nguyenHonLuc, ...(foundHero.eighthSkill?.passives?.nguyenHonLuc || {}) },
            uyApChanThan: { ...INITIAL_EIGHTH_SKILL.passives.uyApChanThan, ...(foundHero.eighthSkill?.passives?.uyApChanThan || {}) },
          }
        };
        const mergedNinthSkill = {
          ...INITIAL_NINTH_SKILL,
          ...(foundHero.ninthSkill || {}),
          active: { ...INITIAL_NINTH_SKILL.active, ...(foundHero.ninthSkill?.active || {}) },
          passive: { ...INITIAL_NINTH_SKILL.passive, ...(foundHero.ninthSkill?.passive || {}) }
        };

        setFormData({
          ...foundHero,
          skillDetails: mergedSkills,
          soulBones: mergedBones,
          nvvCardSystem: foundHero.nvvCardSystem || { cards: [] },
          starUpgrades: foundHero.starUpgrades || [],
          amKhiNote: foundHero.amKhiNote || "",
          thienPhu: foundHero.thienPhu || [],
          seventhSkill: mergedSeventhSkill,
          eighthSkill: mergedEighthSkill,
          ninthSkill: mergedNinthSkill,
          divineSystem: mergedDivine,
        });`;

content = content.replace(fetchMergeTarget, fetchMergeReplacement);

const updateFunctionsTarget = `  // 2. HÀM CHỌN ẢNH (CHỈ PREVIEW, KHÔNG UPLOAD)`;

const updateFunctionsReplacement = `  // --- HÀM XỬ LÝ ĐỆ THẤT, ĐỆ BÁT, ĐỆ CỬU HỒN KỸ ---
  const updateSeventhSkill = (year: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      seventhSkill: {
        ...prev.seventhSkill,
        [year]: { ...prev.seventhSkill?.[year], [field]: value }
      }
    }));
  };

  const updateEighthSkillActive = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      eighthSkill: {
        ...prev.eighthSkill,
        active: { ...prev.eighthSkill?.active, [field]: value }
      }
    }));
  };

  const updateEighthSkillPassive = (key: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      eighthSkill: {
        ...prev.eighthSkill,
        passives: {
          ...prev.eighthSkill?.passives,
          [key]: { ...prev.eighthSkill?.passives?.[key], [field]: value }
        }
      }
    }));
  };

  const updateNinthSkill = (type: 'active' | 'passive', field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      ninthSkill: {
        ...prev.ninthSkill,
        [type]: { ...prev.ninthSkill?.[type], [field]: value }
      }
    }));
  };

  // 2. HÀM CHỌN ẢNH (CHỈ PREVIEW, KHÔNG UPLOAD)`;

content = content.replace(updateFunctionsTarget, updateFunctionsReplacement);

const jsxTarget = `          {/* LƯU */}
          <div className="flex justify-end pt-8">`;

const jsxReplacement = `          {/* ĐỆ THẤT HỒN KỸ */}
          {formData.rarity !== "Thần Chỉ" && (
            <Section title="Đệ Thất Hồn Kỹ" color="blue" defaultOpen={false}>
              <div className="space-y-6">
                {[
                  { key: 'y250k', label: 'Mốc 25 vạn năm' },
                  { key: 'y350k', label: 'Mốc 35 vạn năm' },
                  { key: 'y400k', label: 'Mốc 40 vạn năm' },
                  { key: 'y450k', label: 'Mốc 45 vạn năm' },
                  { key: 'y500k', label: 'Mốc 50 vạn năm' },
                ].map(({ key, label }) => (
                  <div key={key} className="bg-slate-800/50 p-4 rounded-xl space-y-4">
                    <div className="text-blue-400 font-bold">{label}</div>
                    <input
                      placeholder="Tên hiệu ứng"
                      value={formData.seventhSkill?.[key]?.name || ''}
                      onChange={(e) => updateSeventhSkill(key, 'name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                    />
                    <textarea
                      placeholder="Mô tả hiệu ứng"
                      value={formData.seventhSkill?.[key]?.description || ''}
                      onChange={(e) => updateSeventhSkill(key, 'description', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 h-24"
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ĐỆ BÁT HỒN KỸ */}
          {formData.rarity !== "Thần Chỉ" && (
            <Section title="Đệ Bát Hồn Kỹ" color="blue" defaultOpen={false}>
              <div className="space-y-6">
                {/* Chủ động */}
                <div className="bg-slate-800/50 p-4 rounded-xl space-y-4">
                  <div className="text-blue-400 font-bold">Kỹ Năng Chủ Động</div>
                  <input
                    placeholder="Tên kỹ năng"
                    value={formData.eighthSkill?.active?.name || ''}
                    onChange={(e) => updateEighthSkillActive('name', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                  />
                  <textarea
                    placeholder="Mô tả kỹ năng"
                    value={formData.eighthSkill?.active?.description || ''}
                    onChange={(e) => updateEighthSkillActive('description', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 h-24"
                  />
                </div>

                {/* Bị động */}
                <div className="text-blue-400 font-bold mt-6 mb-2">Kỹ Năng Bị Động</div>
                {[
                  { key: 'honHoanSongHe', label: 'Hồn Hoàn Song Hệ' },
                  { key: 'nguyenHonLuc', label: 'Nguyên Hồn Lực' },
                  { key: 'uyApChanThan', label: 'Uy Áp Chân Thân' },
                ].map(({ key, label }) => (
                  <div key={key} className="bg-slate-800/50 p-4 rounded-xl space-y-4">
                    <div className="text-slate-300 font-semibold">{label}</div>
                    <input
                      placeholder="Tên kỹ năng"
                      value={formData.eighthSkill?.passives?.[key]?.name || ''}
                      onChange={(e) => updateEighthSkillPassive(key, 'name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                    />
                    <input
                      placeholder="Điều kiện mở khoá"
                      value={formData.eighthSkill?.passives?.[key]?.unlockCondition || ''}
                      onChange={(e) => updateEighthSkillPassive(key, 'unlockCondition', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                    />
                    <textarea
                      placeholder="Mô tả kỹ năng"
                      value={formData.eighthSkill?.passives?.[key]?.description || ''}
                      onChange={(e) => updateEighthSkillPassive(key, 'description', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 h-24"
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ĐỆ CỬU HỒN KỸ */}
          {formData.rarity !== "Thần Chỉ" && (
            <Section title="Đệ Cửu Hồn Kỹ" color="blue" defaultOpen={false}>
              <div className="space-y-6">
                {/* Chủ động */}
                <div className="bg-slate-800/50 p-4 rounded-xl space-y-4">
                  <div className="text-blue-400 font-bold">Kỹ Năng Chủ Động</div>
                  <input
                    placeholder="Tên kỹ năng"
                    value={formData.ninthSkill?.active?.name || ''}
                    onChange={(e) => updateNinthSkill('active', 'name', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                  />
                  <textarea
                    placeholder="Mô tả kỹ năng"
                    value={formData.ninthSkill?.active?.description || ''}
                    onChange={(e) => updateNinthSkill('active', 'description', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 h-24"
                  />
                </div>

                {/* Bị động */}
                <div className="bg-slate-800/50 p-4 rounded-xl space-y-4">
                  <div className="text-blue-400 font-bold">Kỹ Năng Khí Nguyên Thần Khí (Bị động)</div>
                  <input
                    placeholder="Tên kỹ năng"
                    value={formData.ninthSkill?.passive?.name || ''}
                    onChange={(e) => updateNinthSkill('passive', 'name', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="Điều kiện mở khoá"
                    value={formData.ninthSkill?.passive?.unlockCondition || ''}
                    onChange={(e) => updateNinthSkill('passive', 'unlockCondition', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                  />
                  <textarea
                    placeholder="Mô tả kỹ năng"
                    value={formData.ninthSkill?.passive?.description || ''}
                    onChange={(e) => updateNinthSkill('passive', 'description', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 h-24"
                  />
                </div>
              </div>
            </Section>
          )}

          {/* LƯU */}
          <div className="flex justify-end pt-8">`;

content = content.replace(jsxTarget, jsxReplacement);

fs.writeFileSync('d:/MY PROJECTS/my-dldl-web/app/admin/edit/[id]/page.tsx', content, 'utf8');
console.log('Done Edit Page');
