declare module 'moment' {
    import { Dayjs } from 'dayjs';

    interface Moment extends Dayjs {}
}

declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
    export function ReactComponent(
        props: React.SVGProps<SVGSVGElement>,
    ): React.ReactElement;
    const url: string;
    export default url;
}

declare module 'raw-loader*' {
    const js: string;
    export default js;
}
