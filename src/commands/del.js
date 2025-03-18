const { objlist } = require('../utils/constants.js');

module.exports = {
    name: 'del',
    aliases: ['收回'],
    description: '收回王',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            if (args.length != 1) {
                message.channel.send('請輸入要收回的王 ex: !del 5');
                return;
            }
            let list = objlist[args[0].substring(0, 1)];
            //let oldctable = await gapi.getotablebyRow(chlist[message.channel.id],list);
            let tables = await gapi.getotable(chlist[message.channel.id], list);
            let memberName = userlist[message.author.id][0];
            let ctable = tables[0];
            let row = ctable[1].indexOf(memberName);
            let rowl = ctable[0].length;
            let leng = rowl - row;
            let noe = [['', '', '', '', '', 0, 0]];
            let noen = [[0]];
            if (row < 0) {
                message.reply('已不在刀表中。').then(d_msg => { d_msg.delete(5000) });
                return;
            }
            if (ctable[6][row] === 1) {
                let result1 = await gapi.fillin(String.format('G{0}', row + 1), noen, chlist[message.channel.id], list);
                message.reply('已解除連刀狀態，要取消報名請再重新del一次').then(d_msg => { d_msg.delete(5000) });
                return;
            }
            if (row === rowl) {
                let resultt = await gapi.fillin(`A${row + 1}:G${row + 1}`, noe, chlist[message.channel.id], list);
                message.reply('已刪除完畢').then(d_msg => { d_msg.delete(5000) });
                return;
            }
            else if (row != rowl) {
                for (let i = row + 1; i < rowl; i++) {
                    let bk = [[ctable[1][i], ctable[2][i], ctable[3][i], ctable[4][i], ctable[5][i], ctable[6][i]]];
                    let result = await gapi.fillin(`B${i}:G${i}`, bk, chlist[message.channel.id], list);
                }
                let resultt = await gapi.fillin(`A${rowl}:G${rowl}`, noe, chlist[message.channel.id], list);
                message.reply('已刪除完畢').then(d_msg => { d_msg.delete(5000) });
                // message.channel.send(`<@&${tag}> ${target}`)
            }
        }
        catch (err) {
            console.log(err);
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}