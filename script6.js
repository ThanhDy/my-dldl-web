const fs = require('fs');

const jsxReplacement = `
          {/* ĐỆ THẤT HỒN KỸ */}
          {!isDivine && (
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
          {!isDivine && (
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
          {!isDivine && (
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

          {/* FOOTER */}
`;

function normalizeSpaces(str) {
  return str.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
}

function updateFile(filePath, isEdit) {
  let content = fs.readFileSync(filePath, 'utf8');
  let target = '';
  
  if(isEdit) {
    target = `              </>
            )}
          </div>
        </div>
      </div>

      <BackToTop />`;
  } else {
    target = `          </div>
        </div>
      </div>
    </div>
  );
}`;
  }

  let finalReplacement = jsxReplacement.replace('{/* FOOTER */}', target);
  
  // replace isDivine with formData.rarity === "Thần Chỉ" if isEdit
  if(isEdit) {
    finalReplacement = finalReplacement.replace(/!isDivine/g, 'formData.rarity !== "Thần Chỉ"');
  }

  // To be robust against whitespace formatting, we find the index of the start of the target.
  const nTarget = normalizeSpaces(target);
  const nContent = normalizeSpaces(content);
  
  // We can just use standard replace with windows newlines handled
  if (content.includes(target)) {
    content = content.replace(target, finalReplacement);
  } else {
    const target2 = target.replace(/\n/g, '\r\n');
    if (content.includes(target2)) {
      content = content.replace(target2, finalReplacement);
    } else {
      console.log('Target not found in', filePath, 'trying relaxed match');
      // Relaxed match
      const lines = content.split(/\r?\n/);
      let matchIdx = -1;
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].includes(isEdit ? '<BackToTop />' : '</div>')) {
            // Find where to inject
        }
      }
    }
  }
  
  // Let's do a reliable replace by splitting lines
  const lines = content.split(/\r?\n/);
  let injectIdx = -1;
  if(isEdit) {
      injectIdx = lines.findIndex(l => l.includes('</>') && lines[lines.indexOf(l)+1].includes(')}'));
      if(injectIdx === -1) {
          injectIdx = lines.findIndex(l => l.includes('<BackToTop />')) - 4;
      }
  } else {
      injectIdx = lines.length - 6; 
  }
  
  if (injectIdx > 0 && !content.includes('Đệ Thất Hồn Kỹ')) {
      lines.splice(injectIdx, 0, finalReplacement);
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log('Injected safely to', filePath);
  } else {
      console.log('Already injected or not found');
  }
}

updateFile('d:/MY PROJECTS/my-dldl-web/app/admin/add/page.tsx', false);
updateFile('d:/MY PROJECTS/my-dldl-web/app/admin/edit/[id]/page.tsx', true);
