const axios = require('axios');
const fs = require('fs');

require('dotenv').config();

class CrmSync { 
  static orders = [];
  static apiUrl = process.env.API_URL;
  static config = {
    headers: {
      'ORDERDESK-API-KEY': process.env.ORDERDESK_API_KEY,
      'ORDERDESK-STORE-ID': process.env.ORDERDESK_STORE_ID,
      'Content-Type': 'application/json',
    }
  };

  static async getLastOrders(startTime, endTime) {
    const url = `${this.apiUrl}?search_start_date=${startTime}&search_end_date=${endTime}`;
    const orderIds = await axios
        .get(url, this.config)
        .then((response) => { return response.data.orders })
        .catch((error) =>  console.error(error.message));
    return orderIds;
  }

  static async ordersSync(time) {
    const startTime = new Date(new Date(Date.now(time) - 60 * 60 * 1000).toUTCString()).toISOString();
    const newOrders = await this.getLastOrders(startTime, time);
    try {
        if (!newOrders) {
          throw new Error('Request failed with status code 401')  
        } else if (newOrders.length > 0) {
            for (const order of newOrders) {
              const shippingInfo = order.shipping;
              const output = `OrderId: ${order.id}, Shipping address: ${shippingInfo?.address1} ${shippingInfo?.address2} ${(shippingInfo?.address3 || shippingInfo?.address4)} ${shippingInfo?.city} ${shippingInfo.state} ${shippingInfo?.postal_code} ${shippingInfo?.country}`;
              console.log(output)
              fs.appendFileSync("logs.txt",` ${output}\n`);
            }
        } else {
            console.log('No new orders at this time.');
        }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = CrmSync;