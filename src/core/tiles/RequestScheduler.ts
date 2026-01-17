export interface ISchedulable {
  id: string;
  loadContent(): Promise<void>;
  abortLoad(): void;
}

export class RequestScheduler {
  private queue: Map<string, { tile: ISchedulable; priority: number }> = new Map();
  private activeRequests: Set<string> = new Set();
  public maxActiveRequests: number = 6; // Browser limit for HTTP/1.1 is usually 6 per domain

  constructor(maxRequests: number = 8) {
    this.maxActiveRequests = maxRequests;
  }

  public setLimit(max: number) {
    this.maxActiveRequests = max;
    this.process();
  }

  public schedule(tile: ISchedulable, priority: number) {
    if (this.activeRequests.has(tile.id)) {
      // Already loading, do nothing
      return;
    }

    const item = this.queue.get(tile.id);
    if (item) {
      // Already queued, update priority
      item.priority = priority;
    } else {
      // Add to queue
      this.queue.set(tile.id, { tile, priority });
    }

    this.process();
  }

  public cancel(tile: ISchedulable) {
    this.queue.delete(tile.id);

    if (this.activeRequests.has(tile.id)) {
      tile.abortLoad();
      this.activeRequests.delete(tile.id);
      this.process();
    }
  }

  public clear() {
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
        const item = this.queue.get(bestId);
        if (!item) {
          this.queue.delete(bestId);
          continue;
        }

        // CONCURRENCY CAP for low-priority (Guard Band) tiles
        // If it's a pre-fetch tile (priority <= 1.0), only allow 2 active at once.
        if (item.priority <= 1.0) {
          // If we already have 2+ things loading, don't start a low-priority one.
          // This keeps the remaining slots (up to 32) free for high-priority tiles
          // that might be discovered later in the same frame.
          if (this.activeRequests.size >= 2) {
            break;
          }
        }

        this.queue.delete(bestId);
        this.activeRequests.add(bestId);

        // Start Load
        console.log(
          `[Scheduler] Dispatching ${bestId} (Queue: ${this.queue.size}, Active: ${this.activeRequests.size}, Priority: ${item.priority})`
        );
        item.tile
          .loadContent()
          .then(() => {
            console.log(`[Scheduler] Finished ${bestId}`);
          })
          .catch((err) => {
            console.warn(`[Scheduler] Failed ${bestId}:`, err);
          })
          .finally(() => {
            if (bestId) this.activeRequests.delete(bestId);
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
