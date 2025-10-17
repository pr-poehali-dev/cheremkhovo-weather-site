import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Счётчик посещений сайта с сохранением в PostgreSQL
    Args: event - dict с httpMethod (GET для получения, POST для увеличения)
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с количеством посещений
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            cur.execute("""
                UPDATE visitor_stats 
                SET visit_count = visit_count + 1, 
                    last_visit = CURRENT_TIMESTAMP 
                WHERE id = 1
                RETURNING visit_count
            """)
            result = cur.fetchone()
            
            if not result:
                cur.execute("""
                    INSERT INTO visitor_stats (visit_count) 
                    VALUES (1) 
                    RETURNING visit_count
                """)
                result = cur.fetchone()
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'visit_count': result['visit_count']}),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            cur.execute("SELECT visit_count FROM visitor_stats WHERE id = 1")
            result = cur.fetchone()
            
            visit_count = result['visit_count'] if result else 0
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'visit_count': visit_count}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
            
    finally:
        cur.close()
        conn.close()
