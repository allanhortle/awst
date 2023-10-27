import {Lambda} from '@aws-sdk/client-lambda';
import {createRequestHook} from 'react-enty';

const lam = new Lambda({region: 'ap-southeast-2'});

export const useLambda = createRequestHook({
    name: 'Lambda',
    request: async (FunctionName: string) => {
        const data = await lam.getFunction({FunctionName});
        return data;
    }
});
