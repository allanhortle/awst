import React, {useState, useEffect, useMemo} from 'react';
import {Box, Text, useApp, useInput, useStdout} from 'ink';
import logger from '../service/logger.js';
import {EntyProvider} from 'react-enty';
import {useCloudFormationList} from '../model/cloudformation.js';
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
            <Box marginBottom={1}>
                <Text bold>Cloud Formation Stacks</Text>
            </Box>
            {sortBy(stacks.data ?? [], (x) => x.StackName).map(
                ({RootId, StackName, StackStatus}, index) => (
                    <Box justifyContent="space-between" key={index}>
                        <Text>{StackName}</Text>
                        <Text
                            color={
                                StackStatus?.includes('COMPLETE')
                                    ? 'green'
                                    : StackStatus?.includes('FAILED')
                                    ? 'red'
                                    : undefined
                            }
                        >
                            {StackStatus}
                        </Text>
                    </Box>
                )
            )}
        </Box>
    );
}
