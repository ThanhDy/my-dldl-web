const fs = require('fs');
const path = require('path');

// 1. Tạo thư mục chứa dữ liệu mới nếu chưa có
const outputDir = path.join(__dirname, 'data', 'heroes');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 2. Đọc file dữ liệu cũ
const oldFilePath = path.join(__dirname, 'data', 'soulMasters.json');

try {
    const rawData = fs.readFileSync(oldFilePath, 'utf8');
    const allHeroes = JSON.parse(rawData);

    console.log(`🔍 Tìm thấy ${allHeroes.length} tướng. Đang tách file...`);

    // 3. Tách từng tướng ra file riêng
    allHeroes.forEach(hero => {
        if (!hero.id) {
            console.warn(`⚠️ Bỏ qua 1 tướng thiếu ID: ${hero.name}`);
            return;
        }

        const fileName = `${hero.id}.json`;
        const filePath = path.join(outputDir, fileName);

        fs.writeFileSync(filePath, JSON.stringify(hero, null, 2), 'utf8');
        console.log(`✅ Đã tạo: ${fileName}`);
    });

    console.log('🎉 Hoàn tất! Hãy kiểm tra thư mục data/heroes/');

} catch (error) {
    console.error('❌ Lỗi:', error.message);
    console.log('💡 Gợi ý: Kiểm tra xem file data/soulMasters.json có tồn tại không?');
}