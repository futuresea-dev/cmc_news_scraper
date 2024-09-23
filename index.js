const axios = require('axios');
const fs = require('fs');

const headers = ['title', 'subtitle', 'sourceName', 'maxChar', 'language', 'status', 'type', 'visibility', 'sourceUrl', 'id', 'views', 'createdAt', 'updatedAt', 'releasedAt', 'follow'];
fs.writeFileSync('output.csv', headers.toString() + "\n");

async function getAndWriteData() {
    try {
      const response = await axios.get('https://s3.coinmarketcap.com/generated/core/crypto/cryptos.json');
      const cryptoData = response.data.values;
      for (const cryptoRow of cryptoData) {
        const cryptoId = cryptoRow[0];
        const response1 = await axios.post('https://api.coinmarketcap.com/aggr/v4/content/user', 
          {"mode":"LATEST","page":1,"size":10,"language":"en","coins":[cryptoId],"newsTypes":["NEWS","ALEXANDRIA"]});
        const responseData = response1.data.data;
        for (const resData of responseData) {
            const newsData = resData.meta;
            let row = '';
            headers.forEach((header) => {
              (newsData && newsData[header]) ? (row += `${newsData[header].toString().replaceAll(",", " ")},`) : row += '';              
            });
            fs.appendFileSync('output.csv', `${row}\n`);
          }
      }
    } catch (error) {
      console.error(error);
    }
  }

  getAndWriteData();