import {createRouterContext} from 'trouty';
import cloudformationList from '../page/CloudFormation.js';
import cloudformationStack from '../page/CloudFormationStack.js';
import lambda from '../page/Lambda.js';
import stepfunction from '../page/StepFunction.js';

const router = createRouterContext({
    cloudformationList,
    cloudformationStack,
    lambda,
    stepfunction
});

export const routes = router.routes;
export const useRoutes = router.useRoutes;
export const RoutesProvider = router.RoutesProvider;
