const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

const { chlist } = require('./config.js');
const user = require('./src/user.js');
const gapi = require('./gapi.js');
const queue = require("./src/queue");
const auth = require('./auth.json');
const token = auth.token;


const objlist = { "1": "一王", "2": "二王", "3": "三王", "4": "四王", "5": "五王", "一": "一王", "二": "二王", "三": "三王", "四": "四王", "五": "五王" }


client.commands = new Map(); // 用 Map 來存放指令
const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.name, command);

    // **處理別名**
    if (command.aliases) {
        for (const alias of command.aliases) {
            client.commands.set(alias, command);
        }
    }
}

var channelid = '' //channel to broadcast from direct message 

client.on('ready', async () => {
    await user.loadUsers();
	console.log(client.user.username + " is ready.");
});

client.on('message', async message => {

	if (message.author.bot) return;

	if (message.content.substring(0, 1) === "!" || message.content.substring(0, 1) === "！") {

		const args = message.content.slice(1).trim().split(/ +/g);
		const commandName = args.shift().toLowerCase();

		const userlist = user.getUserList();
		if (message.author.id in userlist && message.channel.id in chlist) {

			if (client.commands.has(commandName)) {
				queue.push(async () => {
					console.log("test3");
					try {
						await client.commands.get(commandName).execute(message, args, userlist, chlist, gapi);
					} catch (error) {
						console.error(error);
						message.reply("執行指令時發生錯誤!");
					}
				});
			}
		}
	}
});


client.login(token);

/***************************************/


