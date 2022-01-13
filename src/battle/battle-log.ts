export interface BattleLog {
  messages: () => Readonly<string[]>;
  push(message: string): void;
  clear(): void;
}

export class BattleLogImpl {
  private _messages: string[] = [];

  public messages(): Readonly<string[]> {
    return this._messages;
  }

  public push(message: string): void {
    this._messages.push(message);
  }

  public clear(): void {
   this._messages = []; 
  }
}
