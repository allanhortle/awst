import React from 'react';
import {Text} from 'ink';
import {Parse, Route} from 'trouty';
import useRequest from '../service/useRequest.js';
import {open} from '../service/arn.js';
import Table from '../affordance/Table.js';
import DateTime from '../affordance/DateTime.js';
import {sfn} from '../service/aws.js';

export default Route<{arn: string}>({
    path: '/stepfunction',
    parse: {arn: Parse.state((x) => String(x))},
    component: (props) => {
        const key = props.args.arn;
        const data = useRequest({
            key,
            request: async () => {
                return sfn.listExecutions({stateMachineArn: key});
            }
        });
        if (!data) return null;

        const rows = (data.executions ?? []).map((row) => {
            const start = row.startDate?.getTime();
            const stop = row.stopDate?.getTime();
            const duration = !start || !stop ? 0 : stop - start;
            return {
                onChange: () => open(row.executionArn),
                columns: [
                    {
                        heading: '',
                        value: row.status,
                        width: 1,
                        children: (() => {
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
                        })()
                    },
                    {
                        heading: 'Duration',
                        value: duration,
                        children: duration ? (
                            <Text wrap="truncate">{(duration / 1000).toFixed(2)}s</Text>
                        ) : (
                            <Text>-</Text>
                        )
                    },
                    {
                        heading: 'Start',
                        value: row.startDate,
                        children: <DateTime>{row.startDate}</DateTime>
                    },
                    {
                        heading: 'Stop',
                        value: row.stopDate,
                        children: <DateTime>{row.stopDate}</DateTime>
                    }
                ]
            };
        });

        return <Table rows={rows} />;
    }
});
