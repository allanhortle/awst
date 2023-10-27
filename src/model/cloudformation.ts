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

export const useCloudFormationStack = createRequestHook({
    name: 'CloudFormationStack',
    request: async (StackId: string) => {
        const data = await cfn.listStackResources({StackName: StackId});
        return data.StackResourceSummaries;
    }
});
