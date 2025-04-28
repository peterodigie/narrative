#!/usr/bin/env python3
import os
import json
import sqlite3
import pandas as pd
from pathlib import Path

def create_music_database():
    """Create a SQLite database from the extracted music data."""
    # Paths
    data_dir = "/home/ubuntu/music_analysis"
    db_path = os.path.join(data_dir, "music_database.db")
    json_path = os.path.join(data_dir, "music_data.json")
    
    # Load the extracted data
    with open(json_path, 'r', encoding='utf-8') as f:
        music_data = json.load(f)
    
    # Create a connection to the SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS playlists (
        id INTEGER PRIMARY KEY,
        name TEXT,
        category_id INTEGER,
        source_file TEXT,
        song_count INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories (id)
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS songs (
        id INTEGER PRIMARY KEY,
        track_num TEXT,
        title TEXT,
        artist TEXT,
        original_text TEXT,
        playlist_id INTEGER,
        FOREIGN KEY (playlist_id) REFERENCES playlists (id)
    )
    ''')
    
    # Extract unique categories and playlists
    categories = set()
    playlists = {}  # {(name, category, source_file): [song_count]}
    
    for item in music_data:
        category = item['category']
        playlist = item['playlist']
        source_file = item['source_file']
        
        categories.add(category)
        
        playlist_key = (playlist, category, source_file)
        if playlist_key not in playlists:
            playlists[playlist_key] = 0
        playlists[playlist_key] += 1
    
    # Insert categories
    for category in categories:
        cursor.execute("INSERT OR IGNORE INTO categories (name) VALUES (?)", (category,))
    
    # Get category IDs
    cursor.execute("SELECT id, name FROM categories")
    category_ids = {name: id for id, name in cursor.fetchall()}
    
    # Insert playlists
    for (playlist_name, category, source_file), song_count in playlists.items():
        category_id = category_ids.get(category)
        cursor.execute(
            "INSERT INTO playlists (name, category_id, source_file, song_count) VALUES (?, ?, ?, ?)",
            (playlist_name, category_id, source_file, song_count)
        )
    
    # Get playlist IDs
    cursor.execute("SELECT id, name, source_file FROM playlists")
    playlist_ids = {(name, source_file): id for id, name, source_file in cursor.fetchall()}
    
    # Insert songs
    for item in music_data:
        playlist_id = playlist_ids.get((item['playlist'], item['source_file']))
        cursor.execute(
            "INSERT INTO songs (track_num, title, artist, original_text, playlist_id) VALUES (?, ?, ?, ?, ?)",
            (item['track_num'], item['title'], item['artist'], item['original_text'], playlist_id)
        )
    
    # Create indexes for faster queries
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_songs_playlist_id ON songs (playlist_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_playlists_category_id ON playlists (category_id)")
    
    # Commit changes and close connection
    conn.commit()
    
    # Generate database statistics
    cursor.execute("SELECT COUNT(*) FROM categories")
    category_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM playlists")
    playlist_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM songs")
    song_count = cursor.fetchone()[0]
    
    cursor.execute("""
    SELECT c.name, COUNT(p.id) as playlist_count, SUM(p.song_count) as song_count
    FROM categories c
    JOIN playlists p ON c.id = p.category_id
    GROUP BY c.name
    ORDER BY song_count DESC
    """)
    category_stats = cursor.fetchall()
    
    cursor.execute("""
    SELECT AVG(song_count) as avg_songs, MIN(song_count) as min_songs, 
           MAX(song_count) as max_songs, COUNT(*) as count
    FROM playlists
    """)
    playlist_stats = cursor.fetchone()
    
    # Calculate median playlist length
    cursor.execute("SELECT song_count FROM playlists ORDER BY song_count")
    playlist_lengths = cursor.fetchall()
    playlist_lengths = [p[0] for p in playlist_lengths]
    n = len(playlist_lengths)
    if n % 2 == 0:
        median_length = (playlist_lengths[n//2-1] + playlist_lengths[n//2]) / 2
    else:
        median_length = playlist_lengths[n//2]
    
    conn.close()
    
    # Save database statistics
    db_stats = {
        "database_path": db_path,
        "total_categories": category_count,
        "total_playlists": playlist_count,
        "total_songs": song_count,
        "category_statistics": [
            {"category": cat, "playlist_count": p_count, "song_count": s_count}
            for cat, p_count, s_count in category_stats
        ],
        "playlist_statistics": {
            "average_length": float(playlist_stats[0]),
            "min_length": playlist_stats[1],
            "max_length": playlist_stats[2],
            "median_length": float(median_length),
            "count": playlist_stats[3]
        }
    }
    
    stats_path = os.path.join(data_dir, "database_statistics.json")
    with open(stats_path, 'w', encoding='utf-8') as f:
        json.dump(db_stats, f, indent=2)
    
    return db_path, stats_path

if __name__ == "__main__":
    db_path, stats_path = create_music_database()
    print(f"Music database created at: {db_path}")
    print(f"Database statistics saved to: {stats_path}")
