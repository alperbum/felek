import re
import json

with open('js/script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract categories
cat_match = re.search(r'let categories = (\[.*?\]);', content, re.DOTALL)
if cat_match:
    categories_str = cat_match.group(1)
    # Dirty fix for JS object to JSON
    categories_str = re.sub(r'(\w+):', r'"\1":', categories_str)
    categories = json.loads(categories_str)
else:
    categories = []

# Extract menuData
menu_match = re.search(r'let menuData = (\[.*?\]);\s*let categories', content, re.DOTALL)
if menu_match:
    menu_str = menu_match.group(1)
    menu_str = re.sub(r'(\w+):', r'"\1":', menu_str)
    # menu_str contains newlines and single quotes, it might be tricky to parse as JSON.
    # Let's use a more robust way to parse it, or just use Node.js
    pass

