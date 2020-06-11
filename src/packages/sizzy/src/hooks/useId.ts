import { useMemo, useRef } from 'react';

let startId = 0;

export default function useId() {
    return useMemo(() => {
        return startId++;
    }, []);
}
