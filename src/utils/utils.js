const column = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
	'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
	'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH'];

async function statusandreply(message, memberid) {
	try {
		memberName = userlist[memberid][0];
		var table = await gapi.getDemageTable(chlist[message.channel.id]); //取得當天排刀表 userlist[memberid][1]
		var status = await getstatus(table, memberName);
		// console.log(status) //obj

		var repmsg = {
			"embed":
			{
				"title": memberName + " 今日狀態",
				"color": 5301186,
				"fields": status
			}
		};
		// console.log(repmsg) //obj

		message.reply(repmsg);
	}
	catch (err) {
		console.log(err.message + ' : ' + message.author.username + ':' + message.content)
		console.log(err)
		message.reply('錯誤訊息: ' + err.message);
	}
}


async function fillandreply(message, memberid,no, demage, object, ps,sec) {
	try {
		if (object == '') {
			message.reply('請填寫輸出目標。ex: !fill 1 1 1234567 ');
			return;
		}
		if (no == '') {
			message.reply('請填寫正確隊伍。ex: !fill 1 1 1234567');
			return;
		}
		memberName = userlist[memberid][0];
		var table = await gapi.getDemageTable(chlist[message.channel.id]);
		var former_status = await getstatus(table, memberName);

		await fillindemage(message, table, memberid,no,demage, object, ps,sec);

		var table2 = await gapi.getDemageTable(chlist[message.channel.id]);
		var latter_status = await getstatus(table2, memberName);


		var repmsg = {
			"embed":
			{
				"title": memberName + " 今日狀態已更新為:",
				"color": 5301186,
				"fields": latter_status
			}
		};

		message.reply(repmsg);
	}
	catch (err) {
		console.log(err.message + ' : ' + message.author.username + ':' + message.content);
		if (err.message == 'no fillable cell') {
			var embed = {
				"title": memberName + " 今日狀態",
				"color": 5301186,
				"fields": former_status
			};
			message.reply("請重新確認要填的隊伍", { embed });
		}
		else {
			message.reply('錯誤訊息: ' + err.message);
		}
	}
}

async function fillindemage(message, table, memberid,no, demage, object, ps,sec) {
	return new Promise(async function (resolve, reject) {
		try {
			let memberName = userlist[memberid][0];  
			let row = 0;
			for (let i = 0; i < table.length; i++) {
				if (table[i][0] == memberName) row = i;
			}
			if (no == 1) j = 3;
			if (no == 2) j = 8;
			if (no == 3) j = 13;

			if (ps == '尾') {
				if (table[row][j] == '') { //如果傷害空白
					let result = await gapi.fillin(column[j] + (row + 1), [[demage]], chlist[message.channel.id], '');
					
					if (object != '') {
						result = await gapi.fillin(column[j + 1] + (row + 1), [[objlist[object]]], chlist[message.channel.id], '');
					}
					result = await gapi.fillin(column[j + 2] + (row + 1), [[true]], chlist[message.channel.id], '');
					let table2 = await gapi.getDemageTable(chlist[message.channel.id]);
					if (no == 1) {
						result = await gapi.fillin(column[20] + (row + 1), [[sec]], chlist[message.channel.id], '');
					};
					if (no == 2) {
						result = await gapi.fillin(column[21] + (row + 1), [[sec]], chlist[message.channel.id], '');
					};
					if (no == 3) {
						result = await gapi.fillin(column[22] + (row + 1), [[sec]], chlist[message.channel.id], '');
					};
					resolve(result);
					return;
				}
				throw new Error('請重新確認隊伍')
			}
			else if (ps == '殘') {      
				if (j + 10 <= table[row].length) {  
					if (table[row][j] != '') { //如果傷害空白
						if (table[row][j + 3] == '' || typeof table[row][j + 3] === 'undefined') { //殘刀傷害空白
							let result = await gapi.fillin(column[j + 3] + (row + 1), [[demage]], chlist[message.channel.id], '');
							if (object != '') {
								result = await gapi.fillin(column[j + 4] + (row + 1), [[objlist[object]]], chlist[message.channel.id], '');
							}
							resolve(result);
							return;
						}
					}
					throw new Error('尾刀未填或殘刀傷害已填')////
				}
			}
			else if (ps == '') {
				if (table[row][j] == '') { //如果傷害空白
					let result = await gapi.fillin(column[j] + (row + 1), [[demage]], chlist[message.channel.id], '');
		
					if (object != '') {
						result = await gapi.fillin(column[j + 1] + (row + 1), [[objlist[object]]], chlist[message.channel.id], '');             
					}
					resolve(result);
					return;
				}
				if (table[row][j] != '') { //未註記殘刀且殘刀傷害空白
					if (table[row][j + 3] == '' || typeof table[row][j + 3] === 'undefined') { //殘刀傷害空白
						let result = await gapi.fillin(column[j + 3] + (row + 1), [[demage]], chlist[message.channel.id], '');
						if (object != '') {
							result = await gapi.fillin(column[j + 4] + (row + 1), [[objlist[object]]], chlist[message.channel.id], '');
							resolve(result);
							return;
						}
					}
				}
				throw new Error('no fillable cell');
			}
			else {
				throw new Error('no fillable cell');
			}
		}
		catch (err) {
			// console.log(err);
			reject(err);
		}
	});
}

