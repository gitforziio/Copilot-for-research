from mysql_connection import query, insert
from dao.tag_dao import instance as tag_dao

class Conversation():
    def __init__(self, conversation_id, conversation_type, topic_id, doc_id, doc_title, question, answer, next_keywords, tags, last_modified_ts) -> None:
        self.conversation_id = conversation_id
        self.conversation_type = conversation_type
        self.topic_id = topic_id
        self.doc_id = doc_id
        self.doc_title = doc_title
        self.question = question
        self.answer = answer
        self.next_keywords = next_keywords
        self.tags = tags
        self.last_modified_ts = last_modified_ts

class ConversationDao():
    def __init__(self) -> None:
        pass

    def get_all_under_topic(self, topic_id):
        rows = query("""
        select id, type, topic_id, document_id, question, answer, next_keywords, tag_ids, UNIX_TIMESTAMP(last_modified_time) ts
        from conversation
        where topic_id = %s
        """ % str(topic_id))
        ret = []
        for r in rows:
            next_keywords = r[6].split(',') if r[6] else []
            tag_ids = [int(_) for _ in r[7].split(',')] if r[7] else []
            ele = Conversation(r[0], r[1], r[2], r[3], "", r[4], r[5], next_keywords, tag_ids, r[8])
            ret.append(ele)
        return ret
    
    def insert_conversation(self, conversation_type, topic_id, doc_id, doc_title, question, answer, next_keywords, tags):
        doc_id = doc_id or "NULL"
        question = ("\"%s\"" % question) if question else "NULL"
        answer = ("\"%s\"" % answer) if answer else "NULL"
        next_keywords = ",".join(next_keywords or [])
        tag_ids = ",".join([str(_) for _ in tag_dao.name_to_ids(tags or [])])

        vals = tuple([conversation_type, str(topic_id), str(doc_id), question, answer, next_keywords, tag_ids])

        sql = """INSERT INTO conversation (type, topic_id, document_id, question, answer, next_keywords, tag_ids)
        VALUES ("%s", %s, %s, %s, %s, "%s", "%s")""" % vals
        row = insert("conversation", sql)

        ret = Conversation(
            row[0],
            row[1],
            row[2],
            row[3],
            doc_title,
            row[4],
            row[5],
            row[6] or [],
            row[7] or [],
            int(row[9].timestamp())
        )
        return ret
