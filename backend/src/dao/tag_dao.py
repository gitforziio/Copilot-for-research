from mysql_connection import query, insert

class Tag():
    def __init__(self, tag_id, tag_name, doc_count, last_modified_ts) -> None:
        self.tag_id = tag_id
        self.tag_name = tag_name
        self.doc_count = doc_count
        self.last_modified_ts = last_modified_ts

class TagDao():
    def __init__(self) -> None:
        self.all_tags = self.get_all_tags()

    def get_all_tags(self):
        rows = query("""
        select a.id, name, count(distinct document_id) doc_cnt, ts
        from (
            select id, name, UNIX_TIMESTAMP(last_modified_time) ts
            from tag
        ) a left outer join tag_document b
        on a.id = b.tag_id
        group by 1, 2
        """)
        ret = []
        for r in rows:
            ele = Tag(r[0], r[1], r[2], r[3])
            ret.append(ele)
        return ret
    
    def get_all_under_topic(self, topic_id):
        return self.all_tags
        # rows = query("""
        # select a.id, name, count(distinct document_id) doc_cnt, ts
        # from (
        #     select id, name, UNIX_TIMESTAMP(last_modified_time) ts
        #     from tag
        # ) a left outer join tag_document b
        # on a.id = b.tag_id
        # where a.id in (select tag_id from v_tag_topic where topic_id = %s)
        # group by 1, 2
        # """ % str(topic_id))
        # ret = []
        # for r in rows:
        #     ele = Tag(r[0], r[1], r[2], r[3])
        #     ret.append(ele)
        # return ret
    
    def insert_tag(self, tag_name):
        sql = """INSERT INTO tag (name) VALUES ("%s")""" % tag_name
        row = insert("tag", sql)

        ret = Tag(
            row[0],
            row[1],
            0,
            int(row[3].timestamp())
        )

        self.all_tags.append(ret)
        return ret
    
    def ids_to_tags(self, ids):
        id_set = set(ids)
        return [_ for _ in self.all_tags if _.tag_id in id_set]
    
    def name_to_ids(self, names):
        name_set = set(names)
        return [_.tag_id for _ in self.all_tags if _.tag_name in name_set]

instance = TagDao()
