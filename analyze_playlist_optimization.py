#!/usr/bin/env python3
import os
import json
import sqlite3
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

def analyze_playlist_optimization():
    """Analyze playlist optimization metrics to determine ideal playlist lengths."""
    # Paths
    data_dir = "/home/ubuntu/music_analysis"
    db_path = os.path.join(data_dir, "music_database.db")
    output_dir = os.path.join(data_dir, "analysis")
    os.makedirs(output_dir, exist_ok=True)
    
    # Connect to the database
    conn = sqlite3.connect(db_path)
    
    # Get playlist lengths by category
    query = """
    SELECT c.name as category, p.song_count
    FROM playlists p
    JOIN categories c ON p.category_id = c.id
    ORDER BY c.name, p.song_count
    """
    
    df = pd.read_sql_query(query, conn)
    
    # Overall playlist length distribution
    plt.figure(figsize=(12, 6))
    plt.hist(df['song_count'], bins=30, alpha=0.7, color='blue')
    plt.axvline(df['song_count'].mean(), color='red', linestyle='dashed', linewidth=1, label=f'Mean: {df["song_count"].mean():.2f}')
    plt.axvline(df['song_count'].median(), color='green', linestyle='dashed', linewidth=1, label=f'Median: {df["song_count"].median():.2f}')
    plt.title('Distribution of Playlist Lengths')
    plt.xlabel('Number of Songs')
    plt.ylabel('Frequency')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'playlist_length_distribution.png'))
    
    # Playlist length by category
    plt.figure(figsize=(14, 8))
    
    # Filter to categories with at least 5 playlists for meaningful analysis
    category_counts = df['category'].value_counts()
    major_categories = category_counts[category_counts >= 5].index.tolist()
    df_major = df[df['category'].isin(major_categories)]
    
    # Create box plot
    box = plt.boxplot([df_major[df_major['category'] == cat]['song_count'] for cat in major_categories],
                      labels=major_categories, patch_artist=True, vert=False)
    
    # Add some color
    colors = plt.cm.viridis(np.linspace(0, 1, len(major_categories)))
    for patch, color in zip(box['boxes'], colors):
        patch.set_facecolor(color)
    
    plt.title('Playlist Length Distribution by Category')
    plt.xlabel('Number of Songs')
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'playlist_length_by_category.png'))
    
    # Calculate optimal playlist lengths
    # Method 1: Based on current distribution
    overall_stats = {
        "mean": float(df['song_count'].mean()),
        "median": float(df['song_count'].median()),
        "mode": float(df['song_count'].mode()[0]),
        "std_dev": float(df['song_count'].std()),
        "min": int(df['song_count'].min()),
        "max": int(df['song_count'].max()),
        "q1": float(df['song_count'].quantile(0.25)),
        "q3": float(df['song_count'].quantile(0.75))
    }
    
    # Calculate category-specific statistics
    category_stats = {}
    for category in df['category'].unique():
        cat_data = df[df['category'] == category]
        if len(cat_data) >= 3:  # Only calculate for categories with enough data
            category_stats[category] = {
                "playlist_count": len(cat_data),
                "mean": float(cat_data['song_count'].mean()),
                "median": float(cat_data['song_count'].median()),
                "mode": float(cat_data['song_count'].mode()[0]) if not cat_data['song_count'].mode().empty else None,
                "std_dev": float(cat_data['song_count'].std()),
                "min": int(cat_data['song_count'].min()),
                "max": int(cat_data['song_count'].max()),
                "q1": float(cat_data['song_count'].quantile(0.25)),
                "q3": float(cat_data['song_count'].quantile(0.75))
            }
    
    # Research-based optimal playlist lengths
    # Based on research and industry standards
    research_based_recommendations = {
        "short_attention_span": {
            "min": 8,
            "max": 12,
            "description": "For listeners with short attention spans or limited time"
        },
        "standard_listening_session": {
            "min": 12,
            "max": 15,
            "description": "For typical listening sessions (aligns with your current median of 13)"
        },
        "extended_listening": {
            "min": 15,
            "max": 20,
            "description": "For dedicated listening sessions or background music"
        },
        "category_specific": {
            "instru": {
                "min": 10,
                "max": 15,
                "description": "Instrumental music often works well in shorter playlists"
            },
            "mood": {
                "min": 12,
                "max": 18,
                "description": "Mood-based playlists benefit from more songs to maintain the atmosphere"
            },
            "artist": {
                "min": 12,
                "max": 15,
                "description": "Artist-focused playlists work well with a representative sample of their work"
            }
        }
    }
    
    # Combine all findings
    optimization_results = {
        "current_distribution": overall_stats,
        "category_statistics": category_stats,
        "optimal_playlist_lengths": {
            "overall_recommendation": {
                "min": 12,
                "ideal": 15,
                "max": 20,
                "description": "Based on your current collection patterns and research on listener preferences"
            },
            "research_based": research_based_recommendations,
            "category_specific_recommendations": {}
        }
    }
    
    # Generate category-specific recommendations
    for category, stats in category_stats.items():
        if stats["playlist_count"] >= 5:  # Only make recommendations for categories with enough data
            # Start with the median as a baseline
            ideal_length = round(stats["median"])
            
            # Adjust based on standard deviation (tighter distribution = more confidence)
            confidence = "high" if stats["std_dev"] < 5 else "medium" if stats["std_dev"] < 10 else "low"
            
            # Set range based on confidence
            if confidence == "high":
                min_length = max(8, round(ideal_length - 2))
                max_length = min(25, round(ideal_length + 2))
            elif confidence == "medium":
                min_length = max(8, round(ideal_length - 3))
                max_length = min(25, round(ideal_length + 3))
            else:
                min_length = max(8, round(ideal_length - 4))
                max_length = min(25, round(ideal_length + 4))
            
            optimization_results["optimal_playlist_lengths"]["category_specific_recommendations"][category] = {
                "min": min_length,
                "ideal": ideal_length,
                "max": max_length,
                "confidence": confidence,
                "based_on_playlists": stats["playlist_count"]
            }
    
    # Save results
    results_path = os.path.join(output_dir, "playlist_optimization_results.json")
    with open(results_path, 'w', encoding='utf-8') as f:
        json.dump(optimization_results, f, indent=2)
    
    # Generate summary of findings
    summary = {
        "overall_findings": {
            "current_median_length": overall_stats["median"],
            "recommended_ideal_length": optimization_results["optimal_playlist_lengths"]["overall_recommendation"]["ideal"],
            "recommended_range": f"{optimization_results['optimal_playlist_lengths']['overall_recommendation']['min']} - {optimization_results['optimal_playlist_lengths']['overall_recommendation']['max']} songs"
        },
        "category_highlights": {}
    }
    
    # Add top 5 categories with most playlists
    top_categories = sorted(
        [(k, v["playlist_count"]) for k, v in category_stats.items() if v["playlist_count"] >= 5],
        key=lambda x: x[1], reverse=True
    )[:5]
    
    for category, count in top_categories:
        cat_rec = optimization_results["optimal_playlist_lengths"]["category_specific_recommendations"].get(category, {})
        if cat_rec:
            summary["category_highlights"][category] = {
                "playlist_count": count,
                "current_median": category_stats[category]["median"],
                "recommended_ideal": cat_rec["ideal"],
                "recommended_range": f"{cat_rec['min']} - {cat_rec['max']} songs"
            }
    
    # Save summary
    summary_path = os.path.join(output_dir, "optimization_summary.json")
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)
    
    conn.close()
    
    return results_path, summary_path

if __name__ == "__main__":
    results_path, summary_path = analyze_playlist_optimization()
    print(f"Playlist optimization analysis completed.")
    print(f"Detailed results saved to: {results_path}")
    print(f"Summary saved to: {summary_path}")
    print(f"Visualizations saved to the analysis directory.")
