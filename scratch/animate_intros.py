import re

with open('src/routes/index.tsx', 'r') as f:
    content = f.read()

# Define the animation snippet
variants_str = """          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}"""

item_variants = """variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}"""

def replacer(match):
    div_start = match.group(1)
    label_start = match.group(2)
    label_content = match.group(3)
    h2_start = match.group(4)
    h2_content = match.group(5)
    p_start = match.group(6)
    p_content = match.group(7)

    # Insert variants_str inside the wrapper div
    new_div_start = div_start.replace('<div ', f'<motion.div\n{variants_str}\n          ')
    
    # Process Label
    new_label = f'          <motion.div {item_variants}>\n            <SectionLabel>{label_content}</SectionLabel>\n          </motion.div>'
    
    # Process H2
    new_h2 = h2_start.replace('<h2 ', f'<motion.h2 {item_variants} ') + h2_content + '</motion.h2>'
    
    # Process P
    new_p = p_start.replace('<p ', f'<motion.p {item_variants} ') + p_content + '</motion.p>'

    return f"{new_div_start}\n{new_label}\n{new_h2}\n{new_p}\n        </motion.div>"

# Regex to match the container div and its 3 children
# It looks for: <div ...> \s* <SectionLabel>...</SectionLabel> \s* <h2 ...>...</h2> \s* <p ...>...</p> \s* </div>
pattern = re.compile(
    r'(<div\s+className="[^"]*?(?:mb-16|text-center)[^"]*?"[^>]*?>)\s*'
    r'<SectionLabel>(.*?)</SectionLabel>\s*'
    r'(<h2\s+className="[^"]*?"[^>]*?>)(.*?)(</h2>)\s*'
    r'(<p\s+className="[^"]*?"[^>]*?>)(.*?)(</p>)\s*'
    r'</div>',
    re.DOTALL
)

new_content = pattern.sub(replacer, content)

with open('src/routes/index.tsx', 'w') as f:
    f.write(new_content)

print(f"Replaced {len(pattern.findall(content))} sections.")
