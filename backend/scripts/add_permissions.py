import psycopg2

# Database connection details
host = "localhost"
database = "v2"
user = "postgres"
password = "cosmoplan"

connection = psycopg2.connect(
    host=host,
    database=database,
    user=user,
    password=password
)

# List of user ids
user_ids = [
    84, 86, 87, 88,
    93, 94, 95, 97,
    98, 99, 102, 103,
    104, 105, 106, 107,
    108, 109, 110, 111,
    112, 113, 114, 115,
    116, 117, 118, 119,
    120, 127, 128, 129,
    131, 132, 133,
]

# List of permission types and their corresponding descriptions
permission_mapping = {
    'CRE': 'can_create_nas_folders',
    'UPD': 'can_update_nas_folders',
    'DEL': 'can_delete_nas_folders',
    'VIE': 'can_view_nas_folders'
}

# SQL statement template for insertion
sql_insert = """
    INSERT INTO accounts_userpermissions
    (id, user_id, model, permission_type, value, description)
    VALUES (DEFAULT, %s, 'NAS', %s, true, %s)
"""

# Create a cursor
cur = connection.cursor()

# Insert records for each user and permission type combination
for user_id in user_ids:
    for perm_type, description in permission_mapping.items():
        cur.execute(sql_insert, (user_id, perm_type, description))

# Commit the transaction
connection.commit()

# Close the cursor and connection
connection.close()

print("Records inserted successfully.")
