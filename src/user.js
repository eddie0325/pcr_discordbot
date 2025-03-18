const gapi = require('../gapi.js');
const { ssidlist } = require('../config.js');

let userlist = {}
let usercode = {}

async function loadUsers() {
    try {
        userlist = {};
        usercode = {};
        for (i in ssidlist) {
            let ul = await gapi.getUserList(ssidlist[i]);
            for (let j in ul) {
                userlist[ul[j][1]] = [ul[j][0], ssidlist[i]];
                usercode[ul[j][0]] = [ul[j][1], ssidlist[i]];
            }
        }
        console.log(userlist);
    }
    catch (err) {
        console.log(err)
        message.reply('錯誤訊息: ' + err.message);
    }
}

function getUserList() {
    return userlist;
}

function getUserCode() {
    return usercode;
}

module.exports = {
    loadUsers,
    getUserList,
    getUserCode,
};