import React from 'react';
import {Box, Text} from 'ink';
import Table from '../affordance/Table.js';
import {DateTime} from 'luxon';
import {useRoutes} from '../service/routes.js';
import {BoringRoute} from 'trouty';
import useRequest from '../service/useRequest.js';
import {cfn} from '../service/aws.js';

export default BoringRoute({
    path: '/cloudformationList',
    component: function CloudFormation() {
        const {cloudformationStack} = useRoutes();
        const stacks = useRequest({
            key: '',
            request: async () => {
                const data = await cfn.listStacks({});
                return data.StackSummaries;
            }
        });
        if (!stacks) return null;

        return (
            <Box flexDirection="column" overflow="visible">
                {stacks && (
                    <Table
                        data={stacks}
                        onChange={(s) => s.StackId && cloudformationStack.push({arn: s.StackId})}
                        schema={[
                            {
                                heading: 'Stack',
                                value: (row) => row.StackName,
                                render: (row) => <Text wrap="truncate">{row.StackName}</Text>
                            },
                            {
                                heading: 'Status',
                                width: 24,
                                value: (row) => row.StackStatus,
                                render: (row) => {
                                    const status = row.StackStatus ?? '';
                                    return (
                                        <Text
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
                                value: (row) => row.LastUpdatedTime?.toISOString(),
                                render: (row) => (
                                    <Text>
                                        {row.LastUpdatedTime &&
                                            DateTime.fromJSDate(row.LastUpdatedTime).toISODate()}
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
