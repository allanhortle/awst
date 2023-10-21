import {CloudFormation} from '@aws-sdk/client-cloudformation';
import {createRequestHook} from 'react-enty';

const cfn = new CloudFormation({region: 'ap-southeast-2'});

export const useCloudFormationList = createRequestHook({
    name: 'CloudFormationList',
    request: async () => {
        const data = await cfn.listStacks({});
        return data.StackSummaries;
    }
});
