import json
import os
from typing import Dict, Any
from urllib.request import urlopen, Request
from urllib.error import HTTPError, URLError

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение данных о погоде из WeatherAPI.com для города Черемхово
    Args: event - dict с httpMethod, queryStringParameters (period: 'current'|'forecast'|'forecast30')
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с данными о погоде
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('WEATHERAPI_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'API key not configured. Get free key at https://www.weatherapi.com/signup.aspx'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters') or {}
    period = params.get('period', 'current')
    
    city = 'Cheremkhovo,Russia'
    
    try:
        if period == 'current':
            url = f'https://api.weatherapi.com/v1/current.json?key={api_key}&q={city}&lang=ru'
        elif period == 'forecast':
            url = f'https://api.weatherapi.com/v1/forecast.json?key={api_key}&q={city}&days=10&lang=ru'
        elif period == 'forecast30':
            url = f'https://api.weatherapi.com/v1/forecast.json?key={api_key}&q={city}&days=14&lang=ru'
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid period parameter'}),
                'isBase64Encoded': False
            }
        
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(data),
            'isBase64Encoded': False
        }
        
    except HTTPError as e:
        error_body = e.read().decode('utf-8') if e.fp else 'Unknown error'
        return {
            'statusCode': e.code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'WeatherAPI error: {error_body}',
                'status_code': e.code
            }),
            'isBase64Encoded': False
        }
    except URLError as e:
        return {
            'statusCode': 503,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Network error: {str(e.reason)}'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Unexpected error: {str(e)}'}),
            'isBase64Encoded': False
        }
