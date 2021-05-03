const wa = require('../wa.js');

exports.run = async (bot, msg, args) => {
  var image = msg.attachments.array()[0];

  const b64 = await wa.imgtob64(image)
  var json = {};
  try {
    json = await wa.callapi(b64)
  } catch (e) {
    console.log("err")
    msg.channel.send('เกิดข้อผิดพลาด')
    return;
  }
  const anime = await wa.parsejson(json)
  console.log(anime)
  msg.channel.send(`ชื่อเรื่อง ${anime.title_romaji} ตอนที่ ${anime.episode} เวลา ${anime.at} ${anime.link}`
  );
};
exports.help = {
  name: 'เมะ',
  usage: 'เมะ',
  description: 'หาเมะ'
};
