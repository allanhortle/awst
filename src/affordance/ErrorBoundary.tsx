import React from 'react';
import {Text} from 'ink';
import logger from '../service/logger.js';

export default class ErrorBoundary extends React.Component<
    {children: any; resetKey: string},
    {error: null | Error}
> {
    constructor(props: {children: any; resetKey?: string}) {
        super(props);
        this.state = {error: null};
    }

    static getDerivedStateFromError(error: Error) {
        logger.error({message: error.message, stack: error.stack, cause: error.cause});
        return {error};
    }

    componentDidUpdate(prevProps: {resetKey?: string}) {
        if (this.state.error !== null && prevProps.resetKey !== this.props.resetKey) {
            this.setState({error: null});
        }
    }

    render() {
        if (this.state.error) return <Text color="red">{this.state.error.toString()}</Text>;
        return this.props.children;
    }
}
