import React, {useState, useEffect, useMemo} from 'react';
import {Box, Text, useApp, useInput, useStdout} from 'ink';
import {useCloudFormationStack} from '../model/cloudformation.js';
import Table from '../affordance/Table.js';
import {DateTime} from 'luxon';
import {useRoutes} from '../service/routes.js';

export default function CloudFormation(props: {args: {stack: string}}) {
    const key = props.args.stack;
    const stack = useCloudFormationStack({key});
    const routes = useRoutes();
    useEffect(() => {
        if (stack.isEmpty) stack.request(key);
    }, [key]);
    if (stack.isEmpty) return null;
    if (stack.isPending) return <Text>Loading...</Text>;
    if (stack.isError) throw stack.error;

    return (
        <Box flexDirection="column" overflow="visible">
            {stack.data && (
                <Table
                    data={stack.data}
                    onChange={(next) => {
                        if (!next.PhysicalResourceId) return;
                        switch (next.ResourceType) {
                            case 'AWS::Lambda::Function':
                                return routes.lambda.push({arn: next.PhysicalResourceId});
                        }
                    }}
                    schema={[
                        {
                            heading: 'Id',
                            value: (row) => row.LogicalResourceId,
                            render: (row) => <Text wrap="truncate">{row.LogicalResourceId}</Text>
                        },
                        {
                            heading: 'Type',
                            value: (row) => row.ResourceType,
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
                                        DateTime.fromJSDate(row.LastUpdatedTimestamp).toISODate()}
                                </Text>
                            )
                        }
                    ]}
                />
            )}
        </Box>
    );
}
