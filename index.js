var cron = require('node-cron');
const NewOrdersInOrderDesk = require('./src/orderDesk.js');

//script runs every hour
// cron.schedule('0 * * * *', () => {
//     console.log('working')
//     NewOrdersInOrderDesk.start();
// });

//script runs immediately
NewOrdersInOrderDesk.start();
