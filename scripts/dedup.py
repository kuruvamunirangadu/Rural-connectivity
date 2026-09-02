with open('apps/web/src/app/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Look for the second occurrence of 'use client' or start of duplicate
second_start = -1
for i, line in enumerate(lines[10:], start=10):
    if "'use client'" in line or '"use client"' in line or 'export type RoleType' in line:
        second_start = i
        break

if second_start != -1:
    clean_lines = lines[:second_start]
    with open('apps/web/src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.writelines(clean_lines)
    print(f"Cleaned page.tsx: retained first {len(clean_lines)} lines.")
else:
    print(f"No duplicate start found, total lines: {len(lines)}")

