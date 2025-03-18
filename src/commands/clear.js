module.exports = {
    name: 'clear',
    aliases: ['清除'],
    description: '清除班表',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            if (args.length != 1) {
                message.channel.send('請輸入要清除的列表 ex: !清除 一王');
                return;
            }
            //get args
            let target = objlist[args[0].substring(0, 1)];
            //backup
            let oldctable = await gapi.getotablebyRow(chlist[message.channel.id], target);
            let bk_table = [...Array(30)].map(x => Array().fill(''));
            for (let i = 0; i < oldctable.length; i++) {
                for (let j = 0; j < oldctable[i].length; j++)
                    bk_table[i][j] = oldctable[i][j];
            }
            let backupresult = await gapi.fillin('A33:G62', bk_table, chlist[message.channel.id], target);
            //write
            let firstrow = ['', '', '目標', target];
            let secondrow = ['順序', '成員名稱', '今日已閃', '進場', '回報訊息(傷害)', '殘刀', '連刀'];
            let matrix = [...Array(29)].map(x => Array(7).fill(''));
            //let matrixx = [...Array(27)].map(x => Array(2).fill('0'))
            matrix = [firstrow, secondrow, ...matrix];
            let result = await gapi.fillin('A1:G31', matrix, chlist[message.channel.id], target);
            // let resultt = await gapi.fillin('F3:G31', [...matrixx], chlist[message.channel.id], target);
            message.channel.send('班表已重置 ').then(d_msg => { d_msg.delete(5000) });
            // message.channel.send(`<@&${tag}> ${target}`)
        }
        catch (err) {
            console.log(err);
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}