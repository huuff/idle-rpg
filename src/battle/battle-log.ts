export class BattleLog {
  private _messages: string[] = [];

  get messages() {
    return this._messages;
  }

  public push(message: string): void {
    this._messages.push(message);
  }
}
