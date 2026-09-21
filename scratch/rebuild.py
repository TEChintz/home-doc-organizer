import re

with open('src/routes/index.tsx', 'r') as f:
    content = f.read()

# 1. Add framer-motion import
if 'import { motion }' not in content:
    content = content.replace('import React', 'import React from "react";\nimport { motion } from "framer-motion";\nimport { DocketLogo } from "@/components/ui/docket-logo";')

# 2. Reorder Sections
# We need to extract the sections. We can use a simple state machine or regex to find sections.
# Looking at index.tsx structure, all sections start with <section className="relative overflow-hidden...
# Let's split by '<section className="relative overflow-hidden'
sections_split = content.split('<section className="relative overflow-hidden')

# sections_split[0] is everything before the first section (Header, Hero, etc.)
# We know the original order in index.tsx is:
# [0] Header + Hero
# [1] Features (bg-surface)
# [2] DigiLocker (bg-background)
# [3] Expiry (bg-surface)
# [4] Household (bg-grid-fade)
# [5] Security (bg-background)
# [6] WhatsApp (bg-background)
# [7] Pricing (bg-surface)
# [8] CTA (bg-background)
# [9] Footer (bg-surface)

if len(sections_split) == 9:
    hero_and_before = sections_split[0]
    features = '<section className="relative overflow-hidden' + sections_split[1]
    digilocker = '<section className="relative overflow-hidden' + sections_split[2]
    expiry = '<section className="relative overflow-hidden' + sections_split[3]
    household = '<section className="relative overflow-hidden' + sections_split[4]
    security = '<section className="relative overflow-hidden' + sections_split[5]
    whatsapp = '<section className="relative overflow-hidden' + sections_split[6]
    pricing = '<section className="relative overflow-hidden' + sections_split[7]
    
    # We want to drop the CTA section completely. It's the last section before the footer.
    # The last element in sections_split contains CTA and Footer.
    cta_and_footer = '<section className="relative overflow-hidden' + sections_split[8]
    # Split CTA and Footer
    footer_split = cta_and_footer.split('<footer')
    # we just discard footer_split[0] (which is CTA) and keep the footer
    footer = '<footer' + footer_split[1]

    # Desired order: WhatsApp -> Features -> DigiLocker -> Household -> Expiry -> Security -> Pricing -> Footer
    new_content = hero_and_before + whatsapp + features + digilocker + household + expiry + security + pricing + footer
    
    # 3. Replace <section ...> with <motion.section ...>
    new_content = new_content.replace('<section className="relative overflow-hidden', '<motion.section\n        initial={{ opacity: 0, y: 30 }}\n        whileInView={{ opacity: 1, y: 0 }}\n        viewport={{ once: true, margin: "-100px" }}\n        transition={{ duration: 0.6, ease: "easeOut" }}\n        className="relative overflow-hidden')
    new_content = new_content.replace('</section>', '</motion.section>')

    # 4. Footer replacement
    footer_regex = re.compile(r'<footer.*?</footer>', re.DOTALL)
    new_footer = """<footer className="relative bg-surface overflow-hidden border-t border-border pt-16 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center w-full">
          <svg className="w-[80%] h-auto" viewBox="0 0 1000 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="font-black text-black" fontSize="240" letterSpacing="-0.02em" fill="currentColor">
              DOCKET
            </text>
          </svg>
        </div>
        <div className="mt-8 flex justify-center">
          <p className="text-sm font-bold text-muted-foreground/50">
            © {new Date().getFullYear()} TEChintz. All rights reserved.
          </p>
        </div>
      </footer>"""
    new_content = footer_regex.sub(new_footer, new_content)

    with open('src/routes/index.tsx', 'w') as f:
        f.write(new_content)
    print("Reorder and motion wrapper successful.")
else:
    print(f"Error: expected 9 sections, found {len(sections_split)}")

