import React from 'react';
import {Box, Text} from 'ink';

export default function KeyValue(props: {data: Record<string, React.ReactNode>}) {
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
