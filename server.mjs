import { createServer } from 'http';
import axios from 'axios';
import url from 'url';

const PORT = process.env.PORT || 3000;

createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const queryUrl = parsedUrl.query.url;

  if (!queryUrl) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'URL parameter is required' }));
    return;
  }

  try {
    let result;

    if (req.method === 'GET') {
      result = await axios.get(queryUrl);
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      await new Promise(resolve => req.on('end', resolve));
      const data = JSON.parse(body);
      result = await axios.post(queryUrl, data);
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.data));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
