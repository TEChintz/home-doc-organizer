import re

with open('src/routes/index.tsx', 'r') as f:
    content = f.read()

# Let's find snippets that match `<SectionLabel>` and the following `<h2>` and `<p>`
pattern = re.compile(r'(\s*)<SectionLabel>.*?</SectionLabel>\s*<h2.*?>.*?</h2>\s*<p.*?>.*?</p>', re.DOTALL)
matches = pattern.findall(content)

print(f"Found {len(matches)} sections with standard intro layout.")
