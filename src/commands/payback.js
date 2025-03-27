module.exports = {
    name: 'payback',
    aliases: ['還錢'],
    description: '還錢',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            message.channel.send("去找師哥要");
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}