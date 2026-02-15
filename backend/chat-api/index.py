import json
import os
import psycopg2

def handler(event, context):
    """API чата FNANT — отправка и получение сообщений"""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        after_id = params.get('after_id', '0')

        cur.execute(
            "SELECT id, username, message, avatar, color, title, created_at "
            "FROM chat_messages WHERE id > %s ORDER BY id ASC LIMIT 100" % int(after_id)
        )
        rows = cur.fetchall()
        messages = []
        for row in rows:
            messages.append({
                'id': row[0],
                'username': row[1],
                'message': row[2],
                'avatar': row[3],
                'color': row[4],
                'title': row[5],
                'created_at': row[6].isoformat() if row[6] else None
            })

        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'messages': messages})
        }

    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        username = body.get('username', '').strip()[:50]
        message = body.get('message', '').strip()[:500]
        avatar = body.get('avatar', '😎')[:10]
        color = body.get('color', '#a855f7')[:20]
        title = body.get('title')

        if not username or not message:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'username and message required'})
            }

        cur.execute(
            "INSERT INTO chat_messages (username, message, avatar, color, title) "
            "VALUES ('%s', '%s', '%s', '%s', %s) RETURNING id, created_at"
            % (
                username.replace("'", "''"),
                message.replace("'", "''"),
                avatar.replace("'", "''"),
                color.replace("'", "''"),
                ("'%s'" % title.replace("'", "''")) if title else 'NULL'
            )
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 201,
            'headers': headers,
            'body': json.dumps({
                'id': row[0],
                'username': username,
                'message': message,
                'avatar': avatar,
                'color': color,
                'title': title,
                'created_at': row[1].isoformat() if row[1] else None
            })
        }

    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps({'error': 'Method not allowed'})
    }
