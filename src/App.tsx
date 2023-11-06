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
                    <RoutesProvider>
                        <EntyProvider>
                            <Suspense fallback={<Spinner />}>
                                <Routes />
                            </Suspense>
                        </EntyProvider>
                    </RoutesProvider>
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
            // @ts-ignore
            if (history.index === 0) app.exit();
            history.goBack();
        }
    });
    return (
        <ErrorBoundary resetKey={history.location.pathname}>
            <Switch>
                {Object.values(routes)}
                <NotFound />
            </Switch>
        </ErrorBoundary>
    );
}

function NotFound() {
    return (
        <Box>
            <Text>Not Found</Text>
        </Box>
    );
}
