def get_nullable(d, k):
    return d[k] if k in d else None

def get_json_from_request(request):
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        return json
    else:
        return None