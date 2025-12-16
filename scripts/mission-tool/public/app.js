const form = document.getElementById('generateForm');
const logOutput = document.getElementById('logOutput');
const statusBadge = document.getElementById('statusIndicator');
const statusArea = document.getElementById('statusArea');
const generateBtn = document.getElementById('generateBtn');

// Threshold Inputs
const presetSelect = document.getElementById('fidelityPreset');
const angleInput = document.getElementById('refinementAngle');
const tolInput = document.getElementById('refinementTol');
const compInput = document.getElementById('compressionTolerance');

const presets = {
  standard: { angle: 15, tol: 50, comp: 50 },
  high: { angle: 5, tol: 5, comp: 5 },
  very_high: { angle: 2, tol: 1, comp: 1 },
  extreme: { angle: 1, tol: 0.1, comp: 0.1 },
};

presetSelect.addEventListener('change', () => {
  const val = presetSelect.value;
  if (presets[val]) {
    angleInput.value = presets[val].angle;
    tolInput.value = presets[val].tol;
    compInput.value = presets[val].comp;
  }
});

[angleInput, tolInput, compInput].forEach((input) => {
  input.addEventListener('input', () => {
    presetSelect.value = 'custom';
  });
});

function log(msg) {
  const time = new Date().toLocaleTimeString();
  logOutput.textContent += `[${time}] ${msg}\n`;
  logOutput.scrollTop = logOutput.scrollHeight;
}

const horizonInput = document.getElementById('horizonId');
horizonInput.addEventListener('blur', async () => {
  const id = horizonInput.value;
  if (!id) return;

  log(`Fetching metadata for ${id}...`);
  try {
    const res = await fetch(`/api/info?id=${id}`);
    const data = await res.json();

    if (data.start) {
      document.getElementById('startDate').value = data.start;
      log(`Found start date: ${data.start}`);
    }
    if (data.end) {
      document.getElementById('endDate').value = data.end;
      log(`Found end date: ${data.end}`);
    }
    if (data.name) {
      log(`Identified Object: ${data.name}`);
      const missionIdInput = document.getElementById('missionId');
      if (!missionIdInput.value) {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        missionIdInput.value = slug;
        log(`Auto-suggested filename: "${slug}"`);
      }
    }

    if (!data.start && !data.end) {
      log('Could not parse dates automatically. Please check raw response in server logs.');
    }
  } catch (e) {
    log(`Failed to fetch info: ${e.message}`);
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Prevent double submit
  generateBtn.disabled = true;
  generateBtn.textContent = 'Processing...';
  statusArea.classList.remove('hidden');
  statusBadge.textContent = 'Running';
  statusBadge.style.background = '#eab308'; // yellow

  log('Starting generation process...');

  const formData = new FormData(form);
  const data = {
    missionId: formData.get('missionId'),
    horizonId: formData.get('horizonId'),
    centerId: formData.get('centerId'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    stepSizeCoarse: formData.get('stepSizeCoarse') || '1 d',
    stepSizeFine: formData.get('stepSizeFine') || '10 m',
    refinementAngle: formData.get('refinementAngle') || '15',
    refinementTol: formData.get('refinementTol') || '50',
    compressionTolerance: formData.get('compressionTolerance') || '50',
  };

  log(`Requesting data for ${data.missionId} (${data.horizonId})...`);

  // Start polling status
  let lastStatus = '';
  const statusTimer = setInterval(async () => {
    try {
      const sRes = await fetch(`/api/status?_t=${Date.now()}`);
      const sData = await sRes.json();
      if (sData.status !== lastStatus && sData.status !== 'Idle' && sData.status !== 'Complete') {
        log(sData.status);
        statusBadge.textContent = 'Running';
        lastStatus = sData.status;
      }
    } catch {
      // ignore poll errors
    }
  }, 1000);

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    clearInterval(statusTimer);

    const result = await res.json();

    if (result.success) {
      log(`Success! Data saved to: ${result.result.path}`);
      log(`Final Point Count: ${result.result.count}`);

      if (result.result.originalCount) {
        log(`Original Point Count: ${result.result.originalCount}`);
        const compression = (1 - result.result.count / result.result.originalCount) * 100;
        log(`Compression: ${compression.toFixed(2)}%`);
      }

      if (result.result.segmentsRefined >= 0 && result.result.segmentStats) {
        log(`\n--- Detailed Segment Stats ---`);

        // Build a text table
        const pad = (str, len) => (str + ' '.repeat(len)).slice(0, len);
        log(
          `${pad('Type', 8)} | ${pad('Downloaded', 10)} | ${pad('Kept', 10)} | ${pad('Ratio', 8)} | Range`
        );
        log(`-`.repeat(80));

        result.result.segmentStats.forEach((seg) => {
          const ratio = `${((seg.kept / seg.downloaded) * 100).toFixed(1)}%`;
          const typeStr = seg.type === 'fine' ? 'FINE ' : 'COARSE';
          const rangeStr = `${seg.start.slice(0, 19)} -> ${seg.end.slice(0, 19)}`;
          log(
            `${pad(typeStr, 8)} | ${pad(seg.downloaded.toString(), 10)} | ${pad(seg.kept.toString(), 10)} | ${pad(ratio, 8)} | ${rangeStr}`
          );
        });

        log(`------------------------------\n`);
      } else {
        log(`No complex segments requiring refinement found.`);
      }

      statusBadge.textContent = 'Complete';
      statusBadge.style.background = '#22c55e'; // green
    } else {
      log(`Error: ${result.error}`);
      statusBadge.textContent = 'Failed';
      statusBadge.style.background = '#ef4444'; // red
    }
  } catch (err) {
    log(`Network Error: ${err.message}`);
    statusBadge.textContent = 'Error';
    statusBadge.style.background = '#ef4444';
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Trajectory';
  }
});
