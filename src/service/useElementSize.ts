import {DOMElement, measureElement} from 'ink';
import {useState, useRef, useEffect, RefObject} from 'react';
import useScreenResize from './useScreenResize.js';

export default function useElementSize() {
    const [{width, height}, setState] = useState<{width?: number; height?: number}>({});
    const ref = useRef<DOMElement>();
    const measure = () => {
        if (ref.current) setState(measureElement(ref.current));
    };

    useEffect(() => {
        if (ref.current) {
            const {width, height} = measureElement(ref.current);
            setState({width, height});
        }
    }, []);

    useScreenResize(measure);

    return {ref: ref as RefObject<DOMElement>, width, height};
}
