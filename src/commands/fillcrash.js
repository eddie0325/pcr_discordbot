module.exports = {
    name: 'fillcrash',
    aliases: ['登記閃退', '閃退登記'],
    description: '登記閃退',
    async execute(message, args, userlist, chlist, gapi) {
        try {
            let table = await gapi.getDemageTable(chlist[message.channel.id]);
            for (let i = 2; i < 32; i++) {
                if (table[i][0] == userlist[message.author.id][0]) {
                    result = await gapi.fillin(String.format('C{0}', i + 1), [[true]], chlist[message.channel.id], '');
                    message.reply('喂！我有叫你閃退了嗎？');
                    return;
                }
            }
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content)
            console.log(err)
            message.reply('錯誤訊息: ' + err.message);
        }
    },
};