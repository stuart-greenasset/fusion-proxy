const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/fusion-kpi', async (req, res) => {
  try {
    const { userName, systemCode, devTypeId, devIds, startTime, endTime } = req.body;

    const loginRes = await axios.post('https://sg5.fusionsolar.huawei.com/thirdData/login', {
      userName,
      systemCode
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const cookies = loginRes.headers['set-cookie'];
    const xsrf = cookies.find(c => c.includes('XSRF-TOKEN')).split(';')[0].split('=')[1];

    const kpiRes = await axios.post('https://sg5.fusionsolar.huawei.com/thirdData/getDevHistoryKpi', {
      userName,
      systemCode,
      devTypeId,
      devIds,
      startTime,
      endTime
    }, {
      headers: {
        'Content-Type': 'application/json',
        'XSRF-TOKEN': xsrf,
        'Cookie': cookies.join('; ')
      }
    });

    res.json(kpiRes.data);
  } catch (err) {
    res.status(500).send(err.response?.data || 'Something went wrong');
  }
});

app.listen(3000, () => console.log('Proxy live on port 3000'));
