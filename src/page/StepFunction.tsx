import React from 'react';
import {Box, Text} from 'ink';
import {ARN} from 'link2aws';
import logger from '../service/logger.js';
import {Parse, Route} from 'trouty';
import useRequest from '../service/useRequest.js';
import {open} from '../service/arn.js';
import {SFN} from '@aws-sdk/client-sfn';
import KeyValue from '../affordance/Keyvalue.js';
import Table from '../affordance/Table.js';
import DateTime from '../affordance/DateTime.js';

export default Route<{arn: string}>({
    path: '/stepfunction',
    parse: {arn: Parse.state((x) => String(x))},
    component: (props) => {
        const key = props.args.arn;
        const data = useRequest({
            key,
            request: async () => {
                const sfn = new SFN({region: 'ap-southeast-2'});
                const data = await sfn.listExecutions({stateMachineArn: key});
                return data;
                //return sfn.describeStateMachine({stateMachineArn: key});
            }
        });
        logger.info(data);
        if (!data) return null;

        return (
            <Table
                data={data.executions ?? []}
                onChange={(item) => open(item.executionArn)}
                schema={[
                    {
                        heading: '',
                        value: (row) => row.status,
                        width: 1,
                        render: (row) => {
                            switch (row.status) {
                                case 'SUCCEEDED':
                                    return <Text color="green">✔</Text>;

                                case 'FAILED':
                                    return <Text color="red">✘</Text>;

                                case 'TIMED_OUT':
                                    return <Text color="yellow">⏱</Text>;

                                default:
                                    <Text wrap="truncate">{row.status?.slice(0, 1)}</Text>;
                            }
                            //readonly ABORTED: "ABORTED";
                            //readonly FAILED: "FAILED";
                            //readonly RUNNING: "RUNNING";
                            //readonly SUCCEEDED: "SUCCEEDED";
                            //readonly TIMED_OUT: "TIMED_OUT";
                        }
                    },
                    {
                        heading: 'Duration',
                        value: (row) => {
                            const start = row.startDate?.getTime();
                            const stop = row.stopDate?.getTime();
                            if (!start || !stop) return 0;
                            return stop - start;
                        },
                        render: (row) => {
                            const start = row.startDate?.getTime();
                            const stop = row.stopDate?.getTime();
                            if (!start || !stop) return <Text>-</Text>;
                            return (
                                <Text wrap="truncate">{((stop - start) / 1000).toFixed(2)}s</Text>
                            );
                        }
                    },
                    {
                        heading: 'Start',
                        value: (row) => row.startDate,
                        render: (row) => <DateTime>{row.startDate}</DateTime>
                    },
                    {
                        heading: 'Stop',
                        value: (row) => row.stopDate,
                        render: (row) => <DateTime>{row.stopDate}</DateTime>
                    }
                ]}
            />
        );
        const {name, status, creationDate, definition} = data ?? {};

        return (
            <Box flexDirection="column" overflow="visible" gap={1}>
                <Text bold>{name}</Text>
                <Text bold color="yellow">
                    {new ARN(key).consoleLink}
                </Text>
                <KeyValue
                    data={{
                        name,
                        status,
                        creationDate: creationDate?.toISOString(),
                        definition: JSON.stringify(JSON.parse(definition ?? '{}'), null, 4)
                    }}
                />
            </Box>
        );
    }
});
