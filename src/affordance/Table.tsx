import {Box, Text, useInput} from 'ink';
import React, {useState} from 'react';
import useElementSize from '../service/useElementSize.js';
import TextInput from 'ink-text-input';

type Props = {
    rows: Array<{
        onChange?: () => void;
        columns: Array<{
            heading: string;
            children: React.ReactNode;
            value?: string | number | Date | null;
            width?: number;
        }>;
    }>;
};
export default function TableData(props: Props) {
    const [query, setQuery] = useState('');

    const rows = props.rows.filter((row) => {
        if (!query) return true;
        return row.columns
            .map((column) => String(column.value).toLowerCase())
            .join('')
            .includes(query.toLowerCase());
    });

    return <Table query={query} setQuery={setQuery} rows={rows} />;
}

type TableProps = Props & {
    query: string;
    setQuery: (next: string) => void;
};
function Table({rows, query, setQuery}: TableProps) {
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
            rows[selected].onChange?.();
        }

        if (next >= rows.length) next = 0;
        if (next < 0) next = rows.length - 1;
        setSelected(next);
    });

    // The sum of the widths declared by schema items
    const schema = rows[0].columns;
    const fixedWidth = schema.reduce((rr, ii) => rr + (ii.width ?? 0), 0);
    const firstWidth = String(rows.length).length;

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
            {rows.slice(start, end).map((row, index) => {
                return (
                    <Box key={index} overflow="hidden" gap={1}>
                        <Box flexShrink={0} width={firstWidth}>
                            {selected === index ? (
                                <Text>{'>'}</Text>
                            ) : (
                                <Text color="grey">{index}</Text>
                            )}
                        </Box>

                        {row.columns.map((column) => (
                            <Box
                                overflow="hidden"
                                width={column.width ?? Math.floor(safeWidth / autoColumns)}
                                children={column.children}
                            />
                        ))}
                    </Box>
                );
            })}
        </Box>
    );
}
