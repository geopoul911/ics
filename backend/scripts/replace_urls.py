import os

# Root Directory
# root_dir = r"C:\Users\George_P\Desktop\Development\V2"
# root_dir = r"C:\Users\admin\Desktop\development\Cosmoplan\v2"
root_dir = r"C:\Users\TZAdmin\OneDrive\Desktop\Development\ICSSSSSSSSSSS"

# Extensions to work on
extensions = ['js', 'jsx']

# Exclude node_modules folder
node_ = 'node_modules'

# Count changed files
counter = 0

# Loop over root directory file system, recursively
for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        # If the file's extension is js or jsx, and the file is not in the node modules
        # and the file is not the actual script:
        if file.split('.')[-1] in extensions and node_ not in subdir and file != 'replace_urls.py':

            # We use try because some files throw :
            # UnicodeDecodeError: 'charmap' codec can't decode byte
            # 0x9c in position 14327: character maps to <undefined>
            try:
                # Get file to edit
                file_to_edit = open(os.path.join(subdir, file), 'rt')

                # Read the file
                data = file_to_edit.read()

                # # # # Uncomment for production
                # if 'http://localhost:8000' in data:
                #     data = data.replace('http://localhost:8000', 'https://groupplan.gr')

                # # # # Uncomment for Development
                if 'https://groupplan.gr' in data:
                    data = data.replace('https://groupplan.gr', 'http://localhost:8000')

                # S ap Tiny MCE Keys
                # i  'elilv793grq3pztyh59qvhv5s03ptdkjj3c9ptjpvj7rdjif' in data:
                #     data = data.replace('elilv793grq3pztyh59qvhv5s03ptdkjj3c9ptjpvj7rdjif', 'gbn17r35npt722cfkbjivwssdep33fkit1sa1zg7976rhjzc')

                    # Close the file
                    file_to_edit.close()

                    # Reopen the file in write mode
                    file_to_edit = open(os.path.join(subdir, file), 'wt')

                    # Write the replaced data
                    file_to_edit.write(data)

                    # Save the file
                    file_to_edit.close()

                    # Incr counter
                    counter += 1

                    # Print action
                    print(f" # {counter}) Replaced {file}")
            except UnicodeDecodeError:
                continue
