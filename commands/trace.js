const wa = require('../wa.js');

exports.run = async (bot, msg, args) => {
  var image = msg.attachments.array()[0];
  const msge = await msg.channel.send({
    embed: {
      "title": `กำลังค้นหา`,
      "color": 2667957,
      "footer": {
        "text": `รีเควสโดย ${msg.author.username}`,
        "icon_url": msg.author.displayAvatarURL()
      }
    }
  });
  const b64 = await wa.imgtob64(image)
  var json = {};
  try {
    json = await wa.callapi(b64)
  } catch (e) {
    console.log(`🔍ค้นหาอนิเมะ\nเกิดข้อผิดพลาด ส่งโดย ` + msg.author.tag)
    msge.edit({
      embed: {
        "title": `เกิดข้อผิดพลาด!`,
        "color": 2667957,
        "footer": {
          "text": `รีเควสโดย ${msg.author.username}`,
          "icon_url": msg.author.displayAvatarURL()
        }
      }
    })
    return;
  }
  const anime = await wa.parsejson(json);
  console.log(`🔍ค้นหาอนิเมะ\nส่งโดย ` + msg.author.tag);
  console.log(anime);
  msge.edit({
    embed: {
      "title": `${anime.title_romaji}`,
      "thumbnail": {
        "url": msg.attachments.array()[0].url
      },
      "description": `ตอนที่ ${anime.episode} \nเวลา ${anime.at} \n${anime.link}`,
      "color": 2667957,
      "footer": {
        "text": `รีเควสโดย ${msg.author.username}`,
        "icon_url": msg.author.displayAvatarURL()
      }
    }
  });
};
exports.help = {
  name: 'เมะ',
  usage: 'เมะ',
  description: 'หาเมะ'
};
