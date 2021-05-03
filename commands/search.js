const sagiri = require('sagiri'),
  isImageUrl = require('is-image-url'),
  path = require('path'),
  notSupportedExts = new Set(['gif']),
  search = new sagiri(process.env.saucenaoAPIKey, {
    numRes: 1
  });
  require('dotenv').config(),

exports.run = async (bot, msg, args) => {
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
  let getSauce = function (image) {
    search.getSauce(image).then(response => {
      let data = response[0];
      console.log(response)
      let results = {
        title: data.original.header.title || 'ผลงานไม่มีชื่อ',
        thumbnail: data.original.header.thumbnail,
        similarity: data.similarity,
        material: data.original.data.material || 'ไม่พบ',
        characters: data.original.data.characters || 'ไม่พบ',
        creator: data.original.data.creator || 'ไม่พบ',
        site: data.site,
        url: data.url
      };
      const minSimilarity = 30;
      if (minSimilarity <= ~~results.similarity) {
        msge.edit({
          embed: {
            title: 'เจอใน ' + results.site,
            thumbnail: {
              url: results.thumbnail
            },
            description: `มาจาก: **${results.material} **\n` +
              `ตัวละคร: **${results.characters} **\n` +
              `เจ้าของผลงาน: **${results.creator} **\n` +
              `ที่มา: **[${results.site}](${results.url}) **`,
            fields: [{
              name: 'ความเป็นไปได้อื่น ๆ',
              value: "`" + response[1].similarity + "%` : [" + response[1].site + "](" + response[1].url + ")\n" +
                "`" + response[2].similarity + "%` : [" + response[2].site + "](" + response[2].url + ")\n" +
                "`" + response[3].similarity + "%` : [" + response[3].site + "](" + response[3].url + ")\n"
            }],
            color: 0x28b5b5,
            footer: {
              icon_url: msg.author.displayAvatarURL(),
              text: `รีเควสโดย ${msg.author.username} \n` +
                `ความเป็นไปได้: ${results.similarity}% \n`,
            },
          },
        });
      } else {
        console.error('🎴ค้นหาซอร์สรูปภาพ\nไม่พบผลลัพธ์ ส่งโดย ' + msg.author.tag);
        msge.edit('ไม่พบผลลัพธ์');
      }
    }).catch((error) => {
      console.error(error.message);
      msge.edit({
        embed: {
          "title": `API ผิดพลาด`,
          "color": 2667957,
          "footer": {
            "text": `รีเควสโดย ${msg.author.username}`,
            "icon_url": msg.author.displayAvatarURL()
          }
        }
      });
      error = error.toString();
      if (error.includes('ต้องแนบภาพมาด้วย') || error.includes('ไม่สามารถใช้ URL นี้ได้') || error.includes('ข้อผิดพลาด: ได้รับการตอบสนองเป็น HTML แทนที่จะเป็น JSON')) {
        console.error('🎴ค้นหาซอร์สรูปภาพ\nAPI ผิดพลาด! ส่งโดย ' + msg.author.tag);
        msge.edit({
          embed: {
            "title": `API ผิดพลาด`,
            "color": 2667957,
            "footer": {
              "text": `รีเควสโดย ${msg.author.username}`,
              "icon_url": msg.author.displayAvatarURL()
            }
          }
        });
        return;
      }
    });
  };
  if (!msg.attachments.array()[0] && !args[0]) {
    console.error('🎴ค้นหาซอร์สรูปภาพ\nไม่พบไฟล์แนบหรือ URL ของภาพ ส่งโดย ' + msg.author.tag);
    msg.channel.send({
      embed: {
        "title": `โปรดแนบภาพหรือ URL ของภาพ`,
        "color": 2667957,
        "footer": {
          "text": `รีเควสโดย ${msg.author.username}`,
          "icon_url": msg.author.displayAvatarURL()
        }
      }
    });
  } else if (msg.attachments.array()[0]) {
    console.log('🎴ค้นหาซอร์สรูปภาพ\nพบไฟล์แนบ ส่งโดย ' + msg.author.tag);
    if (isImageUrl(msg.attachments.array()[0].url) && !notSupportedExts.has(path.extname(msg.attachments.array()[0].url).slice(1).toLowerCase())) {
      getSauce(msg.attachments.array()[0].url);
    } else {
      console.error('🎴ค้นหาซอร์สรูปภาพ\nไฟล์หรือนามสกุลของไฟล์ที่แนบมาไม่ใช่รูปภาพ ส่งโดย ' + msg.author.tag);
      msg.channel.send({
        embed: {
          "title": `ไฟล์หรือนามสกุลของไฟล์ที่แนบมาไม่ใช่รูปภาพ`,
          "color": 2667957,
          "footer": {
            "text": `รีเควสโดย ${msg.author.username}`,
            "icon_url": msg.author.displayAvatarURL()
          }
        }
      });
    }
  } else if (args[0]) {
    console.log('🎴ค้นหาซอร์สรูปภาพ\nพบ URL ส่งโดย ' + msg.author.tag);
    if (isImageUrl(args[0]) && !notSupportedExts.has(path.extname(args[0]).slice(1).toLowerCase())) {
      getSauce(args[0]);
    } else {
      console.error('🎴ค้นหาซอร์สรูปภาพ\nไฟล์หรือนามสกุลของไฟล์ที่แนบมาไม่ใช่รูปภาพ ส่งโดย ' + msg.author.tag);
      msg.channel.send({
        embed: {
          "title": `ไฟล์หรือนามสกุลของไฟล์ที่แนบมาไม่ใช่รูปภาพ`,
          "color": 2667957,
          "footer": {
            "text": `รีเควสโดย ${msg.author.username}`,
            "icon_url": msg.author.displayAvatarURL()
          }
        }
      });
    }
  }
};
exports.help = {
  name: 'รูป',
  usage: 'รูป',
  description: 'หาวาร์ปรูป'
};
