from mysql_connection import query

class Topic():
    def __init__(self, topic_id, topic_name, doc_count, tag_count, last_modified_ts) -> None:
        self.topic_id = topic_id
        self.topic_name = topic_name
        self.doc_count = doc_count
        self.tag_count = tag_count
        self.last_modified_ts = last_modified_ts

class TopicDao():
    def __init__(self) -> None:
        pass

    def get_all(self):
        rows = query("""
        select id, name, coalesce(doc_count, 0) doc_count, coalesce(tag_count, 0) tag_count, UNIX_TIMESTAMP(last_modified_time) last_modified_ts
        from topic a left outer join (
            select topic_id, count(distinct document_id) doc_count, count(distinct tag_id) tag_count
            from (
                select a.document_id, a.topic_id, b.tag_id
                from document_topic a join tag_document b
                on a.document_id = b.document_id
            ) a
            group by 1
        ) b on a.id = b.topic_id
        """)
        ret = []
        for r in rows:
            ele = Topic(r[0], r[1], r[2], r[3], r[4])
            ret.append(ele)
        return ret
