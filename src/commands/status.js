
const { statusandreply } = require('../utils/utils.js');

module.exports = {
    name: 'status',
    aliases: ['狀態'],
    description: '查看狀態',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            // 預設查自己的
            let memberid = message.author.id;
            // 查別人的
            if (args.length == 1) {
                memberid = args[0].replace(/[^0-9\.]+/g, '');
                if (!(memberid in userlist)) {
                    message.reply('錯誤的成員名稱');
                    return;
                }
            }
            statusandreply(message, memberid)
        }
        //例外狀況
        catch (err) {
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};