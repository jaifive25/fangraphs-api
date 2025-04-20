const express = require('express');
const axios = require('axios');
const csv = require('csvtojson');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/team-stats', async (req, res) => {
  try {
    const url = 'https://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season=2024&month=0&season1=2024&ind=0&team=0&rost=0&age=0&filter=&players=0&csv=1';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/csv'
      }
    });

    const jsonData = await csv().fromString(response.data);
    res.json(jsonData);
  } catch (error) {
    res.status(500).json({ error: 'CSV fetch failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 FanGraphs API running at http://localhost:${PORT}`);
});