from mysql_connection import query

class Document():
    def __init__(self, doc_id, doc_title, summary, full_text, last_modified_ts) -> None:
        self.doc_id = doc_id
        self.doc_title = doc_title
        self.summary = summary
        self.full_text = full_text 
        self.last_modified_ts = last_modified_ts

class DocumentDao():
    def __init__(self) -> None:
        pass

    def get_all_under_tag(self, tag_id):
        rows = query("""
        select a.id, title, UNIX_TIMESTAMP(a.last_modified_time) ts
        from document  a join tag_document b 
        where a.id = b.document_id and b.tag_id = %s
        """ % str(tag_id))
        ret = []
        for r in rows:
            ele = Document(r[0], r[1], None, None, r[2])
            ret.append(ele)
        return ret
    
    def get_full_document(self, doc_id):
        rows = query("""
        select full_text
        from document
        where id = %s
        """ % str(doc_id))
        return rows[0][0]
    
    def get_summary(self, doc_id):
        rows = query("""
        select summary
        from document
        where id = %s
        """ % str(doc_id))
        return rows[0][0]
