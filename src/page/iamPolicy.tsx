import React from 'react';
import {Box, Text} from 'ink';
import {Parse, Route} from 'trouty';
import useRequest from '../service/useRequest.js';
import {iam} from '../service/aws.js';
import ActionBar from '../affordance/ActionBar.js';

function decodeDocument(doc: string = '{}') {
    return JSON.stringify(JSON.parse(decodeURIComponent(doc)), null, 2);
}

export default Route<{arn?: string; PolicyName?: string; RoleName?: string}>({
    path: '/iam-policy',
    parse: {
        arn: Parse.state((x) => x as string),
        PolicyName: Parse.state((x) => x as string),
        RoleName: Parse.state((x) => x as string)
    },
    component: (props: {args: {arn?: string; PolicyName?: string; RoleName?: string}}) => {
        const {arn, PolicyName, RoleName} = props.args;
        const data = useRequest({
            key: arn ?? `${PolicyName}${RoleName}` ?? '',
            request: async () => {
                if (arn) {
                    const policy = await iam.getPolicy({PolicyArn: props.args.arn});
                    const policyVersion = await iam.getPolicyVersion({
                        VersionId: policy.Policy?.DefaultVersionId,
                        PolicyArn: props.args.arn
                    });

                    return {
                        description: policy.Policy?.Description,
                        name: policy.Policy?.PolicyName,
                        doc: decodeDocument(policyVersion.PolicyVersion?.Document)
                    };
                }

                if (!PolicyName || !RoleName) throw new Error('Missing RoleName or PolicyName');

                const policy = await iam.getRolePolicy({PolicyName, RoleName});
                return {
                    name: `${RoleName} / ${PolicyName}`,
                    doc: decodeDocument(policy.PolicyDocument)
                };
            }
        });
        if (!data) return null;

        return (
            <Box flexDirection="column" overflow="hidden">
                <Text bold>IAM Policy » {data.name}</Text>
                <Text>{data.description}</Text>
                {arn && <ActionBar open={arn} copyArn={arn} />}
                <Box marginBottom={1} />
                <Text>{data.doc}</Text>
            </Box>
        );
    }
});
