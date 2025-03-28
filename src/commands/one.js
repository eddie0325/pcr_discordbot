const { getleftknife, getgroup } = require('../utils/utils.js');

module.exports = {
    name: 'one',
    aliases: ['一王', '1'],
    description: '查看一王報名人員清單和回報傷害',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            let tables = await gapi.getotable(chlist[message.channel.id], '一王');
            let ctable = tables[0];
            let dtable = tables[1]; //為了拿剩餘刀數 才讀傷害表
            let remsg = '```diff';
            remsg += `\nNo ID 剩餘  目標 ${ctable[3][0]}`;
            for (let i = 2; i < ctable[0].length; i++) {
                remsg += '\n';
                if (ctable[3][i] === 1 && ctable[5][i] === 1) remsg += '->';
                remsg += String.format('{0}  {1}', ctable[0][i], ctable[1][i]);
                remsg += ' ' + await getleftknife(dtable, ctable[1][i]);
                remsg += getgroup(dtable, ctable[1][i]) != "" ? ' ' + getgroup(dtable, ctable[1][i]) : '';
                if (ctable[2][i] === 1) remsg += ' (閃退)';
                if (ctable[3][i] === 1) remsg += ' (已進)';
                if (ctable[6][i] === 1) remsg += ' (連刀)';
                if (ctable[4][i]) remsg += ' 備註' + ctable[4][i];
            }
            remsg += '```';
            message.channel.send(remsg);
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};