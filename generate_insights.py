#!/usr/bin/env python3
import os
import json
import sqlite3
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from matplotlib.colors import LinearSegmentedColormap

def generate_insights_and_visualizations():
    """Generate comprehensive insights and visualizations from the music database."""
    # Paths
    data_dir = "/home/ubuntu/music_analysis"
    db_path = os.path.join(data_dir, "music_database.db")
    output_dir = os.path.join(data_dir, "analysis")
    viz_dir = os.path.join(output_dir, "visualizations")
    os.makedirs(viz_dir, exist_ok=True)
    
    # Connect to the database
    conn = sqlite3.connect(db_path)
    
    # Set plot style
    plt.style.use('seaborn-v0_8-whitegrid')
    custom_colors = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"]
    
    # 1. Category Distribution Analysis
    query = """
    SELECT c.name as category, COUNT(s.id) as song_count
    FROM songs s
    JOIN playlists p ON s.playlist_id = p.id
    JOIN categories c ON p.category_id = c.id
    GROUP BY c.name
    ORDER BY song_count DESC
    """
    category_df = pd.read_sql_query(query, conn)
    
    # Filter to top 10 categories for better visualization
    top_categories = category_df.head(10).copy()
    
    # Create pie chart for top categories
    plt.figure(figsize=(12, 8))
    plt.pie(top_categories['song_count'], labels=top_categories['category'], autopct='%1.1f%%', 
            startangle=90, colors=custom_colors, wedgeprops={'edgecolor': 'white', 'linewidth': 1})
    plt.title('Top 10 Music Categories by Song Count', fontsize=16)
    plt.axis('equal')
    plt.tight_layout()
    plt.savefig(os.path.join(viz_dir, 'top_categories_pie.png'), dpi=300, bbox_inches='tight')
    plt.close()
    
    # Create horizontal bar chart for all categories
    plt.figure(figsize=(12, 10))
    bars = plt.barh(category_df['category'], category_df['song_count'], color=sns.color_palette("viridis", len(category_df)))
    plt.title('Music Categories by Song Count', fontsize=16)
    plt.xlabel('Number of Songs', fontsize=12)
    plt.ylabel('Category', fontsize=12)
    
    # Add count labels to the bars
    for bar in bars:
        width = bar.get_width()
        plt.text(width + 5, bar.get_y() + bar.get_height()/2, f'{width:,.0f}', 
                 ha='left', va='center', fontsize=10)
    
    plt.tight_layout()
    plt.savefig(os.path.join(viz_dir, 'categories_bar.png'), dpi=300, bbox_inches='tight')
    plt.close()
    
    # 2. Playlist Length Distribution
    query = """
    SELECT p.name as playlist, c.name as category, p.song_count
    FROM playlists p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.song_count DESC
    """
    playlist_df = pd.read_sql_query(query, conn)
    
    # Create histogram of playlist lengths
    plt.figure(figsize=(12, 6))
    sns.histplot(playlist_df['song_count'], bins=30, kde=True, color='#4e79a7')
    plt.axvline(playlist_df['song_count'].mean(), color='red', linestyle='dashed', linewidth=1, 
                label=f'Mean: {playlist_df["song_count"].mean():.2f}')
    plt.axvline(playlist_df['song_count'].median(), color='green', linestyle='dashed', linewidth=1, 
                label=f'Median: {playlist_df["song_count"].median():.2f}')
    
    # Add optimal range from analysis
    with open(os.path.join(output_dir, "optimization_summary.json"), 'r') as f:
        optimization = json.load(f)
    
    optimal_min = optimization["overall_findings"]["recommended_range"].split(" - ")[0]
    optimal_max = optimization["overall_findings"]["recommended_range"].split(" - ")[1].split(" ")[0]
    
    plt.axvspan(int(optimal_min), int(optimal_max), alpha=0.2, color='green', 
                label=f'Recommended Range: {optimal_min}-{optimal_max}')
    
    plt.title('Distribution of Playlist Lengths', fontsize=16)
    plt.xlabel('Number of Songs', fontsize=12)
    plt.ylabel('Frequency', fontsize=12)
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(viz_dir, 'playlist_length_histogram.png'), dpi=300, bbox_inches='tight')
    plt.close()
    
    # 3. Category-specific playlist length analysis
    # Filter to categories with at least 5 playlists for meaningful analysis
    category_counts = playlist_df['category'].value_counts()
    major_categories = category_counts[category_counts >= 5].index.tolist()
    
    plt.figure(figsize=(14, 8))
    sns.boxplot(x='song_count', y='category', data=playlist_df[playlist_df['category'].isin(major_categories)], 
                palette="viridis", orient='h')
    
    plt.title('Playlist Length Distribution by Category', fontsize=16)
    plt.xlabel('Number of Songs', fontsize=12)
    plt.ylabel('Category', fontsize=12)
    plt.tight_layout()
    plt.savefig(os.path.join(viz_dir, 'playlist_length_by_category_boxplot.png'), dpi=300, bbox_inches='tight')
    plt.close()
    
    # 4. Artist Analysis
    query = """
    SELECT artist, COUNT(*) as song_count
    FROM songs
    WHERE artist != ''
    GROUP BY artist
    ORDER BY song_count DESC
    LIMIT 20
    """
    artist_df = pd.read_sql_query(query, conn)
    
    plt.figure(figsize=(12, 8))
    bars = plt.barh(artist_df['artist'], artist_df['song_count'], color=sns.color_palette("viridis", len(artist_df)))
    plt.title('Top 20 Artists by Song Count', fontsize=16)
    plt.xlabel('Number of Songs', fontsize=12)
    plt.ylabel('Artist', fontsize=12)
    
    # Add count labels to the bars
    for bar in bars:
        width = bar.get_width()
        plt.text(width + 0.1, bar.get_y() + bar.get_height()/2, f'{width:,.0f}', 
                 ha='left', va='center', fontsize=10)
    
    plt.tight_layout()
    plt.savefig(os.path.join(viz_dir, 'top_artists.png'), dpi=300, bbox_inches='tight')
    plt.close()
    
    # 5. Playlist Optimization Visualization
    # Create a visualization showing current vs. recommended playlist lengths
    with open(os.path.join(output_dir, "optimization_summary.json"), 'r') as f:
        opt_data = json.load(f)
    
    categories = list(opt_data["category_highlights"].keys())
    current_medians = [opt_data["category_highlights"][cat]["current_median"] for cat in categories]
    recommended_ideals = [opt_data["category_highlights"][cat]["recommended_ideal"] for cat in categories]
    
    x = np.arange(len(categories))
    width = 0.35
    
    fig, ax = plt.subplots(figsize=(12, 8))
    rects1 = ax.bar(x - width/2, current_medians, width, label='Current Median', color='#4e79a7')
    rects2 = ax.bar(x + width/2, recommended_ideals, width, label='Recommended Ideal', color='#59a14f')
    
    ax.set_title('Current vs. Recommended Playlist Lengths by Category', fontsize=16)
    ax.set_xlabel('Category', fontsize=12)
    ax.set_ylabel('Number of Songs', fontsize=12)
    ax.set_xticks(x)
    ax.set_xticklabels(categories)
    ax.legend()
    
    # Add value labels
    def autolabel(rects):
        for rect in rects:
            height = rect.get_height()
            ax.annotate(f'{height:.0f}',
                        xy=(rect.get_x() + rect.get_width() / 2, height),
                        xytext=(0, 3),
                        textcoords="offset points",
                        ha='center', va='bottom')
    
    autolabel(rects1)
    autolabel(rects2)
    
    plt.tight_layout()
    plt.savefig(os.path.join(viz_dir, 'current_vs_recommended.png'), dpi=300, bbox_inches='tight')
    plt.close()
    
    # 6. Generate comprehensive insights
    insights = {
        "collection_overview": {
            "total_songs": int(category_df['song_count'].sum()),
            "total_categories": len(category_df),
            "total_playlists": len(playlist_df),
            "top_categories": category_df.head(5)[['category', 'song_count']].to_dict('records'),
            "category_distribution": category_df[['category', 'song_count']].to_dict('records')
        },
        "playlist_analysis": {
            "length_distribution": {
                "mean": float(playlist_df['song_count'].mean()),
                "median": float(playlist_df['song_count'].median()),
                "min": int(playlist_df['song_count'].min()),
                "max": int(playlist_df['song_count'].max()),
                "std_dev": float(playlist_df['song_count'].std())
            },
            "category_specific_stats": {}
        },
        "optimization_recommendations": {
            "overall": opt_data["overall_findings"],
            "category_specific": opt_data["category_highlights"]
        },
        "artist_insights": {
            "top_artists": artist_df.head(10)[['artist', 'song_count']].to_dict('records')
        },
        "visualizations": {
            "category_distribution": [
                os.path.join(viz_dir, 'top_categories_pie.png'),
                os.path.join(viz_dir, 'categories_bar.png')
            ],
            "playlist_length_analysis": [
                os.path.join(viz_dir, 'playlist_length_histogram.png'),
                os.path.join(viz_dir, 'playlist_length_by_category_boxplot.png')
            ],
            "artist_analysis": [
                os.path.join(viz_dir, 'top_artists.png')
            ],
            "optimization_analysis": [
                os.path.join(viz_dir, 'current_vs_recommended.png')
            ]
        }
    }
    
    # Add category-specific stats
    for category in major_categories:
        cat_data = playlist_df[playlist_df['category'] == category]
        insights["playlist_analysis"]["category_specific_stats"][category] = {
            "playlist_count": len(cat_data),
            "mean_length": float(cat_data['song_count'].mean()),
            "median_length": float(cat_data['song_count'].median()),
            "min_length": int(cat_data['song_count'].min()),
            "max_length": int(cat_data['song_count'].max())
        }
    
    # Save insights
    insights_path = os.path.join(output_dir, "comprehensive_insights.json")
    with open(insights_path, 'w', encoding='utf-8') as f:
        json.dump(insights, f, indent=2)
    
    conn.close()
    
    return insights_path, viz_dir

if __name__ == "__main__":
    insights_path, viz_dir = generate_insights_and_visualizations()
    print(f"Comprehensive insights and visualizations generated.")
    print(f"Insights saved to: {insights_path}")
    print(f"Visualizations saved to: {viz_dir}")
