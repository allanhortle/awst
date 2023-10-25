#!/usr/bin/env node
import React from 'react';
import {Command} from 'commander';
import App from './App.js';
import {render} from 'ink';

const program = new Command();

program.name('awst').description('AWS TUI').version('0.0.0');

program
    .command('cloudformation')
    .description('browse cloudformation resources')
    .alias('cfn')
    .alias('cfm')
    .argument('[stack]', 'The stack')
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
