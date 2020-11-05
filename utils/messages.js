const moment = require("moment");

function formatMessage(username, message) {
  return {
    username,
    message,
    time: moment().format("HH:mm a"),
  };
}
module.exports = formatMessage;
