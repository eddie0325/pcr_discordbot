const EventEmitter = require('events');

// 避免呼叫指令時間太相近造成衝突, 此為一個排隊機制
class FunctionQueue extends EventEmitter {
	constructor(props) {
		super(props)
		this.list = []
	}

	push(fn) {
		this.list.push(fn)
		this.emit('push')
	}

	async run() {
		const results = await this.list[0]()
		this.list.shift()
		this.emit('pop', results)
	}
}

const queue = new FunctionQueue()

queue.on('push', () => {
	if (queue.list.length === 1) {
		queue.run()
	}
})
queue.on('pop', (results) => {
	// console.log('results', results)
	if (queue.list.length > 0) {
		queue.run()
	}
})

module.exports = queue;