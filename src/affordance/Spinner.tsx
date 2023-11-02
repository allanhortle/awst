import React from 'react';
import {Text} from 'ink';
import InkSpinner from 'ink-spinner';

export default function Spinner() {
    return (
        <Text>
            <Text color="green">
                <InkSpinner type="dots" />
            </Text>
            {' Loading'}
        </Text>
    );
}
