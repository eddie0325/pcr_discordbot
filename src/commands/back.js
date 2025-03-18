const user = require('../user.js');
const { objlist } = require('../utils/constants.js');

module.exports = {
    name: 'back',
    aliases: ['退刀', '退'],
    description: '退刀',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            if (args.length != 1) {
                message.channel.send('請輸入要退刀的王 ex: !back 1');
                return;
            }
            let list = objlist[args[0].substring(0, 1)];
            let tables = await gapi.getotable(chlist[message.channel.id], list);
            let memberName = userlist[message.author.id][0];
            let ctable = tables[0];
            let row = ctable[1].indexOf(memberName); //呼叫者所在row
            let content = [[0]];
            let content1 = [[':']];
            let msg ='吶～～～還在'+ list + '裡面的可以出來囉，快點快點'+'\n 訊息已清空，已經出完刀的記得&登記傷害(fill)&更新報名表狀態';
            let rowl = ctable[0].length;
            for (let i = 2; i < rowl; i++) {
                if (ctable[3][i] === 1 && ctable[5][i] === 1) msg += '->';
                let usercode = user.getUserCode();
                let code = usercode[ctable[1][i]][0];
                msg += String.format('<@!{0}>', code);
                let result = await gapi.fillin(String.format('D{0}', i + 1), content, chlist[message.channel.id], list);
                result1 = await gapi.fillin(String.format('E{0}', i + 1), content1, chlist[message.channel.id], list);
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