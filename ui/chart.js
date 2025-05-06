export class Chart {
    constructor(ctx, config) {
      this.ctx = ctx
      this.config = config
    }
  
    destroy() {
      // Basic destroy method to avoid errors
      this.ctx = null
      this.config = null
    }
  }
  