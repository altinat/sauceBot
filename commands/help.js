require('dotenv').config()

exports.run = (bot, msg, args) => {
  msg.channel.send({
    embed: {
      title: 'Help command',
      fields: [{
          name: process.env.prefix + 'รูป',
          value: 'เพื่อหาวาร์ปรูป'
        },
        {
          name: process.env.prefix + 'เมะ',
          value: 'เพื่อหาเมะ'
        }
      ],
      color: 3264944,
      footer: {
        icon_url: msg.author.displayAvatarURL(),
        text: `รีเควสโดย ${msg.author.username}`
      },
    }
  });
};
exports.help = {
  name: '+',
  usage: '+',
  description: 'Help command.'
};
