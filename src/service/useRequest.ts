import {useEffect} from 'react';
import {createRequestHook} from 'react-enty';

const useAws = createRequestHook({
    name: 'aws',
    request: async <T>(fn: () => Promise<T>) => {
        return fn();
    }
});

export default function useRequest<T>({key, request}: {key: string; request: () => Promise<T>}) {
    const message = useAws({key});
    useEffect(() => {
        if (message.isEmpty) message.request(request);
    }, [key]);
    if (message.isEmpty) return null;
    if (message.isFetching) throw new Promise(() => {});
    if (message.isError) throw message.error;
    return message.data as T;
}
