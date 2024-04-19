const moment = require('moment');

const formateMessage = (userName, txtMsg) => {
	return {
		userName,
		txtMsg,
		time: moment().format('h:mm a'),
	};
};

module.exports = formateMessage;
