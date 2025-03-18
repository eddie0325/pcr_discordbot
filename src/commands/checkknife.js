module.exports = {
    name: 'checkknife',
    aliases: ['查刀'],
    description: '查看刀數',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            let table = await gapi.getDemageTable(chlist[message.channel.id]);
            let msg = '剩餘刀數　成員(組別)\n';
            let count = 0;
            let compenstate_count = 0;
            for (var row = 2; row < 32; row++) {
                let leftknife = table[row][1];
                if (table[row][18] == 'v') 
                    compenstate_count += 1;
                let hascompensate = table[row][18] == 'v' ? '(有殘)' : '             ';
                if (leftknife == 0 && table[row][18] != 'v') 
                    continue;
                let group = (table[row][19] == '' || typeof table[row][19] === 'undefined') ? '' : String.format(' ({0})', table[row][19]);
                msg += String.format('{0}刀 {1}  {2}{3} ', leftknife, hascompensate, table[row][0], group);
                count += leftknife;
                if (leftknife < 3) {
                    msg += ' 已出: '
                    for (var i = 4; i <= 14; i += 5) {
                        let obj = table[row][i]
                        if (!obj.isNaN)
                            msg += obj + ' '
                    }
                }
                msg += '\n'
            }
            if (count == 0 && compenstate_count == 0) 
                msg = '今日已全數出完';
            else msg += String.format('總計 {0} 刀', count);
            message.channel.send(msg);
            if (count >= 30) 
                message.channel.send('吶吶吶～你各位還不快出刀啊！！');
            if (count < 30) 
                message.channel.send('喂!快出完了!不準跑去睡喔!');
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content)
            console.log(err)
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};