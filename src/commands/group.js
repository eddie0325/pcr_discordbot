module.exports = {
    name: 'gp',
    aliases: ['分組', '分組說明'],
    description: '查看分組說明',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            let table = await gapi.getGroup(chlist[message.channel.id]);
            let msg = '今日分組說明:\n';
            for (let i = 1; i < table.length; i++) {
                if (table[i][0] != '') {
                    if (typeof table[i][4] != "undefined") {
                        msg += String.format('- {0}   目標 {1}   還有 **{3}**/{4} 個名額   說明: {2}\n', table[i][0], table[i][2], table[i][4], table[i][1] - table[i][3], table[i][1]);
                    }
                    else {
                        msg += String.format('- {0}   目標 {1}   還有 **{3}**/{4} 個名額\n', table[i][0], table[i][2], table[i][4], table[i][1] - table[i][3], table[i][1]);
                    }
                }
                else break;
            }
            msg += '可使用 <!登記 組別名稱> 或 <!領取 組別名稱> 來領取組別 ex: !領取 ' + table[1][0];
            message.channel.send(msg);
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};