import { HttpHeaders } from '@cloudcomponents/cdk-lambda-at-edge-pattern';
import { AllowedMethods, CacheCookieBehavior, CacheHeaderBehavior, CachePolicy, CacheQueryStringBehavior, Distribution, PriceClass, } from '@aws-cdk/aws-cloudfront';
import { CfnOutput, Construct, Duration, Stack, StackProps } from '@aws-cdk/core';
import { HttpOrigin } from '@aws-cdk/aws-cloudfront-origins';

export interface CloudfrontCorsProxyProps extends StackProps {
  originToHit: string;
  extraRequestHeaders?: string[]; // always includes Authorization, Origin, X-Api-Key
  withCredentials?: boolean; // defaults to false
  allowedOrigin?: string; // defaults to '*'
  allowedMethods?: string; // defaults to '*'
  allowedHeaders?: string; // defaults to '*'
}

export class CloudfrontCorsProxyStack extends Stack {
  constructor(scope: Construct, id: string, props: CloudfrontCorsProxyProps) {
    super(scope, id, props);

    const  {
      originToHit,
      extraRequestHeaders = [],
      allowedOrigin = '*',
      allowedHeaders = '*',
      allowedMethods = '*',
      withCredentials = false
    } = props;
    if (withCredentials && (allowedOrigin === '*' || allowedMethods === '*' || allowedHeaders === '*')) {
      throw new Error('CORS forbids including credentials with a wildcard origin, headers, or methods list');
    }
    const headers = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Credentials': `${withCredentials}`,
      'Access-Control-Allow-Headers': allowedHeaders,
      'Access-Control-Allow-Methods': allowedMethods,
    };

    const httpHeaders = new HttpHeaders(this, 'RewriteHeaders', {
      httpHeaders: headers
    });
    const distribution = new Distribution(this, 'Distribution', {
      priceClass: PriceClass.PRICE_CLASS_200,
      defaultBehavior: {
        origin: new HttpOrigin(originToHit),
        allowedMethods: AllowedMethods.ALLOW_ALL,
        cachePolicy: new CachePolicy(this, 'CachePolicy', {
          cookieBehavior: CacheCookieBehavior.all(),
          defaultTtl: Duration.seconds(0),
          headerBehavior: CacheHeaderBehavior.allowList('Authorization', 'Origin', 'X-Api-Key', ...extraRequestHeaders),
          queryStringBehavior: CacheQueryStringBehavior.all(),
        }),
        edgeLambdas: [httpHeaders],
      }
    });

    new CfnOutput(this, 'distribution id', {
      value: distribution.distributionId,
    });
    new CfnOutput(this, 'domain name', {
      value: distribution.distributionDomainName,
    });
    new CfnOutput(this, 'message', {
      value: `Access ${originToHit} without CORS restrictions using ${distribution.distributionDomainName} as a proxy`,
    });

  }
}
