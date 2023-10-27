import {Box, Text, useInput} from 'ink';
import React, {useMemo, useState} from 'react';
import logger from '../service/logger.js';
import useElementSize from '../service/useElementSize.js';
import TextInput from 'ink-text-input';

type Props<T> = {
    data: Array<T>;
    onChange?: (next: T) => void;
    schema: Array<{
        width?: number;
        heading: string;
        value: (data: T) => string | undefined | number | Date | null;
        render: (data: T) => React.ReactNode;
    }>;
};
export default function TableData<T>({data, schema, onChange}: Props<T>) {
    const [query, setQuery] = useState('');

    const items = data
        .filter((ii) => {
            if (!query) return true;
            return schema
                .map((ss) => String(ss.value(ii)).toLowerCase())
                .join('')
                .includes(query.toLowerCase());
        })
        .map((ii, index) => {
            return {data: ii, index};
        });

    return (
        <Table
            query={query}
            onChange={onChange}
            setQuery={setQuery}
            data={data}
            items={items}
            schema={schema}
        />
    );
}

type TableProps<T> = Props<T> & {
    items: Array<{data: T; index: number}>;
    query: string;
    setQuery: (next: string) => void;
    onChange?: (next: T) => void;
};
function Table<T>({items, schema, query, setQuery, onChange}: TableProps<T>) {
    const [selected, setSelected] = useState(0);
    const [searching, setSearching] = useState(false);
    const {ref, width, height} = useElementSize();

    useInput((input, code) => {
        let next = selected;
        if (input === 'j' || code.downArrow) next++;
        if (input === 'k' || code.upArrow) next--;

        if (input === '/') setSearching(!searching);

        if (code.escape) {
            if (query) setQuery('');
            if (searching) {
                setSearching(false);
                setQuery('');
            }
        }

        if (code.return) {
            setSearching(false);
            onChange?.(items[selected].data);
        }

        if (next >= items.length) next = 0;
        if (next < 0) next = items.length - 1;
        setSelected(next);
    });

    // The sum of the widths declared by schema items
    const fixedWidth = schema.reduce((rr, ii) => rr + (ii.width ?? 0), 0);
    const firstWidth = String(items.length).length;

    const safeWidth = Math.max(0, (width ?? 0) - fixedWidth - schema.length - firstWidth - 2);

    const autoColumns = schema.reduce((rr, ii) => {
        if (ii.width == null) return rr + 1;
        return rr;
    }, 0);

    const start = height ? Math.max(0, selected - height) : 0;
    const end = height && Math.max(height, selected + 1);

    return (
        <Box ref={ref} flexDirection="column">
            <Box>
                <Box flexShrink={0} width={firstWidth} marginRight={1} />
                {searching ? (
                    <Box>
                        <Text>/</Text>
                        <TextInput value={query} onChange={setQuery} />
                    </Box>
                ) : (
                    schema.map((ss) => (
                        <Box
                            marginRight={1}
                            width={ss.width ?? Math.floor(safeWidth / autoColumns)}
                        >
                            <Text bold>{ss.heading}</Text>
                        </Box>
                    ))
                )}
            </Box>
            {items.slice(start, end).map((row) => {
                return (
                    <Box key={row.index} overflow="hidden" gap={1}>
                        <Box flexShrink={0} width={firstWidth}>
                            {selected === row.index ? (
                                <Text>{'>'}</Text>
                            ) : (
                                <Text color="grey">{row.index}</Text>
                            )}
                        </Box>

                        {schema.map((ss) => (
                            <Box
                                overflow="hidden"
                                width={ss.width ?? Math.floor(safeWidth / autoColumns)}
                            >
                                {ss.render(row.data)}
                            </Box>
                        ))}
                    </Box>
                );
            })}
        </Box>
    );
}
