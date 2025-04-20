const express = require('express');
const fetch = require('node-fetch');
const csv = require('csvtojson');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const TEAM_STATS_CSV_URL = 'https://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season=2024&month=0&season1=2024&ind=0&team=0&rost=0&age=0&filter=&players=0&export=1';

app.get('/api/team-stats', async (req, res) => {
  try {
    const response = await fetch(TEAM_STATS_CSV_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/csv'
      }
    });

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok || !contentType.includes('text/csv')) {
      throw new Error(`Unexpected content-type: ${contentType}`);
    }

    const csvText = await response.text();
    const json = await csv().fromString(csvText);
    res.json(json);
  } catch (error) {
    res.status(500).json({ error: 'CSV fetch failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
