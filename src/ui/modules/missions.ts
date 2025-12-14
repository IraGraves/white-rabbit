import { missionData } from '../../data/missions';
import type { MissionData } from '../../types';
import { ModelPreview } from '../components/ModelPreview';

// --- Shared Styles ---
const SHARED_STYLES = `
  .mission-ui-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: #eee;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow-y: auto;
    padding: 10px;
    position: relative; /* For absolute positioning if needed */
  }

  /* List Styles */
  .mission-list-item {
    display: flex;
    align-items: center;
    padding: 3px 8px; /* Compact padding */
    cursor: pointer;
    transition: background 0.2s;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.9em; /* Slightly smaller text */
    gap: 8px;
  }
  .mission-list-item:hover {
    background: rgba(255,255,255,0.1);
  }
  
  .mission-list-name {
    flex-grow: 1;
    font-size: 0.95em;
    user-select: none;
  }

  .mission-list-year {
    font-size: 0.85em;
    color: #888;
    font-family: monospace;
    min-width: 40px;
    text-align: right;
  }

  .mission-list-agency {
    font-size: 0.8em;
    color: #666;
    background: rgba(255, 255, 255, 0.08);
    padding: 1px 6px;
    border-radius: 3px;
    width: 80px;
    text-align: center;
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .story-btn {
    opacity: 0;
    pointer-events: none;
    transform: translateX(10px);
    transition: all 0.2s;
    background: none;
    border: none;
    font-size: 1.1em;
    cursor: pointer;
    padding: 1px 4px;
    margin-left: 5px;
  }

  .mission-list-item:hover .story-btn {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
  }

  .mission-color-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 12px;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid rgba(255,255,255,0.2);
  }

  .mission-color-dot:hover {
    transform: scale(1.2);
    border-color: rgba(255,255,255,0.8);
  }

  /* Header Styles (Details View) */
  .mission-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .back-btn {
    background: none;
    border: none;
    color: #aaa;
    font-size: 1.2em;
    cursor: pointer;
    padding: 4px 8px;
    margin-right: 8px;
    border-radius: 4px;
    transition: all 0.2s;
  }
  .back-btn:hover {
    color: #fff;
    background: rgba(255,255,255,0.1);
  }

  .mission-title {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    flex-grow: 1;
  }

  /* Detail Content */
  .mission-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 15px;
    background-color: #000;
    display: block;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  .mission-summary {
    font-size: 0.9em;
    line-height: 1.6;
    color: #ddd;
    margin-bottom: 20px;
    padding: 0 4px;
  }

  .mission-details-grid {
    display: flex;
    flex-direction: row;
    gap: 30px; /* Increased gap */
  }
  
  .overview-col {
    flex: 1;
    min-width: 0;
  }
  
  .timeline-col {
    flex: 1;
    min-width: 0;
    max-height: 400px;
    overflow-y: auto;
    padding-left: 5px; /* Extra safety buffer */
  }

  /* Timeline Styles */
  .mission-timeline {
    position: relative;
    padding-left: 12px; /* Reduced from 20px */
    margin-top: 0;
    border-left: 2px solid rgba(255, 255, 255, 0.1);
    margin-left: 0; /* Moved to left (was 10px) */
  }

  .timeline-event {
    position: relative;
    padding: 0 0 8px 6px;
    /* cursor: pointer; -- Moved to children */
    transition: opacity 0.2s;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 6px;
  }
  
  .timeline-event:last-child {
    padding-bottom: 0;
  }

  .timeline-event:hover {
    opacity: 1;
  }
  .timeline-event:hover .timeline-dot {
    background: #fff;
    box-shadow: 0 0 8px rgba(255,255,255,0.8);
  }

  .timeline-dot {
    position: absolute;
    left: -19px;
    top: 5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #555;
    border: 2px solid #222;
    transition: all 0.2s ease;
  }

  .event-date {
    font-family: monospace;
    font-size: 0.85em;
    color: #888;
    min-width: 78px;
    flex-shrink: 0;
    cursor: pointer; /* Clickable */
    transition: color 0.2s;
  }
  .event-date:hover {
    color: #fff;
  }

  .event-label {
    font-size: 0.95em;
    font-weight: 500;
    color: #eee;
    cursor: pointer; /* Clickable */
  }
  
  .event-label:hover {
    text-decoration: underline;
    color: #fff;
  }
`;

function injectStyles(container: HTMLElement): void {
  const style = document.createElement('style');
  style.textContent = SHARED_STYLES;
  container.appendChild(style);
}

