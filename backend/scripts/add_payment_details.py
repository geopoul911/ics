import psycopg2

# Database connection details
host = "localhost"
database = "v2"
user = "postgres"
password = "cosmoplan"


suppliers = [
    'webapp_contact',
]

# Establish connection
try:
    connection = psycopg2.connect(
        host=host,
        database=database,
        user=user,
        password=password
    )

    cursor = connection.cursor()
    id = 7254
    for supplier in suppliers:
        cursor.execute(f"SELECT * FROM {supplier} WHERE type='L'")

        for entry in cursor.fetchall():
            entry_id = entry[0]
            cursor.execute(f"INSERT INTO webapp_paymentdetails values ({id}, '', '', '', '') ")
            cursor.execute(f"UPDATE {supplier} set payment_details_id = {id} where id = {entry_id}")
            id += 1
            connection.commit()
except (Exception, psycopg2.Error) as error:
    print("Error while connecting to PostgreSQL", error)
