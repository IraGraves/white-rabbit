/**
 * @file credit.ts
 * @description Credit section displaying third-party content notices.
 *
 * This module creates a Credit folder in the main menu and manages a floating window
 * that displays the content of NOTICE.md (Third-Party Content Notices).
 */
import { windowManager } from '../WindowManager';

export function setupCreditFolder(gui: any): void {
  const creditFolder = gui.addFolder('Credit');

  // Create the window content (hardcoded from NOTICE.md)
  const content = `
    <div style="padding: 20px; color: #eee; line-height: 1.6; font-size: 14px;">
      <h2 style="margin-top: 0; color: #fff;">Third-Party Content Notices</h2>
      <p>This project includes textures and data from the Celestia Content repository.</p>
      
      <h3 style="color: #88ccff; border-bottom: 1px solid #444; padding-bottom: 5px;">Celestia Content</h3>
      <p>The following attributions apply to textures used in this application, sourced from the <a href="https://github.com/CelestiaProject/CelestiaContent" target="_blank" style="color: #88ccff;">Celestia Content Repository</a>.</p>
      
      <h4 style="color: #ddd; margin-bottom: 10px;">Moon Textures</h4>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li><strong>Phobos & Deimos</strong>: Models and textures are from Ernst et al. 2023 (<a href="https://doi.org/10.1186/s40623-023-01814-7" target="_blank" style="color: #88ccff;">doi.org/10.1186...</a>).</li>
        <li><strong>Mimas, Enceladus, Tethys, Dione, Rhea, Iapetus</strong>: Textures are derived from enhanced color maps by Paul Schenk, found on the NASA photojournal.</li>
        <li><strong>Phoebe</strong>: Textures derived from a texture by John Van Vliet (JVV).</li>
        <li><strong>Ariel, Umbriel, Titania, Oberon</strong>: Textures created by Ivan Rivera from JPL data.</li>
        <li><strong>Triton</strong>: Texture based on Voyager 2 imagery.</li>
        <li><strong>Proteus, Larissa</strong>: Textures based on Phil Stooke's maps.</li>
        <li><strong>Amalthea</strong>: Shaded relief map by Phil Stooke, colored by Wm. Robert Johnston.</li>
      </ul>
      
      <h4 style="color: #ddd; margin-bottom: 10px;">Other</h4>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li><strong>Earth</strong>: Surface texture derived from <a href="https://www.earthstartsbeating.com/2019/01/16/mappamondo/" target="_blank" style="color: #88ccff;">Earth Starts Beating</a> and improved by Tom Patterson's Natural Earth II.</li>
        <li><strong>Titan</strong>: Surface texture is a composite of Cassini ISS and Radar maps from USGS, created by FarGetaNik and modified by Askaniy.</li>
      </ul>
      
      <h3 style="color: #88ccff; border-bottom: 1px solid #444; padding-bottom: 5px; margin-top: 20px;">Fonts</h3>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li><strong>Outfit</strong>: Copyright (c) 2021 The Outfit Project Authors. Licensed under the SIL Open Font License, Version 1.1.</li>
        <li><strong>Space Mono</strong>: Copyright (c) 2016 Google Inc. Licensed under the SIL Open Font License, Version 1.1.</li>
      </ul>
      
      <p style="margin-top: 20px;">See <code>public/fonts/OFL.txt</code> for the full license text.</p>
      
      <p>For full license details and additional credits, please refer to the <a href="https://github.com/CelestiaProject/CelestiaContent/blob/master/README" target="_blank" style="color: #88ccff;">Celestia Content README</a>.</p>
    </div>
  `;

  // Initialize the window
  const win = windowManager.createWindow('credits-window', 'Credits / Notices', {
    width: '500px',
    height: '600px',
    x: 100, // Initial position, not snapped
    y: 100,
    onClose: () => {
      // Optional: logic when closed
    },
  });

  // Enable scrolling
  win.content.style.overflowY = 'auto';

  // Set content
  win.content.innerHTML = content;
  // Initially hidden
  windowManager.hideWindow('credits-window');

  // Add button to menu
  const params = {
    showCredits: () => {
      windowManager.toggleWindow('credits-window');
    },
  };

  creditFolder.add(params, 'showCredits').name('Show Notices');
  // creditFolder.close(); // Keep open or closed by default? 'About' is closed. 'System' might be open.
  // Generally new folders are open or closed. Let's leave it open or close it to match others.
  creditFolder.close();
}
