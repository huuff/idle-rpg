export interface BattleLog {
  messages: () => string[];
  push(message: string): void;
}

export class BattleLogImpl {
  private _messages: string[] = [];

  get messages() {
    return this._messages;
  }

  public push(message: string): void {
    this._messages.push(message);
  }
}
