import {createRouterContext} from 'trouty';
import cloudformationList from '../page/CloudFormation.js';
import cloudformationStack from '../page/CloudFormationStack.js';
import lambda from '../page/Lambda.js';
import iamRole from '../page/iamRole.js';
import iamPolicy from '../page/iamPolicy.js';
import stepfunction from '../page/StepFunction.js';

const router = createRouterContext({
    cloudformationList,
    cloudformationStack,
    lambda,
    iamRole,
    iamPolicy,
    stepfunction
});

export const routes = router.routes;
export const useRoutes = router.useRoutes;
export const RoutesProvider = router.RoutesProvider;
