/// <reference types="vite/client" />
declare namespace JSX {
    interface IntrinsicElements {
        'dotlottie-player': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            src?: string;
            background?: string;
            speed?: string;
            direction?: string;
            playMode?: string;
            loop?: boolean;
            controls?: boolean;
            autoplay?: boolean;
        };
    }
}
