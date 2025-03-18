const { getUserCode } = require('../user.js');

module.exports = {
    name: 'call',
    aliases: ['叫'],
    description: '呼叫出刀',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            if (args.length != 1) {
                message.channel.send('請輸入要呼叫的王 ex: !call 5');
                return;
            }
            let list = objlist[args[0].substring(0, 1)];
            let tables = await gapi.getotable(chlist[message.channel.id], list);
            let ctable = tables[0];
            let msg = '要打' + list + '的出刀囉~~';
            let rowl = ctable[0].length;
            for (let i = 2; i < rowl; i++) {
                let code = getUserCode(ctable[1][i])[0];
                msg += String.format('<@!{0}>', code);
            }
            message.channel.send(msg);
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}