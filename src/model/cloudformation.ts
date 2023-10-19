import {CloudFormation} from '@aws-sdk/client-cloudformation';
import {createRequestHook} from 'react-enty';
import logger from '../service/logger.js';

const cfn = new CloudFormation({region: 'ap-southeast-2'});

export const useCloudFormationList = createRequestHook({
    name: 'CloudFormationList',
    request: async () => {
        logger.info('hooks');
        const data = await cfn.listStacks({});
        return data.StackSummaries;
    }
});
