import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
// import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda Function
    const lambdaPath = 'src/lambda/';
    const lambdaName = 'products';

    const myLambda = new lambda.Function(this, 'sa360-'+ lambdaName + '-dev', {
      functionName:  'sa360-'+ lambdaName + '-dev',
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'products.get_products',
      code: lambda.Code.fromAsset(lambdaPath)
    });

    // API Gateway
    const api = new apigw.RestApi(this, 'sa360', {
      restApiName: 'My SA360 API',
      description: 'This is my API Gateway from CDK',
    });

    const getProducts = api.root.addResource('get-products');

    const productsLambdaIntegration = new apigw.LambdaIntegration(myLambda, {
      proxy: false,
      integrationResponses: [
        {
          statusCode: "200",
          responseTemplates: {
            'application/json': JSON.stringify({ state: 'ok', greeting: '$util.escapeJavaScript($input.body)' })
          },
          responseParameters: {
            'method.response.header.Content-Type': "'application/json'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials': "'true'"
          }
        },
        {
          // For errors, we check if the error message is not empty, get the error data
          selectionPattern: '(\n|.)+',
          // We will set the response status code to 200
          statusCode: "400",
          responseTemplates: {
              'application/json': JSON.stringify({ state: 'error', message: "$util.escapeJavaScript($input.path('$.errorMessage'))" })
          },
          responseParameters: {
              'method.response.header.Content-Type': "'application/json'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
              'method.response.header.Access-Control-Allow-Credentials': "'true'"
          }
        }
      ]
    });

    getProducts.addMethod('GET', productsLambdaIntegration, {
      methodResponses: [
        {
          // Successful response from the integration
          statusCode: '200',
          // Define what parameters are allowed or not
          responseParameters: {
            'method.response.header.Content-Type': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Credentials': true
          }
        },
        {
          // Same thing for the error responses
          statusCode: '400',
          responseParameters: {
            'method.response.header.Content-Type': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Credentials': true
          }
        }
      ]
    });

    // dynamodb table 
    // const table = new dynamodb.Table(this, 'Student', {
    //     partitionKey: { name: 'student_id', type: dynamodb.AttributeType.STRING },
    // });
  }
}
