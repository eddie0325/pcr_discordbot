const { objlist } = require('../utils/constants.js');

module.exports = {
    name: 'recover',
    aliases: ['回復'],
    description: '回復刀表',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            if (args.length != 1) {
                message.channel.send('請輸入要回復的列表 ex: !回復 1');
                return;
            }
            let target = objlist[args[0].substring(0, 1)];
            //get bk table
            let oldctable = await gapi.getBKCollectingtable(chlist[message.channel.id], target);
            let bk_table = [...Array(31)].map(x => Array(5).fill(''));
            for (let i = 0; i < oldctable.length; i++) {
                for (let j = 0; j < oldctable[i].length; j++)
                    bk_table[i][j] = oldctable[i][j];
            }
            let result = await gapi.fillin('A1:F31', bk_table, chlist[message.channel.id], target);
            message.channel.send('指定刀表已回復');
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}