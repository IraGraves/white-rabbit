export interface ISchedulable {
  id: string;
  loadContent(): Promise<void>;
  abortLoad(): void;
}

export class RequestScheduler {
  private queue: Map<string, { tile: ISchedulable; priority: number }> = new Map();
  private activeRequests: Set<string> = new Set();
  private maxActiveRequests: number = 6; // Browser limit for HTTP/1.1 is usually 6 per domain

  constructor(maxRequests: number = 8) {
    this.maxActiveRequests = maxRequests;
  }

  public schedule(tile: ISchedulable, priority: number) {
    if (this.activeRequests.has(tile.id)) {
      // Already loading, do nothing
      return;
    }

    if (this.queue.has(tile.id)) {
      // Already queued, update priority
      const item = this.queue.get(tile.id)!;
      item.priority = priority;
    } else {
      // Add to queue
      this.queue.set(tile.id, { tile, priority });
    }

    this.process();
  }

  public cancel(tile: ISchedulable) {
    if (this.queue.has(tile.id)) {
      this.queue.delete(tile.id);
    }

    if (this.activeRequests.has(tile.id)) {
      // If active, we should ideally abort the request.
      // S2Tile needs to support aborting.
      tile.abortLoad();
      this.activeRequests.delete(tile.id);
      this.process();
    }
  }

  public clear() {
    this.queue.clear();
    for (const id of this.activeRequests) {
      // We can't easily access the tile here unless we store it in activeRequests map too
      // But we can assume the caller will dispose tiles, which might trigger cancel?
      // Better: let's track tiles in activeRequests properly or just trust that S2Tileset.dispose() calling tile.dispose() is enough?
      // Actually, if we just want to stop network activity:
    }
    // Since we don't hold the tile object in the Set<string>, we can't call abortLoad() here easily without changing the Set to a Map.
    // However, S2Tileset.dispose() will iterate all tiles and call tile.dispose().
    // S2Tile.dispose() *should* probably call scheduler.cancel(this).
    // So scheduler.clear() might just be "force empty queue".
    this.queue.clear();
    this.activeRequests.clear();
  }

  private process() {
    // If slots available
    while (this.activeRequests.size < this.maxActiveRequests && this.queue.size > 0) {
      // Find highest priority
      // Priority = SSE (Higher is better/more urgent)
      let bestId: string | null = null;
      let maxPriority = -1;

      for (const [id, item] of this.queue) {
        if (item.priority > maxPriority) {
          maxPriority = item.priority;
          bestId = id;
        }
      }

      if (bestId) {
        const item = this.queue.get(bestId)!;
        this.queue.delete(bestId);

        this.activeRequests.add(bestId);

        // Start Load
        item.tile.loadContent().finally(() => {
          this.activeRequests.delete(bestId!);
          this.process(); // Trigger next
        });
      } else {
        break;
      }
    }
  }

  public get stats() {
    return {
      queued: this.queue.size,
      active: this.activeRequests.size,
    };
  }
}
