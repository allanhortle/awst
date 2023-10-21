import React, {useState, useEffect, useMemo} from 'react';
import {Box, Text, useApp, useInput, useStdout} from 'ink';
import logger from '../service/logger.js';
import {EntyProvider} from 'react-enty';
import {useCloudFormationList} from '../model/cloudformation.js';
import Table from '../affordance/Table.js';
import {DateTime} from 'luxon';
import sortBy from 'lodash-es/sortBy.js';

export default function CloudFormation() {
    const stacks = useCloudFormationList();
    useEffect(() => {
        if (stacks.isEmpty) stacks.request();
    }, []);
    if (stacks.isEmpty) return null;
    if (stacks.isPending) return <Text>Loading...</Text>;
    if (stacks.isError) throw stacks.error;

    return (
        <Box flexDirection="column" overflow="visible">
            {stacks.data && (
                <Table
                    data={stacks.data}
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
