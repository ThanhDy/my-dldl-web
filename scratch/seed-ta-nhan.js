const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('hungthusoulrings');
    
    const doc = {
      name: 'Siêu · Tà Nhãn Bạo Quân',
      image: 'https://res.cloudinary.com/dom5kcwri/image/upload/v1713080000/hung-thu-soul-rings/placeholder.png',
      systems: ['Khống Chế'],
      type: 'Regular',
      basicEffect: 'Khi người sở hữu hồn hoàn này thi triển hồn kỹ, bỏ qua chỉ số Ý Chí, gây 1 tầng [purple|Tà Nhãn Ngưng Thị] (Ánh nhìn tà nhãn) lên toàn thể đơn vị phe địch. Nếu thi triển trong hiệp của mình thì gây thêm 1 tầng. Mỗi tầng tăng độc lập 14% sát thương cuối phải chịu, tối đa cộng dồn 20 tầng. Sau khi đơn vị địch thi triển bất kỳ kỹ năng nào, số tầng [purple|Tà Nhãn Ngưng Thị] trên đơn vị đó giảm 1 tầng. Sau 30 hiệp đấu trên chiến trường, Tà Nhãn Bạo Quân nhận hiệu ứng [purple|Siêu Tần], hiệu quả của [purple|Tà Nhãn Ngưng Thị] tăng 200%.',
      yearEffects: [
        { 
          year: '20v năm', 
          effect: 'Mỗi tầng [purple|Tà Nhãn Ngưng Thị] tăng độc lập 16% sát thương cuối phải chịu.' 
        },
        { 
          year: '30v năm', 
          effect: 'Trong hiệp của bản thân, khi người sở hữu hồn hoàn này gây hiệu ứng Khống Chế lên kẻ địch, sẽ khiến số tầng [purple|Tà Nhãn Ngưng Thị] trên toàn thể phe địch tăng gấp đôi. Hiệu ứng này kích hoạt tối đa 2 lần mỗi trận chiến.' 
        },
        { 
          year: '40v năm', 
          effect: 'Mỗi tầng [purple|Tà Nhãn Ngưng Thị] tăng độc lập 18% sát thương cuối phải chịu.' 
        },
        { 
          year: '50v năm', 
          effect: 'Sau khi [purple|Tà Nhãn Ngưng Thị] đạt tối đa tầng, hiệu quả của nó tăng thêm 300%. Trong chế độ thi đấu PvP, khi đơn vị địch lần đầu đạt 3 tầng [purple|Tà Nhãn Ngưng Thị] sẽ không thể hồi phục hồn lực, duy trì 1 hiệp chiến trường.' 
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(doc);
    console.log('Successfully added Sieu Ta Nhan Bao Quan with ID:', result.insertedId);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
