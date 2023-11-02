import React, {Suspense} from 'react';
import Screen from './service/Screen.js';
import {Box, Text, useApp, useInput} from 'ink';
import {EntyProvider} from 'react-enty';
import ErrorBoundary from './affordance/ErrorBoundary.js';
import Spinner from './affordance/Spinner.js';
import {routes, RoutesProvider} from './service/routes.js';
import {MemoryRouter, Switch} from 'trouty';
import {useHistory} from 'react-router-dom';

export default function App(props: {route: any}) {
    return (
        <Screen>
            <MemoryRouter initialEntries={[props.route]}>
                <Box flexGrow={1} flexDirection="column" padding={1}>
                    <ErrorBoundary>
                        <RoutesProvider>
                            <EntyProvider>
                                <Suspense fallback={<Spinner />}>
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

    useInput((input) => {
        if (input === 'q') {
            if (history.length === 1) app.exit();
            history.goBack();
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
