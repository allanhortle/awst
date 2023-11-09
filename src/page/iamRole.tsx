import React from 'react';
import {Box, Text} from 'ink';
import {Parse, Route} from 'trouty';
import useRequest from '../service/useRequest.js';
import {iam} from '../service/aws.js';
import ActionBar from '../affordance/ActionBar.js';
import Table from '../affordance/Table.js';
import {useRoutes} from '../service/routes.js';

export default Route<{arn: string}>({
    path: '/iam',
    parse: {arn: Parse.state((x) => String(x))},
    component: (props: {args: {arn: string}}) => {
        const key = props.args.arn;
        const routes = useRoutes();
        const data = useRequest({
            key,
            request: async () => {
                const role = await iam.getRole({RoleName: key});
                const [inlinePolicies, attached] = await Promise.all([
                    iam.listRolePolicies({RoleName: key}),
                    iam.listAttachedRolePolicies({RoleName: key})
                ]);

                return {
                    role,
                    policies: [
                        ...(inlinePolicies.PolicyNames?.map((name) => ({
                            roleName: key,
                            name,
                            type: 'Inline' as const
                        })) ?? []),
                        ...(attached.AttachedPolicies?.map((ii) => ({
                            name: ii.PolicyName,
                            arn: ii.PolicyArn,
                            type: 'Managed' as const
                        })) ?? [])
                    ]
                };
            }
        });
        if (!data) return null;
        const arn = data.role.Role?.Arn ?? '';

        const rows = data.policies.map((row) => {
            return {
                onChange: () => {
                    row.type === 'Inline'
                        ? routes.iamPolicy.push({PolicyName: row.name, RoleName: row.roleName})
                        : routes.iamPolicy.push({arn: row.arn});
                },
                columns: [
                    {
                        heading: 'Type',
                        value: row.type,
                        width: 10,
                        children: <Text>{row.type}</Text>
                    },
                    {
                        heading: 'Document',
                        value: row.name,
                        children: <Text>{row.name}</Text>
                    }
                ]
            };
        });

        return (
            <Box flexDirection="column" overflow="visible">
                <Text bold>IAM Role » {key}</Text>
                <ActionBar open={arn} copyArn={arn} />
                <Box marginBottom={1} />
                <Table rows={rows} />
            </Box>
        );
    }
});
