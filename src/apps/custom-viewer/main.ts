import { Viewer } from './Viewer';

// Bootstrap the viewer
const container = document.getElementById('container') as HTMLElement;
// Parse URL
const params = new URLSearchParams(window.location.search);
const url = params.get('url') || undefined;

const viewer = new Viewer(container, url);

// Start the loop
viewer.start();
