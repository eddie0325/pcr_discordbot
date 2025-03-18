module.exports = {
    name: 'remain',
    aliases: ['殘刀', '補償表', '殘'],
    description: '查看補償表',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            let table = await gapi.getDemageTable(chlist[message.channel.id]);
            // console.log(table)
            let msg = '=====未出補償刀=====\n'
            //let count = 0
            //var compenstate_count = 0
            for (var row = 2; row < 32; row++) {
                if (table[row][18] == 'v') {
                    msg += String.format('{0}: ', table[row][0]);
                    if (table[row][5] == true && table[row][6] == '') {
                        msg += String.format('來自{0} 剩餘:{1}s, ', table[row][4], table[row][20]);
                    };
                    if (table[row][10] == true && table[row][11] == '') {
                        msg += String.format('來自{0} 剩餘:{1}s,', table[row][9], table[row][21]);
                    };
                    if (table[row][15] == true && table[row][16] == '') {
                        msg += String.format('來自{0} 剩餘:{1}s', table[row][14], table[row][22]);
                    };
                    msg += '\n';
                };
            }
            message.channel.send(msg);
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content)
            console.log(err)
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};