import fs from 'node:fs';
import { processMission } from './processor.js';

async function runTest() {
  console.log('Running test for Voyager 1 (1 day)...');
  try {
    const result = await processMission({
      missionId: 'test_voyager1',
      horizonId: '-31',
      centerId: '500@0',
      startDate: '1980-01-01',
      endDate: '1980-01-04',
    });

    console.log('Reading back binary...');
    const nodeBuffer = fs.readFileSync(result.path);

    // Correct way to read TypedArray from Node Buffer
    const data = new Float64Array(
      nodeBuffer.buffer,
      nodeBuffer.byteOffset,
      nodeBuffer.byteLength / 8
    );

    console.log(`Binary Size: ${nodeBuffer.byteLength} bytes`);
    console.log(`Float64 count: ${data.length}`);

    // Stride 7 check
    if (data.length % 7 !== 0) {
      console.error('ERROR: Data length not divisible by 7!');
    } else {
      console.log('Structure OK (Stride 7)');
      console.log('Sample P0:', data.slice(0, 7));
    }
  } catch (e) {
    console.error('Test Failed:', e);
  }
}

runTest();
