import React from 'react';
import {Box, Spacer, Text} from 'ink';
import {ARN} from 'link2aws';
import {Parse, Route} from 'trouty';
import KeyValue from '../affordance/KeyValue.js';
import useRequest from '../service/useRequest.js';
import {lam} from '../service/aws.js';
import logger from '../service/logger.js';
import ActionBar from '../affordance/ActionBar.js';

export default Route<{arn: string}>({
    path: '/lambda',
    parse: {arn: Parse.state((x) => String(x))},
    component: (props: {args: {arn: string}}) => {
        const key = props.args.arn;
        const lambda = useRequest({
            key,
            request: async () => {
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
            <Box flexDirection="column" overflow="visible">
                <Text bold>Lambda » {FunctionName}</Text>
                <ActionBar open={FunctionArn} copyArn={FunctionArn} />
                <Box marginBottom={1} />
                <KeyValue
                    data={{
                        FunctionArn,
                        Handler,
                        Runtime,
                        Architectures,
                        Timeout,
                        CodeSize,
                        MemorySize,
                        Description,
                        ' ': '',
                        Tags: '',
                        ...lambda.Tags
                    }}
                />
            </Box>
        );
    }
});
