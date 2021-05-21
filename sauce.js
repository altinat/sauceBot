const path = require('path');
const fs = require('fs');
const {
  Client
} = require('discord.js');
const discordClient = new Client();
const commandsMap = new Map();
const config = require('dotenv').config()

if (!fs.existsSync('.env')) {
  console.error(`ไม่พบไฟล์ .env`);
  process.exit(1);
}

discordClient.config = config;
discordClient.commands = commandsMap;

fs.readdirSync(path.resolve(__dirname, 'commands'))
  .filter(f => f.endsWith('.js'))
  .forEach(f => {
    console.log(`กำลังโหลดคำสั่ง ${f}`);
    try {
      let command = require(`./commands/${f}`);
      if (typeof command.run !== 'function') {
        throw 'คำสั่งไม่มีฟังชันรัน!';
      } else if (!command.help || !command.help.name) {
        throw 'Command is missing a valid help object!';
      }
      commandsMap.set(command.help.name, command);
    } catch (error) {
      console.error(`ไม่สามารถโหลดคำสั่ง ${f}: ${error}`);
    }
  });

discordClient.on('ready', () => {
  console.log(`👌เข้าสู่ระบบด้วย ${discordClient.user.tag} (ID: ${discordClient.user.id})`);
  discordClient.user.setPresence({
    activity: {
      name: process.env.presence
    }
  });
  console.log(`📢Presence คือ \"${process.env.presence}\"`);
  discordClient.generateInvite({
    permissions: [
      'SEND_MESSAGES',
      'MANAGE_MESSAGES',
    ]
  }).then(invite => console.log(`👋 ใช้ลิงก์นี้เพื่อเชิญบอทเข้าสู่เซิร์ฟเวอร์: ${invite}\n----------Log----------`));
});

discordClient.on('message', message => {
  if (message.author.bot || !message.guild) {
    return;
  }
  let {
    content
  } = message;
  if (!content.startsWith(process.env.prefix)) {
    return;
  }
  let split = content.substr(process.env.prefix.length).split(' ');
  let label = split[0];
  let args = split.slice(1);
  if (commandsMap.get(label)) {
    commandsMap.get(label).run(discordClient, message, args);
  }
});

process.env.token && discordClient.login(process.env.token);
