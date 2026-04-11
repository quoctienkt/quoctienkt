import * as Phaser from 'phaser';

/**
 * Typed publish/subscribe event bus.
 * Wrap around a Phaser EventEmitter so we get lifecycle management for free.
 * Store in game.registry as 'eventBus' so every scene and service can access it.
 */
export class EventBus {
  private emitter: Phaser.Events.EventEmitter;

  constructor() {
    this.emitter = new Phaser.Events.EventEmitter();
  }

  emit(event: string, payload?: unknown): void {
    this.emitter.emit(event, payload);
  }

  on(event: string, handler: (payload: any) => void, context?: unknown): void {
    this.emitter.on(event, handler, context);
  }

  once(
    event: string,
    handler: (payload: any) => void,
    context?: unknown,
  ): void {
    this.emitter.once(event, handler, context);
  }

  off(event: string, handler: (payload: any) => void, context?: unknown): void {
    this.emitter.off(event, handler, context);
  }

  removeAllListeners(event?: string): void {
    this.emitter.removeAllListeners(event);
  }

  destroy(): void {
    this.emitter.destroy();
  }
}
