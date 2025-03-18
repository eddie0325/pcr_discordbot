module.exports = {
    name: 'help',
    aliases: ['說明'],
    description: '使用說明書',
    async execute(message, args, userlist, chlist, gappi) {
        try {
            let embed = {
                "title": "使用說明書",
				"description": "我是負責幫你們這些懶人工作的湊あくあ desu !",
				"color": 1500903,
				"timestamp": "2020-09-19T02:02:33.417Z",
				"image": {
					"url": "https://truth.bahamut.com.tw/artwork/202009/d18c9802a211634768fec8778c206e0a.JPG" 
				}, 
				"author": {
					"name": "湊あくあ",
					"icon_url": "https://truth.bahamut.com.tw/artwork/202009/085bbfda659f27cc885517792df8db98.JPG" 
				},
				"fields": [
					{
						"name": "<!fill 隊伍 目標 傷害 > ",
						"value": "為呼叫者填傷害，隊伍1/2/3,目標用12345或一二三四五都可以。ex: !fill 1 5 2000000 "
					},
					{
						"name": "<!fill 隊伍 目標 傷害  殘刀> ",
						"value": "補償刀(殘刀)，只要在最後加註尾或殘即可。ex: !fill 1 5 2000000  殘"
					},
					{
						"name": "<!fill 隊伍 目標 傷害 尾 秒數> ",
						"value": "收5王，並註記補償秒數56s。ex: !fill 1 5 2000000  尾 56"
					},
					{
						"name": "<!fillfor @成員 隊伍 目標 傷害 (尾/殘) 秒數> ",
						"value": "可幫tag的團員填傷害 規則同!fill"
					},
					{
						"name": "<!status> 或 <!status @成員>",
						"value": "查看呼叫者或某成員當日傷害紀錄"
					},
					{
						"name": "<!分組> 或 <!分組說明>",
						"value": "查看該頻道公會當日分組說明"
					},
					{
						"name": "<!登記 組名> 或 <!領取 組名>",
						"value": "為呼叫者登記當日組別 ex: !選組 A"
					},
					{
						"name": "<!選組 @成員 組名> 或 <!領取 @成員 組名>",
						"value": "為tag的成員登記當日組別 ex: !選組 @蒼蘭 A"
					},
					{
						"name": "<!查組>",
						"value": "查看該頻道公會每組報名人數及名單"
					},
					{
						"name": "<!remind>",
						"value": "查看該頻道公會當日剩餘刀數"
					},
					{
						"name": "<!查刀>",
						"value": "查看該頻道公會每人所剩刀數和已輸出的目標"
					},
					{
						"name": "<!殘刀> 或<!補償> 或<!殘> ",
						"value": "確認目前所有補償刀狀況"
					},
					{
						"name": "<!閃退> 或 <!crashlist>",
						"value": "查看該頻道公會當日閃退人員清單"
					},
					{
						"name": "<!登記閃退> 或 <!閃退登記>",
						"value": "登記呼叫者當日閃退"
					},
					{
						"name": "<!url> 或<!表單>",
						"value": "查看該頻道公會的傷害紀錄表"
					},
					{
						"name": "<!報刀說明>",
						"value": "取得詳細報刀指令"
					},
					
				]
            }
            message.channel.send({ embed });
        }
        catch (err) {
            console.log(err.message + ' : ' + message.author.username + ':' + message.content);
            console.log(err);
            message.reply('錯誤訊息: ' + err.message);
        }
    },
}