
import resources.db_helper.helperfile as helperfile
from flask import current_app as app
import inflection

def execute_query(sql):
    """
    This function is used for converting the list of tuple data into a list of dictionary
    with keys as their column names. 
    """
    conn = helperfile.get_db_connection()
    if conn:
        app.logger.info("DB Connected")
        cur = conn.cursor() 
        cur.execute(sql)
        columns = [inflection.camelize(column[0], False) for column in cur.description]
        final_data = []
        for row in cur.fetchall():
                final_data.append(dict(zip(columns, row)))
        return(final_data)
    else:
        app.logger.error("Internal Server Error")
        return([])
