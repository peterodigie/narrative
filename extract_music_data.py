#!/usr/bin/env python3
import os
import re
import json
import pandas as pd
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

def extract_category_from_filename(filename):
    """Extract category from filename."""
    stem = Path(filename).stem
    
    # Handle special cases first
    if stem.startswith('instru') and '+video games' in stem:
        return 'instru_video_games'
    
    # Extract main category
    if '_' in stem:
        category = stem.split('_')[0]
    else:
        category = stem
    
    # Clean up category names
    category = category.lower()
    if category.startswith('instru'):
        category = 'instru'
    elif category.startswith('song'):
        category = 'song'
    elif category.startswith('artist'):
        category = 'artist'
    elif category.startswith('mood'):
        category = 'mood'
    elif category.startswith('spirit'):
        category = 'spirit'
    elif category.startswith('strack'):
        category = 'soundtrack'
    elif category.startswith('anime'):
        category = 'anime'
    elif category.startswith('fscore') or category.startswith('fscore'):
        category = 'film_score'
    elif category.startswith('esp'):
        category = 'spanish'
    elif category.startswith('friend'):
        category = 'friend'
    elif category.startswith('oscar'):
        category = 'oscar'
    elif category.startswith('evocative'):
        category = 'evocative'
    elif category.startswith('naija'):
        category = 'naija'
    elif category.startswith('xment'):
        category = 'experiment'
    
    return category

def parse_song_line(line):
    """Parse a song line into artist and title."""
    line = line.strip()
    if not line:
        return None
    
    # Common patterns:
    # 1. "Title - Artist"
    # 2. "Artist - Title"
    # 3. "Title (feat. Someone) - Artist"
    # 4. "Title - Artist/Collaborator"
    
    # Try to split by " - "
    if " - " in line:
        parts = line.split(" - ", 1)
        first_part = parts[0].strip()
        second_part = parts[1].strip() if len(parts) > 1 else ""
        
        # Check if there's a track number at the beginning
        track_num = None
        track_match = re.match(r'^(\d+)[\s\.\-]+(.+)$', first_part)
        if track_match:
            track_num = track_match.group(1)
            first_part = track_match.group(2).strip()
        
        # Determine which part is the artist and which is the title
        # This is a heuristic and may not always be correct
        if "feat." in first_part or "(" in first_part or "[" in first_part:
            # If first part has features or parentheses, it's likely the title
            title = first_part
            artist = second_part
        elif not second_part or second_part == "":
            # If second part is empty, first part is likely the title
            title = first_part
            artist = ""
        else:
            # Default assumption: first part is title, second part is artist
            # This is a simplification and may need refinement
            title = first_part
            artist = second_part
        
        return {
            "track_num": track_num,
            "title": title,
            "artist": artist,
            "original_text": line
        }
    
    # If no " - " separator, treat the whole line as the title
    return {
        "track_num": None,
        "title": line,
        "artist": "",
        "original_text": line
    }

def extract_playlist_name(filename):
    """Extract a human-readable playlist name from the filename."""
    stem = Path(filename).stem
    
    # Remove category prefix if present
    if '_' in stem:
        parts = stem.split('_', 1)
        name = parts[1] if len(parts) > 1 else stem
    else:
        name = stem
    
    # Clean up the name
    name = name.replace('-', ' ').replace('_', ' ')
    name = re.sub(r'\s+', ' ', name).strip()
    name = name.title()
    
    return name

def extract_music_data(directory):
    """Extract music data from all files in the directory."""
    all_data = []
    files = list(Path(directory).glob('*.txt'))
    
    for file_path in files:
        content, encoding = try_read_with_encodings(file_path)
        if not content:
            print(f"Failed to read {file_path}")
            continue
        
        category = extract_category_from_filename(file_path)
        playlist_name = extract_playlist_name(file_path)
        
        songs = []
        for line in content.split('\n'):
            parsed = parse_song_line(line)
            if parsed:
                parsed["category"] = category
                parsed["playlist"] = playlist_name
                parsed["source_file"] = str(file_path)
                songs.append(parsed)
        
        all_data.extend(songs)
    
    return all_data

if __name__ == "__main__":
    upload_dir = "/home/ubuntu/upload"
    output_dir = "/home/ubuntu/music_analysis"
    
    print("Extracting music data from files...")
    music_data = extract_music_data(upload_dir)
    
    # Save as JSON
    json_path = os.path.join(output_dir, "music_data.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(music_data, f, indent=2, ensure_ascii=False)
    
    # Save as CSV
    csv_path = os.path.join(output_dir, "music_data.csv")
    df = pd.DataFrame(music_data)
    df.to_csv(csv_path, index=False, encoding='utf-8')
    
    print(f"Extracted {len(music_data)} songs from {len(set(item['source_file'] for item in music_data))} files")
    print(f"Data saved to {json_path} and {csv_path}")
    
    # Generate summary statistics
    categories = df['category'].value_counts()
    playlists = df['playlist'].value_counts()
    
    # Save summary statistics
    summary = {
        "total_songs": len(df),
        "total_playlists": len(playlists),
        "songs_per_category": categories.to_dict(),
        "playlist_counts": {
            "min_songs": int(playlists.min()),
            "max_songs": int(playlists.max()),
            "avg_songs": float(playlists.mean()),
            "median_songs": float(playlists.median())
        }
    }
    
    summary_path = os.path.join(output_dir, "summary_statistics.json")
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)
    
    print(f"Summary statistics saved to {summary_path}")
