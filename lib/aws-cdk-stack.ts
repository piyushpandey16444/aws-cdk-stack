import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaPath = 'src/lambda/';
    const lambdaName = 'get-products';

    const fn = new lambda.Function(this, 'sa360-'+ lambdaName + '-dev', {
      functionName:  'sa360-'+ lambdaName + '-dev',
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'get-products.get_products',
      code: lambda.Code.fromAsset(lambdaPath)
    });

    const api = new apigw.RestApi(this, 'sa360', {
      restApiName: 'My SA360 API',
      description: 'This is my API Gateway from CDK',
    });

    const getProducts = api.root.addResource('get-products');

    const productsLambdaIntegration = new apigw.LambdaIntegration(fn);

    getProducts.addMethod('GET', productsLambdaIntegration);
  }
}
