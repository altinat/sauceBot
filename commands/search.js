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
        msg.channel.send({
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
              value: `**[${response[1].site}](${response[1].url}) **: ${response[1].similarity}%\n` +
              `**[${response[2].site}](${response[2].url}) **: ${response[2].similarity}%\n` +
              `**[${response[3].site}](${response[3].url}) **: ${response[3].similarity}%\n`
            }],
            color: 0x28b5b5,
			footer: {
			icon_url: msg.author.displayAvatarURL,
			text: `รีเควสโดย ${msg.author.username} \n` +
			`ความเป็นไปได้: ${results.similarity}% \n`,
			},
          },
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
