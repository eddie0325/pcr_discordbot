module.exports = {
    name: 'all',
    aliases: ['總表'],
    description: '查看總表',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            let tables = await gapi.getalltable(chlist[message.channel.id]);
            let ctable = tables[0];
            let remsg = '順序  一王  二王  三王  四王  五王';
            for (let i = 2; i < ctable[0].length; i++) {
                if (ctable[1][i] === undefined) ctable[1][i] = 'NaN';
                if (ctable[2][i] === undefined) ctable[2][i] = 'NaN';
                if (ctable[3][i] === undefined) ctable[3][i] = 'NaN';
                if (ctable[4][i] === undefined) ctable[4][i] = 'NaN';
                if (ctable[5][i] === undefined) ctable[5][i] = 'NaN';
                remsg += '\n';
                remsg += String.format('  {0}     {1}   {2}   {3}   {4}   {5}', ctable[0][i], ctable[1][i], ctable[2][i], ctable[3][i], ctable[4][i], ctable[5][i]);
            }
            message.channel.send(remsg);
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}