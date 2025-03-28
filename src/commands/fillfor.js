const { fillandreply } = require('../utils/utils.js');

module.exports = {
    name: 'fillfor',
    aliases: ['代填', '幫填'],
    description: '代填傷害表',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            let memberid = args[0].replace(/[^0-9\.]+/g, '');
            if (!(memberid in userlist)) {
                throw new Error('錯誤的成員名稱!');
            }

            let damage = parseInt(args[3]);
            let no = parseInt(args[1]);
            if (isNaN(no) || no > 3||no < 1) { message.reply('請輸入正確順序(隊伍)');  return;}
            if (isNaN(damage)) {message.reply('指令錯誤!'); return;}
            let sec='';
            let object = '';
            let ps = '';
            let arg2 = args[2].substring(0, 1);
            if (arg2 === '1' || arg2 === '2' || arg2 === '3' || arg2 === '4' || arg2 === '5'
                || arg2 === '一' || arg2 === '二' || arg2 === '三' || arg2 === '四' || arg2 === '五') {
                object = arg2;
            }
            if (args.length >= 5) {
                let arg3 = args[4].substring(0, 1);
                if (arg3 === '尾' || arg3 === '殘') { ps = arg3;};
                if (args.length >= 5 && ps=='尾') {
                    sec = parseInt(args[5]);
                    if (isNaN(sec) ||sec <= 0||sec > 90) { 
                        message.reply('請輸入正確剩餘秒數');  
                        return;
                    }
                }
            }
            
            await fillandreply(message, memberid,no, damage, object, ps,sec);
        }
        //例外狀況
        catch (err) {
            console.log(err);
            message.reply('請以 <!fillfor @成員 第幾隊(1/2/3) 目標(1/1王/一王) 傷害數值 (尾/殘) (秒數)> 的形式呼叫');
        }
    },
};