// Shared Global State for Active Process
export const globalState = {
  activeProcess: null,
};

// --- SSE Utils ---
export function streamToSse(stream, res, tag = '') {
  let buffer = '';
  stream.on('data', (data) => {
    buffer += data.toString();
    // Split by \r, \n, or \r\n to handle Python's carriage returns for progress
    const lines = buffer.split(/\r\n|\r|\n/);
    buffer = lines.pop(); // Keep remnants in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed) {
        const msg = tag ? `[${tag}] ${trimmed}` : trimmed;
        if (res.writable) {
          res.write(`data: ${msg}\n\n`);
        }
      }
    }
  });
}

export function killProcess(child) {
  if (!child || child.exitCode !== null) return;

  if (process.platform === 'win32') {
    // Robustly kill process tree on Windows
    try {
      spawn('taskkill', ['/F', '/T', '/PID', child.pid.toString()]);
    } catch (e) {
      console.error('Failed to taskkill process', e);
      child.kill();
    }
  } else {
    child.kill();
  }
}
