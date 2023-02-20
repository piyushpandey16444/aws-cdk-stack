import json


def get_products(event, context):
    print('EVENT: ', event)
    return {
        'statusCode': 200,
        'body': json.dumps('products from Lambda!')
    }


if __name__ == "__main__":
    print(get_products(None, None))
