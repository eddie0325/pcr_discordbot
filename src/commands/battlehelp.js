module.exports = {
    name: 'battlehelp',
    aliases: ['報刀說明'],
    description: '取得詳細報刀指令',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            let embed = {
                "title": "報刀功能說明",
                "description": "本功能與傷害紀錄表中的分頁連動，若有換人需求可至排刀表手動修改\n本功能也可用於出刀報數，方便統計報名者，並隨時查看名單", /******************* */
                "color": 1500903,
                "fields": [
                    {
                        "name": "<!add 1 [回報訊息(傷害)]>或<!報 1 [回報訊息(傷害)]>",
                        "value": "報名一王並登記傷害，add 2~add 5 2~5王指令  EX:!add 1 500W\n重複指令可覆蓋訊息"
                    },
                    {
                        "name": "<!addfor @成員 1 [回報訊息(傷害)]>或<!代報  @成員1 [回報訊息(傷害)]>",
                        "value": "代替@成員報名一王並登記傷害，add 2~add 5 2~5王指令  EX:!add 1 500W\n重複指令可覆蓋訊息"
                    },
                    {
                        "name": "<!dadd 1 [回報訊息(傷害)]>",
                        "value": "報名一王連刀狀態，dadd 2~dadd 5 2~5王指令  EX:!dadd 1 500W\n重複指令可覆蓋訊息"
                    },
                    {
                        "name": "<!進 1> 或 <!go 1>",
                        "value": "登記進場 1王"
                    },
                    {
                        "name": "<!退 1> 或 <!back 1>",
                        "value": "王死退刀，取消所有人進場狀態，收尾者使用，請務必確認該王已倒 "
                    },
                    {
                        "name": "<!all> 或 <!總表>",
                        "value": "查看各王報名狀況(預設前9位)"
                    },
                    {
                        "name": "<!1> 或<!one> 或 <!一王>",
                        "value": "查看一王報名人員清單和回報傷害，二王指令 !二王/two/2"
                    },
                    {
                        "name": "<!call 1> 或 <!叫 1>",
                        "value": "呼叫報名一王的成員"
                    },
                    {
                        "name": "<!del 1> 或 <!收回 1>",
                        "value": "刪除/收回 1王的報名列表"
                    },
                    {
                        "name": "<!delfor @成員 1> 或 <!代刪 @成員 1>",
                        "value": "幫 @成員 刪除/收回 1王的報名列表"
                    },
                    {
                        "name": "<!清除 1> 或<!clear 1>",
                        "value": "重置指定班表 "
                    },
                    {
                        "name": "<!回復 1> 或<!recover 1>",
                        "value": "回復上次重整前備份名單"
                    },
                ]
            };
            message.channel.send({ embed });
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}