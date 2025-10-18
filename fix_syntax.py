#!/usr/bin/env python3
import os
import re
import glob

def fix_syntax_errors(file_path):
    """Fix common syntax errors caused by incorrect regex replacements"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Fix }}}} patterns
        content = re.sub(r'}\s*}\s*}\s*}', '}', content)
        content = re.sub(r'}\s*}\s*}', '}', content)
        content = re.sub(r'}\s*}', '}', content, count=1)
        
        # Fix specific patterns that were broken
        content = re.sub(r'<div\s*}\s*}\s*}', '<div', content)
        content = re.sub(r'<div\s*}\s*}', '<div', content)
        content = re.sub(r'<div\s*}', '<div', content)
        
        # Fix onClick patterns
        content = re.sub(r'onClick=\{[^}]*\}\s*}\s*}\s*}\s*:\s*\{\}', 'onClick={onClick}', content)
        content = re.sub(r'onClick=\{[^}]*\}\s*}\s*}\s*}', 'onClick={onClick}', content)
        content = re.sub(r'onClick=\{[^}]*\}\s*}\s*}', 'onClick={onClick}', content)
        
        # Fix className patterns
        content = re.sub(r'className=\{`[^`]*`\}\s*:\s*\{\}\s*}\s*:\s*\{\}', 'className={`${className}`}', content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed: {file_path}")
            return True
        else:
            return False
            
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    # Find files with potential issues
    problematic_files = []
    
    # Find all TypeScript and JavaScript files
    file_patterns = ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js']
    all_files = []
    
    for pattern in file_patterns:
        all_files.extend(glob.glob(pattern, recursive=True))
    
    # Filter out node_modules and other unwanted directories
    all_files = [f for f in all_files if 'node_modules' not in f and '.next' not in f]
    
    # Find files with syntax issues
    for file_path in all_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # Look for multiple closing braces
                if '}}' in content and ('function' not in content or 'arrow' not in content):
                    if re.search(r'}\s*}\s*}|<\w+\s*}', content):
                        problematic_files.append(file_path)
        except:
            pass
    
    print(f"🔍 Found {len(problematic_files)} files with potential syntax issues")
    
    fixed_count = 0
    for file_path in problematic_files:
        if fix_syntax_errors(file_path):
            fixed_count += 1
    
    print(f"\n🎉 Fixed {fixed_count} files")

if __name__ == "__main__":
    main()