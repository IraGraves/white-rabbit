import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import open from 'open';
import { processMission, fetchMissionMetadata } from './processor.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

// API Endpoints
app.get('/api/search', async (req, res) => {
  // TODO: Implement Horizons search if possible, or just accept ID
  const query = req.query.q;
  res.json({ message: `Search for ${query} not implemented yet, please use direct ID` });
});

app.get('/api/info', async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'Missing ID' });

  try {
    // const { fetchMissionMetadata } = await import('./processor.js');
    const data = await fetchMissionMetadata(id);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch Horizons info' });
  }
});

let currentStatus = 'Idle';

app.get('/api/status', (req, res) => {
  res.json({ status: currentStatus });
});

app.post('/api/generate', async (req, res) => {
  const {
    missionId,
    horizonId,
    centerId,
    startDate,
    endDate,
    stepSizeCoarse,
    stepSizeFine,
    refinementAngle,
    refinementTol,
    compressionTolerance,
  } = req.body;

  console.log(`Received generation request for ${missionId} (${horizonId})`);
  currentStatus = 'Starting...';

  try {
    const result = await processMission({
      missionId,
      horizonId,
      centerId: centerId || '500@0', // Default to SS Barycenter
      startDate, // 'YYYY-MM-DD'
      endDate, // 'YYYY-MM-DD'
      stepSizeCoarse,
      stepSizeFine,
      refinementAngle,
      refinementTol,
      compressionTolerance,
      onProgress: (msg) => {
        currentStatus = msg;
        console.log(`[Progress] ${msg}`);
      },
    });
    currentStatus = 'Complete';
    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    currentStatus = `Error: ${error.message}`;
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Mission Tool running at http://localhost:${port}`);
  open(`http://localhost:${port}`);
});
