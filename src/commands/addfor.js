const { objlist } = require('../utils/constants.js');
const { getcrash, stateleftknife } = require('../utils/utils.js');

module.exports = {
    name: 'addfor',
    aliases: ['代報'],
    description: '幫指定成員報名王',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            let str = ':'; //組合回報訊息(args)
            if (args.length <= 1) {
                message.reply('請輸入要報名的王 ex: !addfor @成員 5 [訊息]').then(d_msg => { d_msg.delete(5000) });
                return;
            }
            let list = objlist[args[1].substring(0, 1)];
            let memberid = args[0].replace(/[^0-9\.]+/g, '');
            if (!(memberid in userlist)) {
                message.reply('錯誤的成員名稱!').then(d_msg => { d_msg.delete(5000) });
                return;
            }
            if (args.length >= 3) {
                for (let i = 2; i < args.length; i++) {
                    str += args[i] + ' ';
                }
            }
            try {
                let tables = await gapi.getotable(chlist[message.channel.id], list);
                let memberName = userlist[memberid][0];
                let ctable = tables[0];
                let dtable = tables[1];
                let crashed = await getcrash(dtable, memberName);
                if (ctable[1].indexOf(memberName) != -1) {
                    let row = ctable[1].indexOf(memberName);
                    let content = [[memberName, crashed ? 1 : 0]];
                    let leftknife = await stateleftknife(dtable, memberName);
                    let result = await gapi.fillin(`B${row + 1}:C${row + 1}`, content, chlist[message.channel.id], list);
                    content = [[str]];
                    result = await gapi.fillin(String.format('E{0}', row + 1), content, chlist[message.channel.id], list);
                    result = await gapi.fillin(`F${row + 1}`, [[leftknife]], chlist[message.channel.id], list);
                    message.reply('已在班表中,更新回覆訊息').then(d_msg => { d_msg.delete(5000) });
                    return;
                }
                //取閃退狀態
                dtable = tables[1];
                let row = ctable[0].length - 1; //插入位置
                content = [[row, memberName, crashed ? 1 : 0, 0]];
                //TODO: 取剩餘刀數
                result = await gapi.fillin(`A${row + 2}:D${row + 2}`, content, chlist[message.channel.id], list);
                content = [[str]];
                let leftknife = await stateleftknife(dtable, memberName);
                result = await gapi.fillin(String.format('E{0}', row + 2), content, chlist[message.channel.id], list);
                result = await gapi.fillin(`F${row + 2}`, [[leftknife]], chlist[message.channel.id], list);
                message.reply('報刀成功,你的編號是' + row).then(d_msg => { d_msg.delete(5000) });
            }
            catch (err) {
                console.log(err.message + ' : ' + message.author.username + ':' + message.content);
                console.log(err);
                message.reply('錯誤訊息: ' + err.message);
            }
        }
        catch (err) {
            console.log(err);
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}