module.exports = {
    name: 'dance',
    aliases: ['舞蹈'],
    description: '舞蹈',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            let embed = {
                "image": {
					"url": "https://media.discordapp.net/attachments/700695816645378078/705445458150948975/6c119f4cc1db7481.jpg?width=356&height=498"
				},
            }
            message.channel.send({ embed });
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}