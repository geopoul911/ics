import openpyxl
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
    password=password,
)

cursor = connection.cursor()

# Load the Excel file
workbook = openpyxl.load_workbook(r'C:\Users\George_P\Desktop\Development\V2\Group_Plan\data\worldcities.xlsx')
sheet = workbook.active

# Dictionary to store country names and corresponding IDs
country_id_map = {}

# Retrieve country IDs from the Country table
cursor.execute("SELECT id, name FROM webapp_country")
for country_id, country_name in cursor.fetchall():
    country_id_map[country_name] = country_id

# Iterate over rows in the Excel file
for row in sheet.iter_rows(min_row=2, values_only=True):  # Assuming the first row contains headers
    try:
        city_name, country_name, lat, lng = row

        # Check if the city already exists in the database
        cursor.execute("SELECT id FROM webapp_city WHERE name = %s", (city_name,))
        city_record = cursor.fetchone()

        if city_record:
            city_id = city_record[0]
            # print(f"City '{city_name}' already exists in the database.")
        else:
            # Check if the country name exists in the country_id_map
            if country_name in country_id_map:
                country_id = country_id_map[country_name]

                # Insert the city into the database
                cursor.execute("INSERT INTO webapp_city (name, country_id, lat, lng) VALUES (%s, %s, %s, %s) RETURNING id", (city_name, country_id, lat, lng))
                city_id = cursor.fetchone()[0]
                # print(f"Inserted city '{city_name}'")

            else:
                print(f"Country '{country_name}' not found in the database.")

    except Exception as e:
        print(e)
        continue

# Commit the changes and close the connection
connection.commit()
connection.close()

print("Data insertion completed.")
