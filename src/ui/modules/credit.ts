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
      <p>This project includes textures, models, and data from various sources.</p>
      
      <hr style="border: 0; border-bottom: 1px solid #444; margin: 20px 0;">

      <h3 style="color: #88ccff;">Textures</h3>
      <h4 style="color: #ddd;">Celestia Content</h4>
      <p>The following attributions apply to textures used in this application, sourced from the <a href="https://github.com/CelestiaProject/CelestiaContent" target="_blank" style="color: #88ccff;">Celestia Content Repository</a>.</p>
      
      <h5 style="color: #ccc; margin-bottom: 5px;">Moon Textures</h5>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li><strong>Phobos & Deimos</strong>: Models and textures are from Ernst et al. 2023 (<a href="https://doi.org/10.1186/s40623-023-01814-7" target="_blank" style="color: #88ccff;">doi.org...</a>).</li>
        <li><strong>Mimas, Enceladus, Tethys, Dione, Rhea, Iapetus</strong>: Textures derived from enhanced color maps by Paul Schenk (NASA).</li>
        <li><strong>Phoebe</strong>: Derived from John Van Vliet (JVV).</li>
        <li><strong>Ariel, Umbriel, Titania, Oberon</strong>: Created by Ivan Rivera from JPL data.</li>
        <li><strong>Triton</strong>: Based on Voyager 2 imagery.</li>
        <li><strong>Proteus, Larissa</strong>: Based on Phil Stooke's maps.</li>
        <li><strong>Amalthea</strong>: Shaded relief by Phil Stooke, colored by Wm. Robert Johnston.</li>
      </ul>
      
      <h5 style="color: #ccc; margin-bottom: 5px;">Planetary Textures</h5>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li><strong>Earth</strong>: Derived from <a href="https://www.earthstartsbeating.com/2019/01/16/mappamondo/" target="_blank" style="color: #88ccff;">Earth Starts Beating</a> and improved by Tom Patterson.</li>
        <li><strong>Titan</strong>: Composite of Cassini ISS and Radar maps from USGS, created by FarGetaNik and modified by Askaniy.</li>
      </ul>
      
      <p>For full license details, see the <a href="https://github.com/CelestiaProject/CelestiaContent/blob/master/README" target="_blank" style="color: #88ccff;">Celestia Content README</a>.</p>

      <hr style="border: 0; border-bottom: 1px solid #444; margin: 20px 0;">

      <h3 style="color: #88ccff;">Models</h3>
      
      <h4 style="color: #ddd;">NASA Probe Models</h4>
      <p>Sourced from NASA, public domain:</p>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li>Cassini</li>
        <li>Galileo</li>
        <li>IBEX</li>
        <li>Parker Solar Probe</li>
        <li>Pioneer 10</li>
        <li>Ulysses</li>
        <li>Voyager</li>
      </ul>

      <h4 style="color: #ddd;">Third-Party Models</h4>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li><strong>Tesla Roadster</strong>: <a href="https://skfb.ly/6ZzXy" target="_blank" style="color: #88ccff;">"Tesla Roadster 2020"</a> by metarex.4d is licensed under <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" style="color: #88ccff;">CC BY 4.0</a>.</li>
      </ul>

      <hr style="border: 0; border-bottom: 1px solid #444; margin: 20px 0;">

      <h3 style="color: #88ccff;">Fonts</h3>
      <ul style="padding-left: 20px; list-style-type: disc;">
        <li><strong>Outfit</strong>: SIL Open Font License 1.1.</li>
        <li><strong>Space Mono</strong>: SIL Open Font License 1.1.</li>
      </ul>
      <p>See <code>public/fonts/OFL.txt</code>.</p>
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
