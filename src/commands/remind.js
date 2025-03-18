const { callefttime } = require('../utils/utils.js');

module.exports = {
    name: 'remind',
    aliases: ['提醒'],
    description: '提醒成員',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            let table = await gapi.getDemageTable(chlist[message.channel.id]);
            let leftknife = table[32][1];
            let lefttime = callefttime(5);//以五點為基準
            if (leftknife < 30) 
                message.channel.send(String.format('再..再{1}就要換日了，還有{0}刀未出，不准給我睡著啊喂！！', leftknife, lefttime));
            else 
                message.channel.send(String.format('今天還有{0}刀未出，距離5點還有{1}', leftknife, lefttime));
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content)
            console.log(err)
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};
