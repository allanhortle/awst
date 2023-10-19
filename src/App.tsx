import React, {Component, Suspense} from 'react';
import logger from './service/logger.js';
import Screen from './service/Screen.js';
import CloudFormation from './page/CloudFormation.js';
import {Text, Box, useApp} from 'ink';
import useScreenSize from './service/useScreenSize.js';
import {EntyProvider} from 'react-enty';

export default class App extends Component<{}, {hasError: boolean}> {
    constructor(props: {}) {
        super(props);
        this.state = {hasError: false};
    }
    static getDerivedStateFromError(error: Error) {
        logger.error(error);
        return {hasError: true};
    }
    render() {
        if (this.state.hasError) return <Text color="red">Error!</Text>;
        return (
            <Suspense>
                <Screen>
                    <EntyProvider>
                        <Awst />
                    </EntyProvider>
                </Screen>
            </Suspense>
        );
    }
}

export function Awst() {
    const {exit} = useApp();
    const {width} = useScreenSize();
    //Router.exit = exit;
    //const snap = useSnapshot(Router);
    //useInput((input, key) => {
    //Router.useInput(input, key);
    //});
    return (
        <Box flexDirection="column">
            <Text wrap="truncate">{'▀'.repeat(width)}</Text>
            <Box flexGrow={1} flexDirection="column" paddingX={2} paddingY={1}>
                {(() => {
                    return <CloudFormation />;
                    //const route = snap.route.at(-1) || 'home';
                    //if (route === 'search') return <Search />;
                    //if (route === 'devices') return <Devices />;
                    //if (route.startsWith('spotify:album')) return <Album />;
                    //if (route.startsWith('spotify:artist')) return <Artist />;
                    //return <Home />;
                })()}
            </Box>
            <Text wrap="truncate">{'▀'.repeat(width)}</Text>
        </Box>
    );
}
