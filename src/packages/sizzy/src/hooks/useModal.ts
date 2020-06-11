import { useCallback, useState } from 'react';

function useModal<T = string | boolean>(): [
    T | false,
    (visible: T) => void,
    () => void,
] {
    const [visible, setVisible] = useState<T | false>(false);

    const setHide = useCallback(() => {
        setVisible(false);
    }, []);

    const setShow = useCallback((visible: T) => {
        setVisible(visible);
    }, []);

    return [visible, setShow, setHide];
}

export default useModal;
