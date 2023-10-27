import React, {useEffect} from 'react';
import {Box, Text} from 'ink';
import {ARN} from 'link2aws';
import {useLambda} from '../model/lambda.js';
import logger from '../service/logger.js';
console.log = (x) => logger.info(x);

export default function Lambda(props: {args: {arn: string}}) {
    const key = props.args.arn;
    const lambda = useLambda({key});
    useEffect(() => {
        if (lambda.isEmpty) lambda.request(key);
    }, [key]);
    if (lambda.isEmpty) return null;
    if (lambda.isFetching) return <Text>Loading...</Text>;
    if (lambda.isError) throw lambda.error;
    //logger.info(lambda.data);
    logger.info(lambda.data);

    const {
        Timeout,
        FunctionName,
        Handler,
        MemorySize,
        Runtime,
        Architectures,
        CodeSize,
        FunctionArn,
        Description,
        Environment
    } = lambda.data.Configuration ?? {};

    return (
        <Box flexDirection="column" overflow="visible" gap={1}>
            <Text bold>{FunctionName}</Text>
            <Text bold color="yellow">
                {new ARN(FunctionArn).consoleLink}
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

            <KeyValue data={{Tags: '', ...lambda.data.Tags}} />
        </Box>
    );
}

function KeyValue(props: {data: Record<string, React.ReactNode>}) {
    const entries = Object.entries(props.data);
    const keyWidth = entries.reduce((rr, ii) => Math.max(rr, ii[0].length), 0);

    return (
        <Box flexDirection="column" overflow="visible">
            {Object.entries(props.data).map(([key, value]) => (
                <Box key={key} gap={2}>
                    <Box flexShrink={0} width={keyWidth}>
                        <Text bold>{key}</Text>
                    </Box>
                    <Text>{Array.isArray(value) ? value.join(', ') : value}</Text>
                </Box>
            ))}
        </Box>
    );
}
