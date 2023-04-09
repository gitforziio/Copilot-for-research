from flask import Flask, jsonify
from flask import request
from flask_cors import CORS
from dao.topic_dao import TopicDao
from dao.tag_dao import instance as tag_dao
from dao.conversation_dao import ConversationDao
from dao.note_dao import NoteDao
from dao.document_dao import DocumentDao
from utils import get_nullable, get_json_from_request
from ai_utils.qa import ai_answer
import re

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def hello_world():
    return "<p>Hello from You Dian Wen Hua</p>"

topic_dao = TopicDao()
conversation_dao = ConversationDao()
note_dao = NoteDao()
document_dao = DocumentDao()

def keep_chinese(str):
    chinese = "[^\u4e00-\u9fa5]"
    str = re.sub(chinese, "", str)
    return str

@app.route("/topic/all")
def get_all_topics():
    ret = topic_dao.get_all()
    return [_.__dict__ for _ in ret]
    # return [
    #     {
    #         "topic_id": 1,
    #         "topic_name": "fake topic",
    #         "doc_count": 1,
    #         "tag_count": 2,
    #         "last_modified_ts": 0
    #     }
    # ]

@app.route("/topic/<topic_id>/tags")
def get_topic_tags(topic_id):
    ret = tag_dao.get_all_under_topic(topic_id)
    return [_.__dict__ for _ in ret]
    # return [
    #     {
    #         "tag_id": 1,
    #         "tag_name": "fake tag",
    #         "doc_count": 10,
    #         "last_modified_ts": 0
    #     }
    # ]

@app.route("/topic/<topic_id>/conversations")
def get_topic_conversations(topic_id):
    ret = conversation_dao.get_all_under_topic(topic_id)
    return [_.__dict__ for _ in ret]
    # return [
    #     {
    #         "conversation_id": 1,
    #         "conversation_type": "Full",
    #         "topic_id": 1,
    #         "doc_id": 1,
    #         "question": "fake question",
    #         "answer": "fake answer",
    #         "next_keywords": ["fake keyword"],
    #         "tags": [
    #             {
    #                 "tag_id": 1,
    #                 "tag_name": "fake tag"
    #             }
    #         ],
    #         "last_modified_ts": 0
    #     }
    # ]

@app.route("/topic/<topic_id>/notes")
def get_topic_notes(topic_id):
    ret = note_dao.get_all_under_topic(topic_id)
    return [_.__dict__ for _ in ret]
    # return [
    #     {
    #         "node_id": 1,
    #         "topic_id": 1,
    #         "conversation_id": 1,
    #         "reference_text": "fake text",
    #         "reference_text_start": 1,
    #         "reference_text_end": 3,
    #         "comment": "fake comment",
    #         "last_modified_ts": 0
    #     }
    # ]

@app.route("/tag/<tag_id>/documents")
def get_tag_documents(tag_id):
    ret = document_dao.get_all_under_tag(tag_id)
    return [_.__dict__ for _ in ret]
    # return [
    #     {
    #         "doc_id": 1,
    #         "doc_title": "fake title"
    #     }
    # ]

@app.post("/conversation/create")
def create_conversation():
    data = get_json_from_request(request)
    if data is None:
        return "please check content type in header"
    type = data['type']
    topic_id = data['topic_id']
    doc_id = get_nullable(data, 'doc_id')
    question = get_nullable(data, 'question')

    doc_title = None
    if type == "full":
        answer = document_dao.get_full_document(doc_id)
        next_keywords, tags = [], []
    elif type == "summary":
        answer = document_dao.get_summary(doc_id)
        next_keywords, tags = [], []
    else:
        # TODO: get answer from AI
        try:
            ai_response = ai_answer(question)
        except Exception as e:
            print(e)
            ai_response = {
                "file_name": None,
                "answer": "AI正忙",
                "follow_up": []
            }
        # ai_response = {
        #     "file_name": "fake_fn.txt",
        #     "answer": "fake answer"
        # }
        filename = ai_response['file_name']
        doc_title = filename[:-4]
        next_keywords = ai_response['follow_up']
        answer = ai_response['answer']
        if next_keywords:
            next_keywords = [keep_chinese(_.strip()) for _ in next_keywords]
        tags = []

    ret = conversation_dao.insert_conversation(type, topic_id, doc_id, doc_title, question, answer, next_keywords, tags)
    return ret.__dict__
    # return {
    #     "conversation_id": 1,
    #     "conversation_type": "Full",
    #     "doc_id": 1,
    #     "question": "fake question",
    #     "answer": "fake answer",
    #     "next_keywords": ["fake keyword"],
    #     "tags": [
    #         {
    #             "tag_id": 1,
    #             "tag_name": "fake tag"
    #         }
    #     ],
    #     "last_modified_ts": 0
    # }

@app.post("/note/create")
def create_note():
    data = get_json_from_request(request)
    if data is None:
        return "please check content type in header"

    topic_id = data['topic_id']
    conversation_id = get_nullable(data, 'conversation_id')
    # note_id = get_nullable(data, 'note_id')
    text = get_nullable(data, 'text')
    text_start = get_nullable(data, 'text_start')
    text_end = get_nullable(data, 'text_end')
    comment = get_nullable(data, 'comment')

    ret = note_dao.insert_note(topic_id, conversation_id, text, text_start, text_end, comment)
    return ret.__dict__
    # return {
    #     "node_id": 1,
    #     "topic_id": 1,
    #     "conversation_type": "Full",
    #     "reference_text": "fake text",
    #     "reference_text_start": 1,
    #     "reference_text_end": 3,
    #     "comment": "fake comment",
    #     "last_modified_ts": 0
    # }

@app.post("/tag/create")
def create_tag():
    data = get_json_from_request(request)
    if data is None:
        return "please check content type in header"
    tag_name = data['tag_name']
    ret = tag_dao.insert_tag(tag_name)
    return ret.__dict__
    # return {
    #     "tag_id": 1,
    #     "tag_name": "fake tag",
    #     "doc_count": 0,
    #     "last_modified_ts": 0
    # }

if __name__ == "__main__":
    app.run(debug=True)
