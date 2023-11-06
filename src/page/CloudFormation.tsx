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
        const rows = stacks.map((row) => {
            const status = row.StackStatus ?? '';
            return {
                onChange: () => row.StackId && cloudformationStack.push({arn: row.StackId}),
                columns: [
                    {
                        heading: 'Stack',
                        value: row.StackName,
                        children: <Text wrap="truncate">{row.StackName}</Text>
                    },
                    {
                        heading: 'Status',
                        width: 24,
                        value: row.StackStatus,
                        children: (
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
                        )
                    },
                    {
                        heading: 'Updated',
                        width: 10,
                        value: row.LastUpdatedTime?.toISOString(),
                        children: (
                            <Text>
                                {row.LastUpdatedTime &&
                                    DateTime.fromJSDate(row.LastUpdatedTime).toISODate()}
                            </Text>
                        )
                    }
                ]
            };
        });

        return (
            <Box flexDirection="column" overflow="visible">
                <Table rows={rows} />
            </Box>
        );
    }
});
