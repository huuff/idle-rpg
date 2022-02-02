import { save } from "./save-load";

export interface Autosave {
    start(): void;
    stop(): void;
    lastSave: Date | undefined;
    isEnabled: boolean;
}

const AUTOSAVE_MIN = 15;
export class AutosaveImpl implements Autosave {
    private interval: ReturnType<typeof setInterval> | undefined;

    public lastSave: Date | undefined;

    constructor(start = true) {
        if (start) {
            this.start();
        }
    }

    public get isEnabled(): boolean {
        return !!this.interval;
    }

    public start(): void {
        this.stop();
        this.interval = setInterval(() => {
            save();
            this.lastSave = new Date();
        }, AUTOSAVE_MIN * 60 * 1000)
    }

    public stop(): void {
        clearInterval(this.interval);
        this.interval = undefined;
    }
}