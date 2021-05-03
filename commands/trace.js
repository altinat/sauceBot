const wa = require('../wa.js');

exports.run = async (bot, msg, args) => {
  var image = msg.attachments.array()[0];
  const msge = await msg.channel.send("กำลังค้นหา");
  const b64 = await wa.imgtob64(image)
  var json = {};
  try {
    json = await wa.callapi(b64)
  } catch (e) {
    console.log(`🔍ค้นหาอนิเมะ\nเกิดข้อผิดพลาด ส่งโดย ` + msg.author.tag)
    msge.edit('เกิดข้อผิดพลาด')
    return;
  }
  const anime = await wa.parsejson(json);
  console.log(`🔍ค้นหาอนิเมะ\nส่งโดย ` + msg.author.tag);
  console.log(anime);
  msge.edit(`ชื่อเรื่อง ${anime.title_romaji} ตอนที่ ${anime.episode} เวลา ${anime.at} ${anime.link}`);
};
exports.help = {
  name: 'เมะ',
  usage: 'เมะ',
  description: 'หาเมะ'
};
