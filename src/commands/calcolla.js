module.exports = {
    name: 'calcolla',
    aliases: ['合刀試算', '合刀', '尾傷'],
    description: '合刀試算',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            let A = parseInt(args[0]);
            let sec = 0;
            let da = (90 * A) / 20;
            message.channel.send('尾刀滿返所需傷害:' + da + 'w');
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}