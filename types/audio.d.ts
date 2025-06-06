declare module '*.mp3' {
    const src: string;
    export default src;
}

declare module '*.mp4' {
    const src: string;
    export default src;
}

declare module '*.wav' {
    const src: string;
    export default src;
}

declare module '*.ogg' {
    const src: string;
    export default src;
}

declare module 'howler' {
    export class Howl {
        constructor(options: any);
        play(): number;
        pause(): Howl;
        stop(): Howl;
        volume(vol?: number): number | Howl;
        loop(loop?: boolean): boolean | Howl;
        fade(from: number, to: number, duration: number): Howl;
        unload(): void;
        playing(): boolean;
    }
} 