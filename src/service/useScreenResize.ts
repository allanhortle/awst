import {useCallback, useEffect} from 'react';
import {useStdout} from 'ink';

export default function useScreenResize(fn: (stdout: NodeJS.WriteStream) => void) {
    const {stdout} = useStdout();
    if (!stdout) throw new Error('stdout not found');

    useEffect(() => {
        stdout.on('resize', fn);
        return () => {
            stdout.off('resize', fn);
        };
    }, [stdout]);
}
