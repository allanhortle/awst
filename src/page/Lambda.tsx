import React from 'react';
import {Box, Text} from 'ink';
import {ARN} from 'link2aws';
import {Parse, Route} from 'trouty';
import KeyValue from '../affordance/KeyValue.js';
import {Lambda} from '@aws-sdk/client-lambda';
import useRequest from '../service/useRequest.js';

export default Route<{arn: string}>({
    path: '/lambda',
    parse: {arn: Parse.state((x) => String(x))},
    component: (props: {args: {arn: string}}) => {
        const key = props.args.arn;
        const lambda = useRequest({
            key,
            request: async () => {
                const lam = new Lambda({region: 'ap-southeast-2'});
                return lam.getFunction({FunctionName: key});
            }
        });
        if (!lambda) return null;

        const {
            Timeout,
            FunctionName,
            Handler,
            MemorySize,
            Runtime,
            Architectures,
            CodeSize,
            FunctionArn,
            Description
        } = lambda.Configuration ?? {};

        return (
            <Box flexDirection="column" overflow="visible" gap={1}>
                <Text bold>{FunctionName}</Text>
                <Text bold color="yellow">
                    {new ARN(key).consoleLink}
                </Text>
                <KeyValue
                    data={{
                        Handler,
                        Runtime,
                        Architectures,
                        Timeout,
                        CodeSize,
                        MemorySize,
                        Description,
                        FunctionArn
                    }}
                />

                <KeyValue data={{Tags: '', ...lambda.Tags}} />
            </Box>
        );
    }
});
