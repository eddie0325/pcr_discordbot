module.exports = {
    name: 'checkboss',
    aliases: ['對王查刀'],
    description: '查看刀數',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            let table = await gapi.getDemageTable(chlist[message.channel.id]);
            let gable = await gapi.getGroup(chlist[message.channel.id]);
            let goal = args[0].substring(0, 1);
            let count = 0
            let boss = { '1': '23', '2': '24', '3': '25', '4': '26', '5': '27' }
            // console.log(table)
            let msg = '對' + objlist[goal] + '查刀\n'
            msg += '剩餘刀數　成員(組別)\n'
            for (let row = 2; row < 32; row++) {
                leftknife = table[row][1];
                if(table[row][19]== undefined) 
                    continue;
                let group =table[row][19];
                if (gable[group][5]!=goal && gable[group][6]!=goal && gable[group][7]!=goal) 
                    continue;
                let hascompensate = table[row][18] == 'v' ? '(有殘)' : '             ';
                if (leftknife == 0 && table[row][18] != 'v') 
                    continue;
                if (table[row][boss[goal]]!= 0) 
                    continue;
                let group1 = (table[row][19] == '' || typeof table[row][19] === 'undefined') ? '' : String.format(' {0}', table[row][19]);
                msg += String.format('{0}刀 {1}  {2}({3}) ', leftknife, hascompensate, table[row][0], group1);
                count +=1;
                
                if (leftknife < 3) {
                    msg += ' 已出: '
                    for (let i = 4; i <= 14; i += 5) {
                        obj = table[row][i]
                        if (!obj.isNaN)
                            msg += obj + ' ';
                    }
                }
                msg += '\n';
            }
            msg += String.format('總計 {0} 刀', count);
            message.channel.send(msg);
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content)
            console.log(err)
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};