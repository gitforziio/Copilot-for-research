from mysql_connection import query, insert

class Note():
    def __init__(self, node_id, topic_id, conversation_id, reference_text, reference_text_start, reference_text_end, comment, last_modified_ts) -> None:
        self.conversation_id = conversation_id
        self.node_id = node_id
        self.topic_id = topic_id
        self.reference_text = reference_text
        self.reference_text_start = reference_text_start
        self.reference_text_end = reference_text_end
        self.comment = comment
        self.last_modified_ts = last_modified_ts

class NoteDao():
    def __init__(self) -> None:
        pass

    def get_all_under_topic(self, topic_id):
        rows = query("""
        select id, topic_id, conversation_id, text, text_start, text_end, comment, UNIX_TIMESTAMP(last_modified_time) ts
        from note
        where topic_id = %s
        """ % str(topic_id))
        ret = []
        for r in rows:
            ele = Note(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7])
            ret.append(ele)
        return ret
    
    def insert_note(self, topic_id, conversation_id, text, text_start, text_end, comment):
        conversation_id = conversation_id or "NULL"
        text = ("\"%s\"" % text) if text else "NULL"
        text_start = text_start or "NULL"
        text_end = text_end or "NULL"
        comment = ("\"%s\"" % comment) if comment else "NULL"
        vals = (str(topic_id), str(conversation_id), str(comment), text, str(text_start), str(text_end))
        sql = """INSERT INTO note (topic_id, conversation_id, comment, text, text_start, text_end) VALUES (%s, %s, %s, %s, %s, %s)""" % vals
        row = insert("note", sql)

        ret = Note(
            row[0],
            row[1],
            row[2],
            row[4],
            row[5],
            row[6],
            row[3],
            int(row[8].timestamp())
        )
        return ret
