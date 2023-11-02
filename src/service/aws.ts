import {SFN} from '@aws-sdk/client-sfn';
import {CloudFormation} from '@aws-sdk/client-cloudformation';
import {Lambda} from '@aws-sdk/client-lambda';

export const cfn = new CloudFormation({region: 'ap-southeast-2'});
export const sfn = new SFN({region: 'ap-southeast-2'});
export const lam = new Lambda({region: 'ap-southeast-2'});
