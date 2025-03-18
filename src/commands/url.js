module.exports = {
    name: 'url',
    aliases: ['表單', '表格'],
    description: '查看表單',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            let ssid = chlist[message.channel.id];//chlist[message.channel.id]
            message.channel.send('https://docs.google.com/spreadsheets/d/' + ssid);
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content)
            console.log(err)
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};