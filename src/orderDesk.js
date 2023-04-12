const axios = require('axios');
const fs = require('fs');

require('dotenv').config();

class NewOrdersInOrderDesk {
  static orders = [];
  static apiUrl = 'https://app.orderdesk.me/api/v2/orders';
  static config = {
    headers: {
      'ORDERDESK-API-KEY': process.env.ORDERDESK_API_KEY,
      'ORDERDESK-STORE-ID': process.env.ORDERDESK_STORE_ID,
      'Content-Type': 'application/json',
    }
  };

  static async getLastOrders(time) {
    const url = `${this.apiUrl}?search_start_date=${time}`;
    const orderIds = await axios
        .get(url, this.config)
        .then((response) => response.data.orders.map(order => order.id))
        .catch((error) => console.log(error));
    return orderIds;
  }

  static async getAddress(orderId) {
    const url = `${this.apiUrl}/${orderId}`;
    const address = await axios
      .get(url, this.config)
      .then((response) => {
        const shippingInfo = response.data.order.shipping;
        const { postal_code, address1, address2, address3, address4, city, state, country } = shippingInfo;
        return `${(address1 || address2 || address3 || address4)} ${city} ${(state)} ${postal_code} ${country}`.replaceAll(/\s+/g, ' ').trim();
      })
      .catch((error) => console.log(error));
    return address;
  }

  static async ordersSync() {
    const time = new Date(new Date(Date.now()).toUTCString()).toISOString().slice(0, 10);

    const newOrders = await this.getLastOrders(time);

    try {
        if (newOrders.length > 0) {
            for (const orderId of newOrders) {
                const shippingAddress = await this.getAddress(orderId);
                const output = `OrderId: ${orderId}, Shipping address: ${JSON.stringify(shippingAddress)}`;
                console.log(output)
                this.orders.push(output);
            }
            fs.writeFileSync("logs.txt",` ${this.orders} `);
              
        } else {
            console.log('No new orders at this time.');
        }
    } catch (error) {
      console.log(error);
    }
  }

  static start () {
    this.ordersSync(); 
  }
}

module.exports = NewOrdersInOrderDesk;