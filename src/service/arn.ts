import {ARN} from 'link2aws';
import openLink from 'open';

export function open(arn: string) {
    openLink(href(arn));
}

export function href(arn: string) {
    return new ARN(arn).consoleLink;
}
