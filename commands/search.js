const config = require('../config.json'),
  sagiri = require('sagiri'),
  isImageUrl = require('is-image-url'),
  path = require('path'),
  notSupportedExts = new Set(['gif']),
  search = new sagiri(config.saucenaoAPIKey, {
    numRes: 1
  });

exports.run = (bot, msg, args) => {
  let getSauce = function(image) {
    search.getSauce(image).then(response => {
      let data = response[0];
      console.log(response)
      let results = {
        thumbnail: data.original.header.thumbnail,
        similarity: data.similarity,
        material: data.original.data.material || 'none',
        characters: data.original.data.characters || 'none',
        creator: data.original.data.creator || 'none',
        site: data.site,
        url: data.url
      };
      const minSimilarity = 30;
      if (minSimilarity <= ~~results.similarity) {
        msg.channel.send({
          embed: {
            'title': 'หาวาร์ป',
            'image': {
              url: results.thumbnail
            },
            'fields': [{
              'name': 'ความคล้าย',
              'value': `${results.similarity}%`
            }, {
              'name': 'มาจาก',
              'value': results.material
            }, {
              'name': 'ตัวละคร',
              'value': results.characters
            } {
              'name': 'เจ้าของผลงาน',
              'value': results.creator
            } {
              'name': 'ที่มา',
              'value': `${results.site} - ${results.url}`
            }],
            'color': 0xff0000
          }
        });
      } else {
        console.error('ไม่พบผลลัพธ์');
        msg.channel.send('ไม่พบผลลัพธ์');
      }
    }).catch((error) => {
      console.error(error.message);
      error = error.toString();
      if (error.includes('ต้องแนบภาพมาด้วย') || error.includes('ไม่สามารถใช้ URL นี้ได้') || error.includes('ข้อผิดพลาด: ได้รับการตอบสนองเป็น HTML แทนที่จะเป็น JSON')) {
        console.error('API ผิดพลาด!');
        msg.channel.send('API ผิดพลาด!');
        return;
      }
    });
  };
  if (!msg.attachments.array()[0] && !args[0]) {
    console.error('ไม่พบไฟล์แนบหรือ URL ของภาพ');
    msg.channel.send('โปรดแนบภาพหรือ URL ของภาพ');
  } else if (msg.attachments.array()[0]) {
    console.log('พบไฟล์แนบ');
    if (isImageUrl(msg.attachments.array()[0].url) && !notSupportedExts.has(path.extname(msg.attachments.array()[0].url).slice(1).toLowerCase())) {
      getSauce(msg.attachments.array()[0].url);
    } else {
      console.error('ไฟล์หรือนามสกุลของไฟล์ที่แนบมาไม่ใช่รูปภาพ');
      msg.channel.send('ไฟล์หรือนามสกุลของไฟล์ที่แนบมาไม่ใช่รูปภาพ');
    }
  } else if (args[0]) {
    console.log('พบ URL');
    if (isImageUrl(args[0]) && !notSupportedExts.has(path.extname(args[0]).slice(1).toLowerCase())) {
      getSauce(args[0]);
    } else {
      console.error('ไฟล์หรือนามสกุลของไฟล์ที่แนบมาไม่ใช่รูปภาพ');
      msg.channel.send('ไฟล์หรือนามสกุลของไฟล์ที่แนบมาไม่ใช่รูปภาพ');
    }
  }
};
exports.help = {
  name: 'ส',
  usage: 'ส',
  description: 'หาวาร์ปรูป'
};
