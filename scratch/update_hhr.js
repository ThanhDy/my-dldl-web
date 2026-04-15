const mongoose = require('mongoose');

const text = `Khi chiến đấu bắt đầu nhận được [yellow|10] tầng [purple|Thánh Long Nhiếp Tâm], mỗi tầng khiến đơn vị địch chịu thêm [yellow|600%] sát thương cuối. Mỗi khi kết thúc hiệp chiến đấu giảm [yellow|1] tầng. Đơn vị phe ta mỗi khi tích lũy thi triển [yellow|4] lần kỹ năng, cứ mỗi [yellow|1] tầng [purple|Thánh Long Nhiếp Tâm] đang sở hữu liền nhận được [yellow|1] tầng [red|Thâm Uyên Linh Thị]. Mỗi tầng [red|Thâm Uyên Linh Thị] khiến hiệu quả của [purple|Thánh Long Nhiếp Tâm] tăng thêm [yellow|30%], mỗi tầng tính toán độc lập;

Khi người sở hữu đạt [yellow|10] tầng [red|Thâm Uyên Linh Thị], mỗi khi bắt đầu hiệp lập tức miễn phí thi triển [yellow|1] lần Đệ Nhất/Đệ Bát hồn kỹ, hiệu ứng này chỉ có hiệu lực trong [yellow|3] hiệp đầu tiên;

Khi người sở hữu đạt [yellow|20] tầng [red|Thâm Uyên Linh Thị], mỗi khi kết thúc hiệp chiến đấu [purple|Thánh Long Nhiếp Tâm] sẽ không bị giảm, và [purple|Thánh Long Nhiếp Tâm] khiến các đơn vị địch có lượng sinh lực hiện tại dưới [yellow|50%] chịu thêm [yellow|200%] sát thương cuối;

Khi người sở hữu đạt [yellow|30] tầng [red|Thâm Uyên Linh Thị], mỗi tầng [red|Thâm Uyên Linh Thị] khiến hiệu ứng của [purple|Thánh Long Nhiếp Tâm] được cường hóa thêm [yellow|100%];

Sau [yellow|3] hiệp chiến đấu, xóa bỏ toàn bộ [purple|Thánh Long Nhiếp Tâm] và [red|Thâm Uyên Linh Thị];

Khi Hoắc Vũ Hạo trang bị hồn hoàn này, phe ta có Thần Vị được kích hoạt thi triển kỹ năng, số lần đếm thi triển kỹ năng cho [purple|Thánh Long Nhiếp Tâm] tăng thêm [yellow|1];
Khi Hoắc Vũ Hạo kích hoạt [yellow|5] Tình Tự Thần Vị, nếu bản thân đang có [yellow|30] tầng [red|Thâm Uyên Linh Thị], mỗi tầng [red|Thâm Uyên Linh Thị] được tăng thêm [yellow|100%] hiệu ứng;
Khi Hoắc Vũ Hạo trang bị hồn hoàn này, đơn vị địch có sinh lực hiện tại dưới [yellow|20%] chịu thêm [yellow|200%] sát thương cuối;

Khi Y Lai Khắc Tư trang bị hồn hoàn này, kỹ năng do bản thân thi triển sẽ tính số đếm kỹ năng cho [purple|Thánh Long Nhiếp Tâm] tăng thêm [yellow|4];
Khi Y Lai Khắc Tư trang bị hồn hoàn này, mỗi khi sở hữu [yellow|1] tầng [purple|Thánh Long Nhiếp Tâm] sẽ khiến sát thương [Quét Ngang] do bản thân gây ra tăng [yellow|10%], tối đa gia tăng [yellow|100%];
Khi Y Lai Khắc Tư trang bị hồn hoàn này, sau khi đạt được [yellow|20] tầng [red|Thâm Uyên Linh Thị], sát thương cuối của bản thân sẽ tăng thêm [yellow|300%].`;

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://dldl:P7D4M2UTr1q1qf23@cluster0.db8yv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  const db = mongoose.connection.db;
  const col = db.collection('hungthusoulrings');

  await col.updateOne({ name: /Nhiếp Tâm · Thánh Long/i }, { $set: { basicEffect: text } });
  
  console.log('Update success!');
  process.exit(0);
};

require('dotenv').config({ path: '.env.local' });
run();
