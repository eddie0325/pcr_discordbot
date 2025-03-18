const { fillandreply } = require('../utils/utils.js');

module.exports = {
    name: 'fill',
    aliases: ['填表', '傷害'],
    description: '填傷害表',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            let memberid = message.author.id;
            let damage = parseInt(args[2]);
            if (isNaN(damage) || damage > 100000000) { message.reply('指令錯誤或數據過高!');  return;}
            let no = parseInt(args[0]);
            if (isNaN(no) || no >=4||no <= 0) { message.reply('請輸入正確順序(隊伍)');  return;}
            let sec='';
            let object = '';
            let ps = '';
            
            let arg1 = args[1].substring(0, 1);

            if (arg1 === '1' || arg1 === '2' || arg1=== '3' || arg1 === '4' || arg1 === '5'
                || arg1 === '一' || arg1 === '二' || arg1 === '三' || arg1 === '四' || arg1 === '五') {
                object = arg1;
            }

            if (args.length >= 4) {
                let arg2 = args[3].substring(0, 1);
                if (arg2 === '尾' || arg2 === '殘') ps = arg2;
                if (args.length >= 4 && ps=='尾') {
                    sec = parseInt(args[4]) 
                    if (isNaN(sec) ||sec <= 0||sec > 90) { 
                        message.reply('請輸入剩餘秒數');  
                        return;
                    }
                }
            
            }
            //  else throw new Error('不正確的fill指令: ' + message.author.username + ':' + message.content)
            await fillandreply(message, memberid, no,damage, object, ps,sec);
        }
        //例外狀況
        catch (err) {
            console.log(err);
            message.reply('請以 <!fill 第幾隊(1/2/3) 目標(1/1王/一王) 傷害數值 (尾/殘) (秒數)> 的形式呼叫');
        }
    },
};