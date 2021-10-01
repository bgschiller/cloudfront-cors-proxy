#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CloudfrontCorsProxyStack } from '../lib/cloudfront-cors-proxy-stack';

const app = new cdk.App();
new CloudfrontCorsProxyStack(app, 'cors-proxy-random-duck', {
  originToHit: 'random-d.uk',
});
