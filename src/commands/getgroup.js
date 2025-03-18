const { aliases } = require("./fill");

module.exports = {
    name: 'getgroup',
    aliases: ['領取', '登記'],
    description: '領取組別',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            let memberid = "";
            let newGroup = "";
            if (args.length == 1) {
                memberid = message.author.id;
                newGroup = args[0];
            }
            else if (args.length == 2) {
                memberid = args[0].replace(/[^0-9\.]+/g, '');
                if (!(memberid in userlist)) {
                    message.reply('錯誤的成員名稱!');
					return;
                }
                newGroup = args[1];
            }
            else {
                message.reply('指令輸入錯誤! 請使用 <!登記 組別名稱> 進行報名 ex: !登記 A');
						return;
            }
            let table = await gappi.getGroup(chlist[message.channel.id]);
            let grouplist = {};
            for (let i = 1; i < table.length; i++) {
                if (table[i][0] != '') {
                    grouplist[table[i][0]] = table[i][1] - table[i][3];
                }
                else break;
            }
            if (!(newGroup in grouplist)) {
                message.reply('組別輸入錯誤! 請使用 <!分組> 取得今日分組說明');
						return;
            }
            if (grouplist[newGroup] <= 0) {
                message.reply('組別人數已滿! 請使用 <!查組> 取得詳細分組名單');
						return;
            }
            let Dtable = await gappi.getDemageTable(chlist[message.channel.id]);
            let row = 0;
            for (let i = 0; i < Dtable.length; i++) {
                if (Dtable[i][0] == userlist[memberid][0]) row = i;
            }
            if (row == 0) {
                throw new Error('查無此人');
            }
            let oriGroup = Dtable[row][19];
            result = await gappi.fillin(String.format('B{0}:C{0}', row + 1), [[newGroup]], chlist[message.channel.id], userlist[memberid][0]);
            if (oriGroup == '' || typeof oriGroup === 'undefined') message.reply(String.format('{1} 已分到 {0}', newGroup, Dtable[row][0]));
            else message.reply(String.format('{2} 已由 {1} 改為 {0}', newGroup, oriGroup, Dtable[row][0]));
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};