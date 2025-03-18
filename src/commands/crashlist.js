module.exports = {
    name: 'crashlist',
    aliases: ['閃退'],
    description: '查看閃退人員',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            let table = await gapi.getDemageTable(chlist[message.channel.id]);
            let msg = '今日閃退已用成員:(若要登記閃退請使用<!登記閃退>)\n';
            let count = 0;
            for (let i = 2; i < 32; i++) {
                if (table[i][2]) {
                    msg += table[i][0] + '\n';
                    count++;
                }
            }
            if (count > 0) 
                msg += String.format('總數 {0} 人', count);
            else 
                msg = '今日尚未有閃退紀錄';
            message.channel.send(msg);
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content)
            console.log(err)
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};