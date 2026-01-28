import { Router } from 'express';
import { join, dirname } from 'node:path';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';

const router = Router();

export default function (scriptPath) {
  // 1. Get Config
  router.get('/config', async (req, res) => {
    try {
      const configName = req.query.name || 'tiler_config';
      const configPath = join(dirname(scriptPath), `${configName}.json`);

      if (existsSync(configPath)) {
        const data = await fs.readFile(configPath, 'utf-8');
        res.json(JSON.parse(data));
      } else {
        res.json({}); // Empty default
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // 2. Save Config
  router.post('/config', async (req, res) => {
    try {
      const configName = req.query.name || 'tiler_config';
      const configPath = join(dirname(scriptPath), `${configName}.json`);

      await fs.writeFile(configPath, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
