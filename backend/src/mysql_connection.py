import mysql.connector

class MyConnection():
    def __init__(self) -> None:
        self.connection = self.init_connection()

    def init_connection(self):
        return mysql.connector.connect(
            pool_name = "mypool",
            pool_size = 5,
            user='youdianwenhua',
            password='Ydwh!@#12',
            host="18.139.160.126",
            database='youdianwenhua')

cnx = MyConnection()

def query(sql):
    if not cnx.connection.is_connected():
        cnx.init_connection()
    cursor = cnx.connection.cursor()
    cursor.execute(sql)
    results = list(cursor.fetchall())
    cursor.close()
    return results 

def insert(table, sql):
    if not cnx.connection.is_connected():
        cnx.init_connection()
    cursor = cnx.connection.cursor()
    cursor.execute(sql)
    cnx.connection.commit()
    result = cursor.lastrowid
    read_sql = "select * from %s where id = %d" % (table, result)
    cursor.execute(read_sql)
    row = cursor.fetchall()[0]
    cursor.close()
    return row
