const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { parse } = require('csv-parse/sync');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('✅ FanGraphs Stats API is live!');
});

app.get('/api/team-stats', async (req, res) => {
  try {
    const csvUrl = 'https://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=y&type=c,5,6,11,13,16,21,22,23,24,25&season=2024&month=0&season1=2024&ind=0&team=0&rost=0&age=0&filter=&players=0&export=1';

    const response = await axios.get(csvUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/csv',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      responseType: 'arraybuffer'
    });

    const csvString = response.data.toString('utf8');

    const records = parse(csvString, {
      columns: true,
      skip_empty_lines: true
    });

    const simplified = records.slice(0, 15).map(player => ({
      Name: player.Name,
      Team: player.Team,
      PA: player.PA,
      AVG: player.AVG,
      OBP: player.OBP,
      SLG: player.SLG,
      wOBA: player.wOBA,
      wRCplus: player['wRC+']
    }));

    res.json(simplified);
  } catch (error) {
    console.error('❌ CSV Fetch Error:', error.message);
    res.status(500).json({ error: 'CSV fetch failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 FanGraphs API running at http://localhost:${PORT}`);
});