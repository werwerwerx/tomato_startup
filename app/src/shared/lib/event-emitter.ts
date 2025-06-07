export class BrowserEventEmitter<EventMap extends Record<string, any[]>> {
  private events: Map<keyof EventMap, ((...args: any[]) => void)[]>;

  constructor() {
    this.events = new Map();
  }

  on<E extends keyof EventMap>(
    event: E, 
    listener: (...args: EventMap[E]) => void
  ): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);
  }

  off<E extends keyof EventMap>(
    event: E, 
    listener: (...args: EventMap[E]) => void
  ): void {
    if (!this.events.has(event)) return;
    
    const listeners = this.events.get(event)!;
    const index = listeners.indexOf(listener);
    
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  emit<E extends keyof EventMap>(
    event: E, 
    ...args: EventMap[E]
  ): void {
    if (!this.events.has(event)) return;
    
    const listeners = this.events.get(event)!;
    listeners.forEach((listener) => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`Error in event listener for ${String(event)}:`, error);
      }
    });
  }

  removeAllListeners(event?: keyof EventMap): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
} 