function getstatus(table, memberName) {
	return new Promise(function (resolve, reject) {
		let row = 0;
		for (let j = 0; j < table.length; j++) {
			if (table[j][0] == memberName) row = j
		}
		sta = [
			{
				"name": "閃退"+" _ " +"組別",
				"value": (table[row][2] ? '已用' : '未用') +" _ "+table[row][19] ,
			}
		];
		sta.push({
					"name": "剩餘刀數",
					"value": table[row][1],
				});

		//加入本刀傷害
		for (let j = 3; j <= 13; j += 5) {
			if (table[row][j] > 0) {
				sta.push({
					"name": table[0][j],
					"value": table[row][j] + ' ' + table[row][j + 1] + ' ' + (table[row][j + 2] ? '尾' : ''),
					"inline": true
				});
			}
		}
		// console.log(table[row].length)
		//加殘刀傷害
		for (let j = 6; j <= 16; j += 5) {
			if (table[row][j] > 0) {
				sta.push({
					"name": table[0][j - 3] + " 殘刀",
					"value": table[row][j] + ' ' + table[row][j + 1],
					"inline": true
				})
			}
		}

		resolve(sta);
	})
}

function getcrash(table, memberName) {
	return new Promise(function (resolve, reject) {
		let crash = false; //boss team demage
		for (let j = 0; j < table.length; j++) {
			if (table[j][0] == memberName) {
				crash = table[j][2]
			}
		}
		resolve(crash);
	})
}

function stateleftknife(table, memberName) {
	var leftknife =0;
	for (var j = 0; j < table.length; j++) {
		if (table[j][0] == memberName) {
			if (table[j][18] == "v")
				leftknife += 1;
		}
	}
	// console.log(leftknife)
	return (leftknife);
}

function getleftknife(table, memberName) {
	let leftknife = "";
	for (let j = 0; j < table.length; j++) {
		if (table[j][0] == memberName) {
			if (table[j][18] == "v")
				leftknife += "殘+";
			leftknife += table[j][1] + "刀";
		}
	}
	// console.log(leftknife)
	return (leftknife);
}

function getgroup(table, memberName) {
	let group = "";
	for (let j = 0; j < table.length; j++) {
		if (table[j][0] == memberName) {
			if (typeof table[j][19] != 'undefined') {
				// console.log(table[j][19])
				group += table[j][19] + "組"
			}
		}
	}
	return group;
}

String.format = function () {
	let s = arguments[0];
	for (let i = 0; i < arguments.length - 1; i++) {
		let reg = new RegExp("\\{" + i + "\\}", "gm");
		s = s.replace(reg, arguments[i + 1]);
	}

	return s;
}

function callefttime(baselinehour) {
	let now = new Date();

	year = now.getFullYear();
	month = now.getMonth();
	date = now.getDate();
	hour = now.getHours();
	if (hour > 5) date = date + 1;
	let deadline = new Date(year, month, date, baselinehour)
	let substract = new Date(deadline - now)

	return (Math.floor(substract.getTime() / 3600000) + "小時" + substract.getUTCMinutes() + "分" + substract.getUTCSeconds() + "秒");
}

module.exports = {
	statusandreply,
	fillandreply,
	getstatus,
	getcrash,
	stateleftknife,
	getleftknife,
	getgroup,
	callefttime
}