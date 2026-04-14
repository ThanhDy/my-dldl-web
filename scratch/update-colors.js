const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('hungthusoulrings');
    
    const update = {
      basicEffect: 'Khi bắt đầu lượt của bản thân, người đeo hy sinh 20% giá trị máu tối đa và vĩnh viễn nhận được 1 tầng [red|Địa Mạch Nguyên Linh]. Mỗi tầng giúp tăng 50% sát thương cuối cho toàn đội, cộng dồn tối đa 5 tầng.',
      yearEffects: [
        { 
          year: '10v năm', 
          effect: 'Nếu giá trị máu ban đầu của người đeo là cao nhất phe ta, mỗi tầng [red|Địa Mạch Nguyên Linh] sẽ tăng thêm 50% hiệu quả sát thương cuối.' 
        },
        { 
          year: '15v năm', 
          effect: 'Sau khi [red|Địa Mạch Nguyên Linh] cộng dồn đủ số tầng tối đa, sát thương cuối trong lượt của toàn đội sẽ tăng thêm 200%.' 
        },
        { 
          year: '20v năm', 
          effect: 'Giới hạn [red|Địa Mạch Nguyên Linh] tăng lên 10 tầng. Khi người đeo thi triển [red|Hộ Thuẫn] cho đồng đội, khiến đồng đội đó hy sinh 20% máu tối đa, bản thân người đeo sẽ vĩnh viễn nhận được 1 tầng [red|Địa Mạch Nguyên Linh]. Mỗi đồng đội chỉ kích hoạt hiệu ứng này tối đa 1 lần.' 
        },
        { 
          year: '40v năm', 
          effect: 'Sau khi [red|Địa Mạch Nguyên Linh] cộng dồn đủ số tầng tối đa, sát thương cuối trong lượt của toàn đội sẽ tăng thêm 400%.' 
        }
      ],
      updatedAt: new Date()
    };
    
    const result = await collection.updateOne(
      { name: 'Địa Mạch Nguyên Linh Sâm' },
      { $set: update }
    );
    
    console.log('Successfully updated Soul Ring data with colors:', result.modifiedCount);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
