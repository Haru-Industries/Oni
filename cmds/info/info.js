const Discord = require('discord.js'),
  Keyv = require('keyv'),
  { owners, prefix } = require('../../config.json'),
  { version, } = require('../../package.json'),
  prefixes = new Keyv('sqlite://prefixes.sqlite'),
  moment = require("moment"),
  os = require('os');
prefixes.on('error', err => logger.error(`(Info | Prefixes) Keyv connection error: ${err}`));
require("moment-duration-format");


module.exports = {
  name: 'info',
  description: 'Bot info/system info',
  aliases: ['status', 'stats'],
  category: 'info',
  usage: '[command name]',
  async execute(message, args) {
    const { commands } = message.client;
    const sendinfo = new Discord.MessageEmbed()
      .setColor('#EA28D4')
      .setTitle(`${message.client.user.username
        } v${version} `)
      .setThumbnail(message.client.user.displayAvatarURL())
      .addFields(
        { name: 'Author', value: 'Joshj23#4817', inline: true },
        { name: 'Owner', value: owners, inline: true },
        { name: 'Prefixes', value: `Default: ${prefix} \nServer: ${await prefixes.get(message.guild.id) || prefix} `, inline: true },
        { name: 'Commands', value: commands.map(command => command.name).length, inline: true },
        { name: 'Uptime', value: moment.duration(message.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]"), inline: true },
      )
      .setTimestamp()
      .setFooter('\u200B', 'https://cdn.discordapp.com/avatars/249044688571465729/667d37d074fae3b3b85167a7d1e7f955.webp?size=4096')

    message.channel.send(sendinfo);

  },
}

function formatBytes(a, b = 2) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(2)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d] };
