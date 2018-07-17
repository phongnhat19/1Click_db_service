let 1ClickLogger = {}

const addZero = (num) => {
	if (num<10) {
		return `0${num}`
	}
	else {
		return `${num}`
	}
}

1ClickLogger.error = (message) => {
	1ClickLogger.log('error',message)
}

1ClickLogger.info = (message) => {
	1ClickLogger.log('info',message)
}

1ClickLogger.debug = (message) => {
	1ClickLogger.log('debug',message)
}

1ClickLogger.log = (type,message)=> {
	const date = new Date()
	const dateString = `${addZero(date.getDate())}/${addZero(date.getMonth()+1)}/${addZero(date.getFullYear())}`
	const timeString = `${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`
	logger.log({
		level:type,
		message:`${dateString} ${timeString}: ${message}`
	})
}

module.exports = 1ClickLogger