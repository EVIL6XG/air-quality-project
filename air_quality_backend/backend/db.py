import pg8000

def get_connection():
    return pg8000.connect(
        database="airq_almaty",
        user="postgres",
        password="postgre",
        host="localhost",
        port=5432
    )