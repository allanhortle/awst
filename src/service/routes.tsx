import {BoringRoute, Route, Parse, createRouterContext} from 'trouty';
import CloudFormation from '../page/CloudFormation.js';
import CloudFormationStack from '../page/CloudFormationStack.js';

const router = createRouterContext({
    cloudformationList: BoringRoute({
        path: '/cloudformationList',
        component: CloudFormation
    }),
    cloudformationStack: Route<{stack: string}>({
        path: '/cloudformationStack',
        parse: {stack: Parse.state((x) => String(x))},
        component: CloudFormationStack
    })
});

export const routes = router.routes;
export const useRoutes = router.useRoutes;
export const RoutesProvider = router.RoutesProvider;
