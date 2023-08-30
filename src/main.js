// 题目1：编写一个 People 类，使其的实例具有监听事件、触发事件、解除绑定功能。（实例可能监听多个不同的事件，也可以去除监听事件）
class People {
	constructor(name) {
		this.name = name
		this.eventListeners = {}
	}

	on(event, listener) {
		if (!this.eventListeners[event]) {
			this.eventListeners[event] = []
		}
		this.eventListeners[event].push(listener)
	}

	emit(event, text) {
		const listeners = this.eventListeners[event]
		if (listeners) {
			listeners.forEach((listener) => {
				const result = listener(text)
				if (result !== undefined) {
					console.log(`${listener(text)}`)
				}
			})
		}
	}

	off(event, listener) {
		const listeners = this.eventListeners[event]
		if (listeners) {
			const index = listeners.indexOf(listener)
			this.eventListeners[event] = listeners.splice(index, 1)
		}
	}

	sayHi() {
		console.log(`Hi, I am ${this.name}`)
	}
}
// 以下为测试代码
const say1 = (greeting) => {
	console.log(`${greeting}, nice meeting you.`)
}

const say2 = (greeting) => {
	console.log(`${greeting}, nice meeting you, too.`)
}

const jerry = new People('Jerry')
jerry.sayHi()
// => 输出：'Hi, I am Jerry'

jerry.on('greeting', say1)
jerry.on('greeting', say2)

jerry.emit('greeting', 'Hi')
// // => 输出：'Hi, nice meeting you.' 和 'Hi, nice meeting you, too'

jerry.off('greeting', say1)
jerry.emit('greeting', 'Hi')
// // => 只输出：'Hi, nice meeting you, too'

//  题目2：完成 sleep 函数，可以达到下面的效果：
const sleep = (duration) => {
	// TODO
	return new Promise((resolve, reject) => {
		setTimeout(resolve, duration)
	})
}

const anyFunc = async () => {
	console.log('123') // 输出 123
	await sleep(300) // 暂停 300 毫秒
	console.log('456') // 输出 456，但是距离上面输出的 123 时间上相隔了 300 毫秒
}
// 以下为测试代码
anyFunc()

//题目3：完成 deepGet 函数，给它传入一个对象和字符串，字符串表示对象深层属性的获取路径，可以深层次获取对象内容：
const deepGet = (obj, prop) => {
	const propArray = prop.split('.')
	let result = obj
	for (i = 0; i <= propArray.length - 1; i++) {
		const p = propArray[i]
		const hasArray = p.match(/(\w+)\[(\d+)\]/g) // 检查是否有数组
		if (result && result.hasOwnProperty(p)) {
			// 如果路径存在且路径中没有数组
			result = result[p]
		} else {
			if (result && hasArray) {
				// 如果路径中有数组
				const arrayName = p.substring(0, p.lastIndexOf('[')) // 获取数组对象的名称
				if (result.hasOwnProperty(arrayName)) {
					const index = hasArray[0].match(/\d+/g)
					result = result[arrayName][index]
				} else {
					result = undefined
				}
			} else {
				result = undefined
			}
		}
	}
	console.log(result)
}

/** 以下为测试代码 */
deepGet(
	{
		school: {
			student: { name: 'Tomy' },
		},
	},
	'school.student.name'
) // => 'Tomy'

deepGet(
	{
		school: {
			students: [{ name: 'Tomy' }, { name: 'Lucy' }],
		},
	},
	'school.students[1].name'
) // => 'Lucy'

// 对于不存在的属性，返回 undefined
deepGet({ user: { name: 'Tomy' } }, 'user.age') // => undefined
deepGet({ user: { name: 'Tomy' } }, 'school.user.age') // => undefined

// 题目4：完成 combo 函数。它接受任意多个单参函数（只接受一个参数的函数）作为参数，并且返回一个函数。它的作为用：使得类似 f(g(h(a))) 这样的函数调用可以简写为 combo(f, g, h)(a)。
const combo = (...args) => {
	let result = args[args.length - 1]
	console.log(result)
	if (args.length >= 2) {
		for (const i = args.length - 2; i >= 0; i--) {
			const f2 = args[i]
			result = f2(result)
		}
		console.log(result)
		return result
	} else {
		console.log(result)
		return result
	}
}

// /* 以下为测试代码 */
const addOne = (a) => a + 1
const multiTwo = (a) => a * 2
const divThree = (a) => a / 3
const toString = (a) => a + ''
const split = (a) => a.split('')

split(toString(addOne(multiTwo(divThree(666)))))
// => ["4", "4", "5"]

const testForCombo = combo(split, toString, addOne, multiTwo, divThree)
testForCombo(666)
// => ["4", "4", "5"]

// 题目5：有两个盘子分别放有 5 个和 7 个小球，两个朋友玩游戏：每个人轮流从两个盘子中拿小球，每人每次只能从其中一个盘子中拿，每次可以拿 1 个或者多个（不能一个都不拿），拿到最后一个小球的人算输。问开局先手和后手是否有必胜策略？如果有，请描述必胜策略。

//答：5个球为A盘，7个球为B盘。先手必胜策略：始终让两个盘中的球数目相同，第一次先拿两个，之后对方拿几个球就在另一个盘中拿几个，直到一盘被拿光
