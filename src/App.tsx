import React, {Suspense, useEffect} from 'react';
import Screen from './service/Screen.js';
import {Box, Text, useApp, useInput} from 'ink';
import {EntyProvider} from 'react-enty';
import ErrorBoundary from './affordance/ErrorBoundary.js';
import {routes, RoutesProvider, useRoutes} from './service/routes.js';
import {MemoryRouter, Switch} from 'trouty';
import logger from './service/logger.js';
import {useHistory} from 'react-router-dom';

export default function App(props: {route: any}) {
    return (
        <Screen>
            <MemoryRouter initialEntries={[props.route]}>
                <Box flexGrow={1} flexDirection="column" padding={1}>
                    <ErrorBoundary>
                        <RoutesProvider>
                            <EntyProvider>
                                <Suspense fallback={<Text>LOADING...</Text>}>
                                    <Routes />
                                </Suspense>
                            </EntyProvider>
                        </RoutesProvider>
                    </ErrorBoundary>
                </Box>
            </MemoryRouter>
        </Screen>
    );
}

function Routes() {
    const history = useHistory();
    const app = useApp();
    useEffect(() => {
        return history.listen((change) => logger.info(change));
    }, []);

    useInput((input) => {
        if (input === 'q') {
            logger.info(history);
            if (history.length === 1) app.exit();
            history.goBack(1);
        }
    });
    return (
        <Switch>
            {Object.values(routes)}
            <NotFound />
        </Switch>
    );
}

function NotFound() {
    return (
        <Box>
            <Text>Not Found</Text>
        </Box>
    );
}
