const Discord = require('discord.js'),
    bot = new Discord.Client(),
    Keyv = require('keyv'),
    fs = require('fs'),
    { version } = require('./package.json'),
    { token, prefix, prefix: globalPrefix } = require('./config.json'),
    prefixes = new Keyv('sqlite://prefixes.sqlite');
prefixes.on('error', err => console.error(`(Prefixes) Keyv connection error: ${err}`));


try {
    console.log('Oni chan initializing...');
    bot.login(token).then(() => {
        console.log(`Logged in as ${bot.user.username}`);
    });
} catch (error) {
    console.log(error);
};

bot.on('ready', () => {
    return console.log(`Oni chan ready!`);
});


bot.commands = new Discord.Collection();
console.log(`Initializing commands...`);
var cmds = 0;
const cmdFiles = fs.readdirSync('./cmds');
for (const folder of cmdFiles) {
    const commandFiles = fs.readdirSync(`./cmds/${folder}`).filter(file => file.endsWith('.js'));
    cmds = commandFiles.length + cmds;
    for (const file of commandFiles) {
        const command = require(`./cmds/${folder}/${file}`);
        bot.commands.set(command.name, command);
    }
}
console.log(`Found ${cmds} commands`);




bot.on('message', async message => {
    if (message.author.bot) return;

    let args;
    if (message.guild) {
        let prefix2;

        if (message.content.startsWith(globalPrefix)) {
            prefix2 = globalPrefix;
        } else {
            const guildPrefix = await prefixes.get(message.guild.id);
            if (message.content.startsWith(guildPrefix)) prefix2 = guildPrefix;
        }

        if (!prefix2) return;
        args = message.content.slice(prefix.length).trim().split(/\s+/);

    } else {
        const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
        args = message.content.slice(slice).split(/\s+/);
    }
    const cmdName = args.shift().toLowerCase();
    const command = bot.commands.get(cmdName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
    if (!command) { return; };
    try {
        command.execute(message, args);
        console.log(`${message.author.tag} executed: '${cmdName}' args: '${args}'`);
    } catch (error) {
        console.error(error);
    };
});
