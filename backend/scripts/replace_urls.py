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
        if file.split('.')[-1] in extensions and node_ not in subdir and file != 'replace_urls.py':
            try:
                file_to_edit = open(os.path.join(subdir, file), 'rt')
                data = file_to_edit.read()

                # # # # Uncomment for production
                if 'http://localhost:8000' in data:
                    data = data.replace('http://localhost:8000', 'https://ultima.icsgr.com')

                # # # # Uncomment for Development
                # if 'https://groupplan.gr' in data:
                    # data = data.replace('https://yourdomain.gr', 'http://localhost:8000')
                    file_to_edit.close()
                    file_to_edit = open(os.path.join(subdir, file), 'wt')
                    file_to_edit.write(data)
                    file_to_edit.close()

                    # Incr counter
                    counter += 1
                    print(f" # {counter}) Replaced {file}")
            except UnicodeDecodeError:
                continue
