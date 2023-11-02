import {Box, Text, useInput} from 'ink';
import React, {useState} from 'react';
import * as arn from '../service/arn.js';
import clipboard from 'clipboardy';

type Props = {
    open?: string;
    copyArn?: string;
};
export default function ActionBar(props: Props) {
    const [copy, setCopy] = useState('copy');
    useInput((key) => {
        if (key === 'o' && props.open) arn.open(props.open);
        if (key === 'c' && props.copyArn) {
            clipboard.write(props.copyArn).then(() => {
                setCopy(' ✔  ');
                setTimeout(() => setCopy('copy'), 1000);
            });
        }
    });
    return (
        <Box gap={1}>
            {props.open && <Text color="green">o:open</Text>}
            {props.copyArn && <Text color="green">c:{copy}</Text>}
        </Box>
    );
}
