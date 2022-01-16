export class SceneLog {
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
