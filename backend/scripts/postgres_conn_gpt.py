import psycopg2

# Database connection details
host = "localhost"
database = "v2"
user = "postgres"
password = "cosmoplan"

# Establish connection
try:
    connection = psycopg2.connect(
        host=host,
        database=database,
        user=user,
        password=password
    )

    cursor = connection.cursor()

    # Sample query
    query = "SELECT * FROM WEBAPP_GROUPTRANSFER"

    # Execute query
    cursor.execute(query)

    # Fetch all the results
    results = cursor.fetchall()

    # Print the results
    for row in results:
        print(row)

    # Commit the transaction
    connection.commit()

except (Exception, psycopg2.Error) as error:
    print("Error while connecting to PostgreSQL", error)

finally:
    if cursor:
        cursor.close()

    if connection:
        connection.close()
