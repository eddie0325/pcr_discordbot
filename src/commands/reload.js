module.exports = {
    name: 'reload',
    aliases: ['重新讀取'],
    description: '重新讀取成員名單',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            await user.loadUsers();
            message.reply('已重新讀取成員名單');
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}