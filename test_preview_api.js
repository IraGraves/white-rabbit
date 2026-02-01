import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/fs/list?path=.',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

  let data = '';
  let chunks = [];
  res.on('data', (chunk) => {
    chunks.push(chunk);
    // Only capture first few bytes as text to check valid output
    if (res.statusCode !== 200) {
      data += chunk.toString();
    }
  });

  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.log('ERROR BODY:', data);
    } else {
      const fullBuffer = Buffer.concat(chunks);
      console.log('SUCCESS. First bytes (hex):', fullBuffer.toString('hex', 0, 20));
      console.log('Total Length:', fullBuffer.length);
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
