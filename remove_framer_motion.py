#!/usr/bin/env python3
import os
import re
import glob

def remove_framer_motion_from_file(file_path):
    """Remove framer-motion imports and usage from a TypeScript/JavaScript file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remove framer-motion imports
        content = re.sub(r"import\s+{[^}]*}\s+from\s+['\"]framer-motion['\"];?\n?", "", content)
        content = re.sub(r"import\s+\*\s+as\s+\w+\s+from\s+['\"]framer-motion['\"];?\n?", "", content)
        content = re.sub(r"import\s+\w+\s+from\s+['\"]framer-motion['\"];?\n?", "", content)
        
        # Remove motion. usage and replace with div
        content = re.sub(r"<motion\.(\w+)", r"<\1", content)
        content = re.sub(r"</motion\.(\w+)>", r"</\1>", content)
        
        # Remove common motion props
        content = re.sub(r"\s*initial\s*=\s*{[^}]*}", "", content)
        content = re.sub(r"\s*animate\s*=\s*{[^}]*}", "", content)
        content = re.sub(r"\s*transition\s*=\s*{[^}]*}", "", content)
        content = re.sub(r"\s*exit\s*=\s*{[^}]*}", "", content)
        content = re.sub(r"\s*whileHover\s*=\s*{[^}]*}", "", content)
        content = re.sub(r"\s*whileTap\s*=\s*{[^}]*}", "", content)
        content = re.sub(r"\s*variants\s*=\s*{[^}]*}", "", content)
        
        # Remove AnimatePresence wrapper
        content = re.sub(r"<AnimatePresence[^>]*>", "", content)
        content = re.sub(r"</AnimatePresence>", "", content)
        
        # Clean up extra whitespace
        content = re.sub(r"\n\s*\n\s*\n", "\n\n", content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Updated: {file_path}")
            return True
        else:
            print(f"⏭️  No changes: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    # Find all TypeScript and JavaScript files
    file_patterns = ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js']
    files_to_process = []
    
    for pattern in file_patterns:
        files_to_process.extend(glob.glob(pattern, recursive=True))
    
    # Filter out node_modules and other unwanted directories
    files_to_process = [f for f in files_to_process if 'node_modules' not in f and '.next' not in f]
    
    print(f"🔍 Found {len(files_to_process)} files to process")
    
    updated_count = 0
    for file_path in files_to_process:
        if remove_framer_motion_from_file(file_path):
            updated_count += 1
    
    print(f"\n🎉 Completed! Updated {updated_count} files")

if __name__ == "__main__":
    main()