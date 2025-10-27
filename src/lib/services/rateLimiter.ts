export class RateLimiter {
  private static instance: RateLimiter;
  private readonly rateLimit = 60; // Approximate requests per minute for Gemini free tier
  private readonly resetInterval = 60000; // 1 minute in milliseconds
  private requestTimestamps: number[] = [];

  private constructor() {}

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  private cleanup(now = Date.now()): void {
    // Keep only requests that fall inside the current rate limit window
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => now - timestamp < this.resetInterval
    );
  }

  /**
   * Attempt to acquire a token. Returns false if the caller should back off.
   */
  public tryAcquireToken(): boolean {
    const now = Date.now();
    this.cleanup(now);

    if (this.requestTimestamps.length >= this.rateLimit) {
      return false;
    }

    this.requestTimestamps.push(now);
    return true;
  }

  public isRateLimited(): boolean {
    this.cleanup();
    return this.requestTimestamps.length >= this.rateLimit;
  }

  /**
   * Estimated wait time in seconds until the next token is available.
   */
  public getWaitTimeEstimate(): number {
    const now = Date.now();
    this.cleanup(now);

    if (!this.isRateLimited() || this.requestTimestamps.length === 0) {
      return 0;
    }

    const oldestRequest = this.requestTimestamps[0];
    const timeUntilReset = Math.max(0, this.resetInterval - (now - oldestRequest));
    return Math.ceil(timeUntilReset / 1000);
  }
}
