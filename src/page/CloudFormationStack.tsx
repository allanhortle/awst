import React from 'react';
import {Box, Text} from 'ink';
import Table from '../affordance/Table.js';
import {DateTime} from 'luxon';
import {useRoutes} from '../service/routes.js';
import {Parse, Route} from 'trouty';
import useRequest from '../service/useRequest.js';
import {cfn} from '../service/aws.js';
import {sortBy} from '../service/array.js';
import {StackResourceSummary} from '@aws-sdk/client-cloudformation';
import logger from '../service/logger.js';

const sortOrder = [
    'AWS::Lambda::Function',
    'AWS::StepFunctions::StateMachine',
    'AWS::CDK::Metadata',
    'AWS::IAM::Role',
    'AWS::IAM::Policy'
];

export default Route<{arn: string}>({
    path: '/cloudformationStack',
    parse: {arn: Parse.state((x) => String(x))},
    component: function CloudFormation(props: {args: {arn: string}}) {
        const key = props.args.arn;
        const routes = useRoutes();
        const stack = useRequest({
            key: '',
            request: async () => {
                const data = await cfn.listStackResources({StackName: key});
                return data.StackResourceSummaries;
            }
        });
        if (!stack) return null;

        const rows = sortBy(stack, (x) => sortOrder.indexOf(x.ResourceType ?? '')).map((row) => {
            const status = row.ResourceStatus ?? '';
            let onChange: undefined | (() => void) = undefined;

            switch (row.ResourceType) {
                case 'AWS::IAM::Role':
                    onChange = () => routes.iamRole.push({arn: row.PhysicalResourceId});
                    break;
                case 'AWS::IAM::Policy':
                    onChange = () => routes.iamPolicy.push({arn: row.PhysicalResourceId});
                    break;
                case 'AWS::Lambda::Function':
                    onChange = () => routes.lambda.push({arn: row.PhysicalResourceId});
                    break;
                case 'AWS::StepFunctions::StateMachine':
                    onChange = () => routes.stepfunction.push({arn: row.PhysicalResourceId});
                    break;
            }

            return {
                onChange,
                columns: [
                    {
                        heading: 'Id',
                        value: row.LogicalResourceId,
                        children: <Text wrap="truncate">{row.LogicalResourceId}</Text>
                    },
                    {
                        heading: 'Type',
                        value: row.ResourceType,
                        width: 20,
                        children: (
                            <Text wrap="truncate" color={onChange ? undefined : 'grey'}>
                                {row.ResourceType?.split('::').slice(1).join(' ')}
                            </Text>
                        )
                    },
                    {
                        heading: 'Status',
                        width: 15,
                        value: row.ResourceStatus,
                        children: (
                            <Text
                                wrap="truncate"
                                color={
                                    status.includes('COMPLETE')
                                        ? 'green'
                                        : status.includes('FAILED')
                                        ? 'red'
                                        : 'yellow'
                                }
                            >
                                {status}
                            </Text>
                        )
                    },
                    {
                        heading: 'Updated',
                        width: 10,
                        value: row.LastUpdatedTimestamp,
                        children: (
                            <Text>
                                {row.LastUpdatedTimestamp &&
                                    DateTime.fromJSDate(row.LastUpdatedTimestamp).toISODate()}
                            </Text>
                        )
                    }
                ]
            };
        });

        return (
            <Box flexDirection="column" overflow="visible">
                {stack && <Table rows={rows} />}
            </Box>
        );
    }
});
