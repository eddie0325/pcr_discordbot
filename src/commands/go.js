const { objlist } = require('../utils/constants.js');

module.exports = {
    name: 'go',
    aliases: ['進場', '進'],
    description: '進場',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            if (args.length != 1) {
                message.channel.send('請輸入要進場的王 ex: !進 1 ');
                return;
            }
            let list = objlist[args[0].substring(0, 1)];
            let tables = await gapi.getotable(chlist[message.channel.id], list);
            let memberName = userlist[message.author.id][0];
            let ctable = tables[0];
            let row = ctable[1].indexOf(memberName); //呼叫者所在row
            if (row < 0) {
                message.reply('不在刀表中。').then(d_msg => { d_msg.delete(5000) });
                return;
            }
            let doublecall = false; //檢查是否重複呼叫
            if (ctable[3][row] === 1) {
                doublecall = true;
            }
            let mancount = ctable[0].length - 2; //因會算到tittle
            let entercount = 0; //已進場人數
            ctable[3].forEach(function (x) { if (x === 1) entercount += 1 });
            if (!doublecall) entercount += 1; //如果未重複呼叫 進場人數要加上自己
            let count = mancount - entercount; //未進人數
            let content = [[1]];
            let result = await gapi.fillin(String.format('D{0}', row + 1), content, chlist[message.channel.id], list);
            let msg = '';
            if (count > 0) msg += String.format('{0} 已進場\n還有 {1} 個成員還沒進場', memberName, count);
            else msg += String.format('{0} 已進場\n所有成員已全數進場', memberName);
            message.reply(msg).then(d_msg => { d_msg.delete(5000) });
            //  if(memberName=='泰勒') message.channel.send(' https://media.discordapp.net/attachments/474550941883039747/771248244000948234/1603868042838.gif');
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}