import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:admin123@dld-web.wqefflo.mongodb.net/?appName=dld-web';
const HERO_ID = '69f1eaa9795fbe61c205412f'; // Đường Tam (Thần Chỉ)

async function updateData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const SoulMaster = mongoose.model('SoulMaster', new mongoose.Schema({}, { strict: false }));
    const hero = await SoulMaster.findById(HERO_ID);

    if (!hero) {
      console.error('Hero not found');
      return;
    }

    const divineSkillName = "Hải Ngục Lạc Ấn";
    const divineSkillDesc = `Đường Tam đối với đơn vị phe địch có lượng HP thấp nhất gây sát thương bằng 500% sức tấn công, đồng thời hồi phục 500 điểm Thần Lực, và bỏ qua giá trị Ý Chí để gây cho mục tiêu 1 tầng [blue|[Hải Ngục Lạc Ấn]]. Mỗi tầng khiến mục tiêu chịu sát thương cuối thêm 10%, duy trì vĩnh viễn, tối đa 50 tầng.\nTrong trạng thái [white|[Thần Thể]], cứ mỗi 6 hiệp chiến đấu trôi qua, ở đầu hiệp kế tiếp Đường Tam tự động thi triển kỹ năng này.\nTrong trạng thái [white|[Thần Giáng]], có thể chủ động thi triển kỹ năng này trong lượt của bản thân.\nDựa theo loại Hải Thần Thần Lực, kỹ năng này có thể nhận thêm hiệu quả đặc biệt:\n• Khi Hải Thần Thần Lực được liên kết với [white|[Thần Kích]]: Khi kỹ năng này được tung ra, sẽ thêm 1 tầng [blue|[Hải Ngục Lạc Ấn]] lên toàn bộ kẻ địch.\n• Khi Hải Thần Thần Lực được liên kết với [white|[Thần Nộ]]: Khi kỹ năng này được tung ra, sẽ thêm 2 tầng [blue|[Hải Ngục Lạc Ấn]] lên một mục tiêu đơn lẻ.\n• Khi Hải Thần Thần Lực được liên kết với [white|[Thần Hồn]]: Khi kỹ năng này được tung ra, sẽ hồi phục thêm 500 điểm Thần Lực.`;

    const ring1 = {
      name: "Xảo Kình",
      description: "",
      yearEffects: {
        y50k: `Mỗi tầng [blue|[Hải Ngục Lạc Ấn]] khiến chịu sát thương cuối tăng thêm 1%. Khi kỹ năng này được sử dụng lần đầu, mỗi 1 đơn vị địch còn sống sẽ khiến toàn bộ phe địch nhận thêm 1 tầng [blue|[Hải Ngục Lạc Ấn]].`,
        y100k: `Mỗi tầng [blue|[Hải Ngục Lạc Ấn]] khiến chịu sát thương cuối tăng thêm 2%. Cứ mỗi khi toàn bộ phe địch tích lũy đủ 5 tầng [blue|[Hải Ngục Lạc Ấn]], toàn bộ phe địch sẽ tăng thêm 10% chịu sát thương cuối.`,
        y500k: `Mỗi tầng [blue|[Hải Ngục Lạc Ấn]] khiến chịu sát thương cuối tăng thêm 4%. Khi Thần Lực liên kết với [white|[Thần Kích]], vào đầu lượt mỗi đơn vị địch, cứ mỗi 5 tầng [blue|[Hải Ngục Lạc Ấn]] mà đơn vị đó đang có, toàn bộ phe địch nhận thêm 1 tầng [blue|[Hải Ngục Lạc Ấn]].`,
        y1000k: `Mỗi tầng [blue|[Hải Ngục Lạc Ấn]] khiến chịu sát thương cuối tăng thêm 7%. Khi Thần Lực liên kết với [white|[Thần Kích]], mỗi 1 đơn vị địch còn sống sẽ khiến mỗi tầng [blue|[Hải Ngục Lạc Ấn]] tăng thêm 10% chịu sát thương cuối.`,
        y1000kBuffs: ["", "", "", "", "", "", "", "", ""]
      }
    };

    const ring2 = {
      name: "Lãng Tích",
      description: "",
      yearEffects: {
        y50k: `Mỗi tầng [blue|[Hải Ngục Lạc Ấn]] khiến sát thương cuối phải chịu tăng thêm 1%. Kỹ năng này, sau khi tấn công đơn vị có số tầng [blue|[Hải Ngục Lạc Ấn]] cao nhất, sẽ áp thêm 1 tầng [blue|[Hải Ngục Lạc Ấn]] lên đơn vị đó.`,
        y100k: `Mỗi tầng [blue|[Hải Ngục Lạc Ấn]] khiến sát thương cuối phải chịu tăng thêm 2%. Mỗi 10 tầng [blue|[Hải Ngục Lạc Ấn]] trên người đơn vị địch sẽ khiến đơn vị đó chịu thêm 50% sát thương cuối.`,
        y500k: `Mỗi tầng [blue|[Hải Ngục Lạc Ấn]] khiến sát thương cuối phải chịu tăng thêm 4%. Khi Thần Lực liên kết with [white|[Thần Nộ]], nếu trong trận này kỹ năng được tung nhiều lần lên cùng một mục tiêu, mỗi lần cộng thêm 1 tầng [blue|[Hải Ngục Lạc Ấn]], tối đa cộng thêm 5 tầng trong một lượt.`,
        y1000k: `Mỗi tầng [blue|[Hải Ngục Lạc Ấn]] khiến sát thương cuối phải chịu tăng thêm 7%. Khi Thần Lực liên kết với [white|[Thần Nộ]], mỗi khi có một đơn vị phe địch bị tiêu diệt, mỗi tầng [blue|[Hải Ngục Lạc Ấn]] sẽ khiến các mục tiêu còn lại chịu thêm 25% sát thương cuối.`,
        y1000kBuffs: ["", "", "", "", "", "", "", "", ""]
      }
    };

    const ring3 = {
      name: "Phù Phong",
      description: "",
      yearEffects: {
        y50k: `Mỗi tầng [blue|[Hải Ngục Lạc Ấn]] khiến sát thương cuối phải chịu tăng thêm 1%. Bản thân mỗi khi hồi 100 điểm Thần Lực, toàn thể phe ta vĩnh viễn tăng thêm 1% sát thương cuối.`,
        y100k: `Mỗi tầng [blue|[Hải Ngục Lạc Ấn]] khiến sát thương cuối phải chịu tăng thêm 2%. Bản thân mỗi khi hồi 1000 điểm Thần Lực thì giới hạn cộng dồn [blue|[Hải Ngục Lạc Ấn]] tăng thêm 1, tối đa 30 tầng.`,
        y500k: `Mỗi tầng [blue|[Hải Ngục Lạc Ấn]] khiến mục tiêu chịu thêm 4% sát thương cuối. Khi Thần Lực liên kết với [white|[Thần Hồn]], lúc thi triển kỹ năng này, mỗi đơn vị phe ta chưa hành động ngoài lượt của chính mình sẽ hồi thêm 400 điểm Thần Lực, tối đa hồi thêm 2000 điểm.`,
        y1000k: `Mỗi tầng [blue|[Hải Ngục Lạc Ấn]] khiến mục tiêu chịu thêm 7% sát thương cuối. Khi Thần Lực liên kết với [white|[Thần Hồn]], nếu toàn bộ phe ta đều chưa hành động ngoài lượt của bản thân, sẽ hồi thêm 3000 điểm Thần Lực.`,
        y1000kBuffs: ["", "", "", "", "", "", "", "", ""]
      }
    };

    // Update the first branch, first skill
    if (hero.divineSystem && hero.divineSystem.branches && hero.divineSystem.branches[0]) {
      const branch = hero.divineSystem.branches[0];
      if (branch.skills && branch.skills[0]) {
        branch.skills[0].name = divineSkillName;
        branch.skills[0].description = divineSkillDesc;
        branch.skills[0].rings = [ring1, ring2, ring3];
      }
    }

    await SoulMaster.findByIdAndUpdate(HERO_ID, { divineSystem: hero.divineSystem });
    console.log('Update successful with [color|text] format!');
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateData();
