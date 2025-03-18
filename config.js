// google sheet id
const ssidlist = [
	'1B59MPDbQokXq3vkEG5oG2Ef8-JccN8eWsl9r6gTew6w',  //將本行更新為你們公會的表單ID 記得放在引號裡面
]

const chlist = {
	'562681435224539141': ssidlist[0],
	'562170871213719553': ssidlist[0],
	//在這兩個頻道中填表, 都會連結到上面的第一個表單
	//'新頻道ID': ssidlist[1],
}

//channel id : role id
// const grouptaglist = {
//     '486490020690001923': '492966022194659349', 
//     '562170871213719553': '492966022194659349', 
// }

module.exports = { ssidlist, chlist };