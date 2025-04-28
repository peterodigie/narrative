#!/usr/bin/env python3
import os
import sys
from pathlib import Path

def try_read_with_encodings(filepath, encodings=['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']):
    """Try to read a file with different encodings and return the first successful read."""
    for encoding in encodings:
        try:
            with open(filepath, 'r', encoding=encoding) as f:
                content = f.read()
                return content, encoding
        except UnicodeDecodeError:
            continue
    return None, None

def analyze_sample_files(directory, num_samples=5):
    """Analyze a sample of files from each category to determine structure."""
    results = {}
    
    # Get all text files
    files = list(Path(directory).glob('*.txt'))
    
    # Extract categories from filenames
    categories = {}
    for file in files:
        prefix = file.stem.split('_')[0] if '_' in file.stem else file.stem
        if prefix not in categories:
            categories[prefix] = []
        categories[prefix].append(file)
    
    # Sample files from each category
    for category, category_files in categories.items():
        results[category] = []
        sample_size = min(num_samples, len(category_files))
        for file in category_files[:sample_size]:
            content, encoding = try_read_with_encodings(file)
            if content:
                # Get first few lines to understand structure
                lines = content.split('\n')[:10]
                results[category].append({
                    'file': str(file),
                    'encoding': encoding,
                    'line_count': len(content.split('\n')),
                    'sample_lines': lines
                })
            else:
                results[category].append({
                    'file': str(file),
                    'encoding': 'Failed to decode',
                    'line_count': 0,
                    'sample_lines': []
                })
    
    return results

if __name__ == "__main__":
    upload_dir = "/home/ubuntu/upload"
    results = analyze_sample_files(upload_dir)
    
    # Print summary
    print("File Analysis Summary:")
    print("=====================")
    
    for category, files in results.items():
        print(f"\nCategory: {category} ({len(files)} samples)")
        print("-" * 50)
        
        for file_info in files:
            print(f"File: {os.path.basename(file_info['file'])}")
            print(f"Encoding: {file_info['encoding']}")
            print(f"Line count: {file_info['line_count']}")
            print("Sample content:")
            for i, line in enumerate(file_info['sample_lines'][:5]):
                if line.strip():  # Only print non-empty lines
                    print(f"  {i+1}. {line[:100]}{'...' if len(line) > 100 else ''}")
            print()
