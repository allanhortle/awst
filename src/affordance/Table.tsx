import {Box, Text, useInput} from 'ink';
import React, {useState} from 'react';
import logger from '../service/logger.js';
import useElementSize from '../service/useElementSize.js';

type Props<T> = {
    data: Array<T>;
    schema: Array<{
        width?: number;
        heading: string;
        render: (data: T) => React.ReactNode;
    }>;
};
export default function Table<T>({data, schema}: Props<T>) {
    const [selected, setSelected] = useState(0);
    const {ref, width, height} = useElementSize();

    useInput((input) => {
        if (input === 'j') {
            setSelected(selected + 1);
        }
        if (input === 'k') {
            setSelected(Math.max(0, selected - 1));
        }
    });

    const usedWidth = schema.reduce((rr, ii) => rr + (ii.width ?? 0) + 1, 0);

    const safeWidth = Math.max(0, (width ?? 0) - usedWidth - schema.length);

    const autoColumns = schema.reduce((rr, ii) => {
        if (ii.width == null) return rr + 1;
        return rr;
    }, 0);

    logger.info({width, height, safeWidth});

    return (
        <Box ref={ref} flexDirection="column">
            <Box>
                <Box flexShrink={0} width={2}></Box>
                {schema.map((ss) => (
                    <Box marginRight={1} width={ss.width ?? Math.floor(safeWidth / autoColumns)}>
                        <Text bold>{ss.heading}</Text>
                    </Box>
                ))}
            </Box>
            {data.slice(0, height).map((row, index) => {
                return (
                    <Box key={index} overflow="hidden">
                        <Box flexShrink={0} width={2}>
                            {selected === index ? <Text>{'>'}</Text> : <Text />}
                        </Box>

                        {schema.map((ss) => (
                            <Box
                                overflow="hidden"
                                width={ss.width ?? Math.floor(safeWidth / autoColumns)}
                                marginRight={1}
                            >
                                {ss.render(row)}
                            </Box>
                        ))}
                    </Box>
                );
            })}
        </Box>
    );
}
