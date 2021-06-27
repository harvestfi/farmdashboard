export interface WsConsumer {
  subscribeToTopic(): void;

  isSubscribed(): boolean;

  setSubscribed(s: boolean): void;
}
