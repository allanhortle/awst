import React from 'react';
import {Text} from 'ink';

type Props = {
    time?: boolean;
    children?: string | Date;
};

export default function ({children, time = true}: Props) {
    if (!children) return '-';
    const value = new Date(children);
    const date = value.toISOString().split('T')[0];

    if (!time) return <Text>{date}</Text>;

    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    return (
        <Text>
            {date} {hours}:{minutes}
        </Text>
    );
}