/**
 * Unified Mission Tab
 * Handles both the Mission List and Mission Details (Story) view.
 */
export function setupMissionsTab(container: HTMLElement, config: any): void {
  container.innerHTML = '';
  container.className = 'mission-ui-container';
  injectStyles(container);

  const contentWrapper = document.createElement('div');
  contentWrapper.style.flexGrow = '1';
  contentWrapper.style.display = 'flex';
  contentWrapper.style.flexDirection = 'column';
  // Check if we need scrolling here or on container. innerHTML needs to be scrollable.
  // container has overflow-y: auto from styles.
  container.appendChild(contentWrapper);

  // State
  let activePreview: ModelPreview | null = null;
  const cleanupListeners: (() => void)[] = [];

  const cleanup = () => {
    cleanupListeners.forEach((fn) => fn());
    cleanupListeners.length = 0;
    if (activePreview) {
      activePreview.dispose();
      activePreview = null;
    }
  };

  // --- RENDER FUNCTIONS ---

  const renderList = () => {
    // Cleanup details view stuff and listeners
    cleanup();

    contentWrapper.innerHTML = '';

    const listDiv = document.createElement('div');
    listDiv.className = 'mission-list';

    // Sort missions by launch date (oldest first) - use first waypoint date for precision
    const sortedMissions = [...missionData].sort((a, b) => {
      const dateA = a.waypoints[0]?.date ? new Date(a.waypoints[0].date).getTime() : 0;
      const dateB = b.waypoints[0]?.date ? new Date(b.waypoints[0].date).getTime() : 0;
      return dateA - dateB;
    });

    sortedMissions.forEach((mission: MissionData) => {
      const row = document.createElement('div');
      row.className = 'mission-list-item';

      // 1. Color Dot (Toggle Visibility)
      const dot = document.createElement('div');
      dot.className = 'mission-color-dot';

      const updateDotState = () => {
        const isVisible = config.showMissions[mission.id];
        if (isVisible) {
          const colorHex = `#${(mission.color || 0xffffff).toString(16).padStart(6, '0')}`;
          dot.style.backgroundColor = colorHex;
          dot.style.boxShadow = `0 0 8px ${colorHex}`;
          dot.style.borderColor = 'rgba(255,255,255,0.5)';
        } else {
          dot.style.backgroundColor = '#444';
          dot.style.boxShadow = 'none';
          dot.style.borderColor = 'rgba(255,255,255,0.2)';
        }
      };

      updateDotState();

      dot.onclick = (e: MouseEvent) => {
        e.stopPropagation();
        config.showMissions[mission.id] = !config.showMissions[mission.id];
        updateDotState();
        window.dispatchEvent(
          new CustomEvent('mission-visibility-changed', { detail: { missionId: mission.id } })
        );
        if ((window as any).updateMissions) (window as any).updateMissions();
      };

      // 2. Name
      const name = document.createElement('span');
      name.className = 'mission-list-name';
      name.textContent = mission.name || mission.id;

      row.appendChild(dot);
      row.appendChild(name);

      // 3. Year
      if (mission.launchYear) {
        const year = document.createElement('span');
        year.className = 'mission-list-year';
        year.textContent = String(mission.launchYear);
        row.appendChild(year);
      }

      // 4. Agency
      if (mission.agency) {
        const agency = document.createElement('span');
        agency.className = 'mission-list-agency';
        agency.textContent = mission.agency;
        row.appendChild(agency);
      }

      // 5. Focus Button (Satellite Icon) - Hover only
      const focusBtn = document.createElement('button');
      focusBtn.className = 'story-btn';
      focusBtn.textContent = '🛰️';
      focusBtn.title = 'Focus on Probe';
      focusBtn.onclick = async (e: MouseEvent) => {
        e.stopPropagation();

        // Auto-enable if hidden
        if (!config.showMissions[mission.id]) {
          config.showMissions[mission.id] = true;
          updateDotState();
          window.dispatchEvent(
            new CustomEvent('mission-visibility-changed', { detail: { missionId: mission.id } })
          );
          if ((window as any).updateMissions) (window as any).updateMissions();
        }

        // Logic copied from previous implementation
        const { ensureProbeLoaded, getProbeForFocus, updateMissionProbes } = await import(
          '../../features/missions'
        );
        const { focusOnObject } = await import('../../features/focusMode');

        const loaded = await ensureProbeLoaded(mission.id);
        if (loaded) {
          updateMissionProbes(config.date);
          updateDotState();
          const probeWrapper = getProbeForFocus(mission.id);
          if (probeWrapper) {
            const { camera, controls } = (window as any).SimulationControl || {};
            if (camera && controls) {
              focusOnObject(probeWrapper, camera, controls);
            }
          }
        }
      };

      row.appendChild(focusBtn);

      // Row Click -> Go to Details
      row.onclick = () => {
        renderDetails(mission);
      };

      // Listen for external updates (e.g. from global state changes)
      const onVisibilityChange = (e: Event) => {
        if ((e as CustomEvent).detail.missionId === mission.id) {
          // Check if row is still in DOM before updating
          if (document.body.contains(row)) {
            updateDotState();
          }
        }
      };
      window.addEventListener('mission-visibility-changed', onVisibilityChange);
      cleanupListeners.push(() =>
        window.removeEventListener('mission-visibility-changed', onVisibilityChange)
      );

      listDiv.appendChild(row);
    });

    contentWrapper.appendChild(listDiv);
  };

  const renderDetails = (mission: MissionData) => {
    cleanup();
    contentWrapper.innerHTML = '';

    // Header
    const header = document.createElement('div');
    header.className = 'mission-header';

    // Back Button
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = '❮'; // or '←', 'Back'
    backBtn.title = 'Back to Mission List';
    backBtn.onclick = () => {
      renderList();
    };

    // Toggle Dot (in header)
    const dot = document.createElement('div');
    dot.className = 'mission-color-dot';
    // Slightly larger in header maybe? Reuse class for consistency.

    const updateHeaderDot = () => {
      const isVisible = config.showMissions[mission.id];
      if (isVisible) {
        const colorHex = `#${(mission.color || 0xffffff).toString(16).padStart(6, '0')}`;
        dot.style.backgroundColor = colorHex;
        dot.style.boxShadow = `0 0 8px ${colorHex}`;
        dot.style.borderColor = 'rgba(255,255,255,0.5)';
      } else {
        dot.style.backgroundColor = '#444';
        dot.style.boxShadow = 'none';
        dot.style.borderColor = 'rgba(255,255,255,0.2)';
      }
    };
    updateHeaderDot();

    dot.onclick = () => {
      config.showMissions[mission.id] = !config.showMissions[mission.id];
      updateHeaderDot();
      window.dispatchEvent(
        new CustomEvent('mission-visibility-changed', { detail: { missionId: mission.id } })
      );
      if ((window as any).updateMissions) (window as any).updateMissions();
    };

    // Listen for external updates
    const onVisibilityChange = (e: Event) => {
      if ((e as CustomEvent).detail.missionId === mission.id) {
        updateHeaderDot();
      }
    };
    window.addEventListener('mission-visibility-changed', onVisibilityChange);
    cleanupListeners.push(() =>
      window.removeEventListener('mission-visibility-changed', onVisibilityChange)
    );

    const title = document.createElement('h3');
    title.className = 'mission-title';
    title.textContent = mission.name || mission.id;

    header.appendChild(backBtn);
    header.appendChild(dot);
    header.appendChild(title);
    contentWrapper.appendChild(header);

    // Content Container
    const detailContent = document.createElement('div');
    detailContent.style.animation = 'fadeIn 0.3s ease';

    // Grid Layout
    const grid = document.createElement('div');
    grid.className = 'mission-details-grid';
    detailContent.appendChild(grid);

    // Left Column: Overview
    const leftCol = document.createElement('div');
    leftCol.className = 'overview-col';
    grid.appendChild(leftCol);

    // Right Column: Timeline
    const rightCol = document.createElement('div');
    rightCol.className = 'timeline-col';
    grid.appendChild(rightCol);

    // 1. Model or Image (Left Col)
    if (mission.modelPath) {
      const modelContainer = document.createElement('div');
      modelContainer.style.width = '100%';
      modelContainer.style.height = '180px';
      modelContainer.style.minHeight = '180px';
      modelContainer.style.position = 'relative';
      leftCol.appendChild(modelContainer);

      activePreview = new ModelPreview(modelContainer);
      activePreview.loadModel(mission.modelPath);
    } else if (mission.image) {
      const img = document.createElement('img');
      img.className = 'mission-image';
      img.src = mission.image;
      img.onerror = () => {
        img.style.display = 'none';
      };
      leftCol.appendChild(img);
    }

    // 2. Summary (Bottom, Full Width) - Moved after Grid setup
    // Initialized below

    // 3. Timeline (Right Col)
    // 3. Timeline (Right Col)
    if (mission.timeline && mission.timeline.length > 0) {
      const timelineHeader = document.createElement('h4');
      timelineHeader.textContent = 'Mission Timeline';
      timelineHeader.style.margin = '0 0 10px 0';
      timelineHeader.style.color = '#fff';
      timelineHeader.style.opacity = '0.8';
      rightCol.appendChild(timelineHeader);

      const timelineDiv = document.createElement('div');
      timelineDiv.className = 'mission-timeline';

      mission.timeline.forEach((event) => {
        const row = document.createElement('div');
        row.className = 'timeline-event';
        const dateStr = event.date instanceof Date ? event.date.toISOString() : event.date;
        row.dataset.date = dateStr;
        row.dataset.color = `#${(mission.color || 0xffffff).toString(16).padStart(6, '0')}`;

        // Dot
        const eventDot = document.createElement('div');
        eventDot.className = 'timeline-dot';

        // Visual state logic handled by updateMissionTimeline, but set initial state
        const eventDate = new Date(event.date);
        const simDate = config.date;
        const isFuture = eventDate > simDate;
        const colorHex = row.dataset.color;

        if (isFuture) {
          eventDot.style.backgroundColor = 'transparent';
          eventDot.style.border = '2px solid transparent';
          eventDot.style.boxShadow = `inset 0 0 0 1px ${colorHex}`;
        } else {
          eventDot.style.backgroundColor = colorHex;
          eventDot.style.border = '2px solid #222';
          eventDot.style.boxShadow = 'none';
        }
        row.appendChild(eventDot);

        // Date
        const dateSpan = document.createElement('span');
        dateSpan.className = 'event-date';
        dateSpan.textContent = dateStr.split('T')[0];
        // Time Only Click
        dateSpan.onclick = (e: MouseEvent) => {
          e.stopPropagation();
          const simCtrl = (window as any).SimulationControl;
          if (simCtrl?.jumpToMissionLocation) {
            // pause=true, moveCamera=FALSE
            simCtrl.jumpToMissionLocation(mission.id, event.date, true, false);
          }
        };
        row.appendChild(dateSpan);

        // Label
        const labelSpan = document.createElement('span');
        labelSpan.className = 'event-label';
        labelSpan.textContent = event.label;
        // Time + Space Click
        labelSpan.onclick = (e: MouseEvent) => {
          e.stopPropagation();
          const simCtrl = (window as any).SimulationControl;
          if (simCtrl?.jumpToMissionLocation) {
            // pause=true, moveCamera=TRUE
            simCtrl.jumpToMissionLocation(mission.id, event.date, true, true);
          }
        };
        row.appendChild(labelSpan);

        timelineDiv.appendChild(row);
      });

      rightCol.appendChild(timelineDiv);
    }

    // 2. Summary (Now at Bottom)
    if (mission.summary) {
      const summary = document.createElement('div');
      summary.className = 'mission-summary';
      summary.textContent = mission.summary;
      summary.style.marginTop = '15px'; // Spacing from grid
      summary.style.borderTop = '1px solid rgba(255,255,255,0.1)';
      summary.style.paddingTop = '10px';
      detailContent.appendChild(summary);
    }

    contentWrapper.appendChild(detailContent);
  };

  // Listen for specific event to open details directly (e.g. from searching or deep links)
  const onMissionSelected = (e: Event) => {
    const missionId = (e as CustomEvent).detail.missionId;
    const mission = missionData.find((m: MissionData) => m.id === missionId);
    if (mission) {
      renderDetails(mission);
    }
  };
  window.addEventListener('mission-selected', onMissionSelected);

  // Initial Render: List
  renderList();
}

/**
 * Updates the mission timeline visuals based on current simulation time.
 * Called every frame by the UI loop.
 */
export function updateMissionTimeline(config: any): void {
  const events = document.querySelectorAll('.mission-timeline .timeline-event');
  if (events.length === 0) return;

  const simDate = config.date;

  events.forEach((row) => {
    const element = row as HTMLElement;
    const dateAttr = element.dataset.date;
    if (!dateAttr) return;

    const eventDate = new Date(dateAttr);
    const colorHex = element.dataset.color || '#fff';
    const dot = element.querySelector('.timeline-dot') as HTMLElement;

    if (!dot) return;

    const isFuture = eventDate > simDate;

    if (isFuture) {
      // Future: Thin Inner Outline
      dot.style.backgroundColor = 'transparent';
      dot.style.border = '2px solid transparent';
      dot.style.boxShadow = `inset 0 0 0 1px ${colorHex}`;
    } else {
      // Past: Solid
      dot.style.backgroundColor = colorHex;
      dot.style.border = '2px solid #222';
      dot.style.boxShadow = 'none';
    }
  });
}
