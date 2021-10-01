# Cloudfront CORS Proxy

Quickly set up a proxy to add permissive CORS headers to an API you'd like to access.

Learn more at (blog post url incoming)

## Quick Start

1. Clone down this repo and edit bin/cloudfront-cors-proxy.ts to point to the API origin you want to proxy to.
2. `npm install`
3. Make sure you have aws access key and secret keys available. An easy way to check is to run `aws configure list`.
3. Bootstrap `npm run cdk bootstrap` (I don't know what this is for)
4. Deploy `npm run cdk -- deploy --all`

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `npm run -- cdk deploy --all`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
