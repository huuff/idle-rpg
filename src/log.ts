export interface Log {
  messages: string[];
  clear(): void;
}


export function makeLog(): Log {
  return {
    messages: [],
    clear() {
      this.messages = [];
    }
  }
}
