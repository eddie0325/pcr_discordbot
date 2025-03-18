module.exports = {
    name: 'checkgroup',
    aliases: ['查組', '分組名單'],
    description: '查看分組名單',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            let table = await gapi.getGroup(chlist[message.channel.id]);
            let grouplist = {};
            for (let i = 1; i < table.length; i++) {
                if (table[i][0] != '') {
                    grouplist[table[i][0]] = [String.format('{0}/{1}', table[i][3], table[i][1]), ''];
                }
                else break;
            }
            let Dtable = await gapi.getDemageTable(chlist[message.channel.id]);
            let unselected = '';
            for (let i = 2; i < Dtable.length - 1; i++) {
                if (Dtable[i][19] == '' || typeof Dtable[i][19] === 'undefined') {
                    unselected += Dtable[i][0] + ', ';
                }
                else {
                    // console.log(Dtable[i][19])
                    if (Dtable[i][19] in grouplist)
                        grouplist[Dtable[i][19]][1] += Dtable[i][0] + ', ';
                    else
                        unselected += Dtable[i][0] + ', ';
                }
            }
            msg = '各組別 已報人數/總人數 與 報名人員如下:\n';
            for (let i = 1; i < table.length; i++) {
                msg += String.format('- {0} ({1}) : {2}\n\n', table[i][0], grouplist[table[i][0]][0], grouplist[table[i][0]][1].substring(0, grouplist[table[i][0]][1].length - 2)); //substring去逗號
            }
            msg += '未選組 : ' + unselected.substring(0, unselected.length - 2);
            message.channel.send(msg);
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};