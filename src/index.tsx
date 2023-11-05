#!/usr/bin/env node
import React from 'react';
import {Command} from 'commander';
import App from './App.js';
import {render} from 'ink';

const program = new Command();

program.name('awst').description('AWS TUI').version('0.0.0');

[
    {command: 'lambda'},
    {command: 'stepfunction', aliases: ['sfn']},
    {command: 'iam'},
    {command: 'iam-policy'},
    {command: 's3'}
].forEach(({command, aliases = []}) => {
    program
        .command(command)
        .argument('<name>')
        .aliases(aliases)
        .action((arn) => {
            render(<App route={{pathname: `/${command}`, state: {arn}}} />);
        });
});

program
    .command('cloudformation')
    .description('browse cloudformation resources')
    .alias('cfn')
    .alias('cfm')
    .argument('[name]', 'The stack')
    .action((stack) => {
        render(
            <App
                route={
                    stack
                        ? {pathname: '/cloudformationStack', state: {stack}}
                        : '/cloudformationList'
                }
            />
        );
    });

program.parse();
