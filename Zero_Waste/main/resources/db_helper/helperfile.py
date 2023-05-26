import os
import psycopg2
import logging


def get_db_connection():
    """
    function for connection to database

    """
    conn = psycopg2.connect(host='localhost',
                            database='zero_waste',
                            user=os.environ['DB_USERNAME'],
                            password=os.environ['DB_PASSWORD'])
    conn.autocommit = True
    logging.info("connected to  DB")
    return conn