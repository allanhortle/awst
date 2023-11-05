import React from 'react';
import {Box, Text} from 'ink';
import Table from '../affordance/Table.js';
import {DateTime} from 'luxon';
import {useRoutes} from '../service/routes.js';
import {Parse, Route} from 'trouty';
import useRequest from '../service/useRequest.js';
import {cfn} from '../service/aws.js';
import {sortBy} from '../service/array.js';

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

        const data = stack.map((row) => {
            return [
                {
                    heading: 'Id',
                    sort: row.LogicalResourceId,
                    render: <Text>{row.LogicalResourceId}</Text>
                },
                {
                    heading: 'Type',
                    width: 20,
                    sort: row.ResourceType,
                    render: <Text>{row.ResourceType}</Text>
                }
            ];
        });
        return (
            <Box flexDirection="column" overflow="visible">
                {stack && (
                    <Table
                        data={sortBy(stack, (x) => sortOrder.indexOf(x.ResourceType ?? ''))}
                        onChange={(next) => {
                            if (!next.PhysicalResourceId) return;
                            switch (next.ResourceType) {
                                case 'AWS::IAM::Role':
                                    return routes.iamRole.push({arn: next.PhysicalResourceId});
                                case 'AWS::IAM::Policy':
                                    return routes.iamPolicy.push({arn: next.PhysicalResourceId});
                                case 'AWS::Lambda::Function':
                                    return routes.lambda.push({arn: next.PhysicalResourceId});
                                case 'AWS::StepFunctions::StateMachine':
                                    return routes.stepfunction.push({arn: next.PhysicalResourceId});
                            }
                        }}
                        schema={[
                            {
                                heading: 'Id',
                                value: (row) => row.LogicalResourceId,
                                render: (row) => (
                                    <Text wrap="truncate">{row.LogicalResourceId}</Text>
                                )
                            },
                            {
                                heading: 'Type',
                                value: (row) => row.ResourceType,
                                width: 20,
                                render: (row) => (
                                    <Text wrap="truncate">
                                        {row.ResourceType?.split('::').slice(1).join(' ')}
                                    </Text>
                                )
                            },
                            {
                                heading: 'Status',
                                width: 15,
                                value: (row) => row.ResourceStatus,
                                render: (row) => {
                                    const status = row.ResourceStatus ?? '';
                                    return (
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
                                    );
                                }
                            },
                            {
                                heading: 'Updated',
                                width: 10,
                                value: (row) => row.LastUpdatedTimestamp,
                                render: (row) => (
                                    <Text>
                                        {row.LastUpdatedTimestamp &&
                                            DateTime.fromJSDate(
                                                row.LastUpdatedTimestamp
                                            ).toISODate()}
                                    </Text>
                                )
                            }
                        ]}
                    />
                )}
            </Box>
        );
    }
});
