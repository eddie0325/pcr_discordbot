module.exports = {
    name: 'calremain',
    aliases: ['補償計算', '補償', '殘秒'],
    description: '補償計算',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            let A = parseInt(args[0]);
            let B = parseInt(args[1]);
            let C = parseInt(args[2]);
            let sec = 110 - A / B * (90);
            if (args.length >= 3) {
                sec = 110 - A / B * (90 - C);
            }
            message.channel.send('取得補償秒數:' + sec + 's');
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}