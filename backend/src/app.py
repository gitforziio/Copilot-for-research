from flask import Flask
from flask import request

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello from You Dian Wen Hua</p>"

@app.route("/topic/all")
def get_all_topics():
    return [
        {
            "topic_id": 1,
            "topic_name": "fake topic",
            "doc_count": 1,
            "tag_count": 2,
            "last_modified_ts": 0
        }
    ]

@app.route("/topic/<topic_id>/tags")
def get_topic_tags(topic_id):
    return [
        {
            "tag_id": 1,
            "tag_name": "fake tag",
            "doc_count": 10,
            "last_modified_ts": 0
        }
    ]

@app.route("/topic/<topic_id>/conversations")
def get_topic_conversations(topic_id):
    return [
        {
            "conversation_id": 1,
            "conversation_type": "Full",
            "doc_id": 1,
            "question": "fake question",
            "anwser": "fake anwser",
            "next_keywords": ["fake keyword"],
            "tags": [
                {
                    "tag_id": 1,
                    "tag_name": "fake tag"
                }
            ],
            "last_modified_ts": 0
        }
    ]

@app.route("/topic/<topic_id>/notes")
def get_topic_notes(topic_id):
    return [
        {
            "node_id": 1,
            "topic_id": 1,
            "conversation_type": "Full",
            "reference_text": "fake text",
            "reference_text_start": 1,
            "reference_text_end": 3,
            "comment": "fake comment",
            "last_modified_ts": 0
        }
    ]

@app.route("/tag/<tag_id>/documents")
def get_tag_documents(tag_id):
    return [
        {
            "doc_id": 1,
            "doc_title": "fake title"
        }
    ]

@app.post("/conversation/create")
def create_conversation():
    print(request.data)
    return {
        "conversation_id": 1,
        "conversation_type": "Full",
        "doc_id": 1,
        "question": "fake question",
        "anwser": "fake anwser",
        "next_keywords": ["fake keyword"],
        "tags": [
            {
                "tag_id": 1,
                "tag_name": "fake tag"
            }
        ],
        "last_modified_ts": 0
    }

@app.post("/note/create")
def create_note(tag_id):
    print(request.data)
    return {
        "node_id": 1,
        "topic_id": 1,
        "conversation_type": "Full",
        "reference_text": "fake text",
        "reference_text_start": 1,
        "reference_text_end": 3,
        "comment": "fake comment",
        "last_modified_ts": 0
    }

@app.post("/tag/create")
def create_tag(tag_id):
    print(request.data)
    return {
        "tag_id": 1,
        "tag_name": "fake tag",
        "doc_count": 0,
        "last_modified_ts": 0
    }

if __name__ == "__main__":
    app.run(debug=True)
