export class RateLimiter {
  private static instance: RateLimiter;
  private queue: Array<{
    resolve: (value: boolean) => void;
    timestamp: number;
  }> = [];
  private requestsInLastMinute = 0;
  private lastReset = Date.now();
  private readonly rateLimit = 60; // Free tier allows ~60 requests per minute
  private readonly resetInterval = 60000; // 1 minute in milliseconds

  private constructor() {
    // Start the reset interval
    setInterval(() => this.resetCounter(), this.resetInterval);
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  private resetCounter() {
    this.requestsInLastMinute = 0;
    this.lastReset = Date.now();
    
    // Process waiting requests if any
    this.processQueue();
  }

  private processQueue() {
    const now = Date.now();
    
    // Process queued requests that can now be handled
    while (
      this.queue.length > 0 &&
      this.requestsInLastMinute < this.rateLimit
    ) {
      const request = this.queue.shift();
      if (request) {
        this.requestsInLastMinute++;
        request.resolve(true);
      }
    }
  }

  /**
   * Request permission to make an API call
   * @returns Promise that resolves to true when the request can proceed
   */
  public async acquireToken(): Promise<boolean> {
    // Reset counter if a minute has passed
    if (Date.now() - this.lastReset >= this.resetInterval) {
      this.resetCounter();
    }

    // If we're under the rate limit, allow the request immediately
    if (this.requestsInLastMinute < this.rateLimit) {
      this.requestsInLastMinute++;
      return Promise.resolve(true);
    }

    // Otherwise, queue the request
    return new Promise((resolve) => {
      this.queue.push({
        resolve,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Check if we're currently rate limited
   * @returns true if rate limited
   */
  public isRateLimited(): boolean {
    // Reset counter if a minute has passed
    if (Date.now() - this.lastReset >= this.resetInterval) {
      this.resetCounter();
      return false;
    }
    
    return this.requestsInLastMinute >= this.rateLimit;
  }

  /**
   * Get estimate of wait time in seconds
   * @returns approximate wait time in seconds
   */
  public getWaitTimeEstimate(): number {
    if (!this.isRateLimited()) return 0;
    
    const timePassedSinceReset = Date.now() - this.lastReset;
    const timeUntilReset = Math.max(0, this.resetInterval - timePassedSinceReset);
    
    // Calculate position in queue
    const queuePosition = this.queue.length;
    
    // Rough estimate: time until reset + 1 second per request ahead in queue
    return Math.ceil(timeUntilReset / 1000) + queuePosition;
  }
}