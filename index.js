var cron = require('node-cron');
const CrmSync = require('./src/orderDesk.js');
const timeNow = new Date(new Date(Date.now()).toUTCString()).toISOString()

//script runs every hour
cron.schedule('0 * * * *', () => {
    const time = new Date(new Date(Date.now()).toUTCString()).toISOString()
    console.log('working')
    CrmSync.ordersSync(time);
});

//script runs immediately
// CrmSync.ordersSync(timeNow);
