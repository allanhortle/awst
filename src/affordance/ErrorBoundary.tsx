import React from 'react';
import {Text} from 'ink';
import logger from '../service/logger.js';

export default class ErrorBoundary extends React.Component<{children: any}, {hasError: boolean}> {
    constructor(props: {children: any}) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error: Error) {
        logger.error({...error});
        return {hasError: true};
    }

    render() {
        if (this.state.hasError) return <Text color="red">Error!</Text>;
        return this.props.children;
    }
}
