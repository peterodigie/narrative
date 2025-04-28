#!/usr/bin/env python3
import os
import json
import pandas as pd
from pathlib import Path
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

def create_pdf_report():
    """Create a comprehensive PDF report of the music collection analysis."""
    # Paths
    data_dir = "/home/ubuntu/music_analysis"
    output_dir = os.path.join(data_dir, "reports")
    viz_dir = os.path.join(data_dir, "analysis/visualizations")
    os.makedirs(output_dir, exist_ok=True)
    
    # Load insights data
    with open(os.path.join(data_dir, "analysis/comprehensive_insights.json"), 'r') as f:
        insights = json.load(f)
    
    # Load optimization data
    with open(os.path.join(data_dir, "analysis/optimization_summary.json"), 'r') as f:
        optimization = json.load(f)
    
    # Create HTML content for the report
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Music Collection Analysis Report</title>
        <style>
            @page {{
                size: letter;
                margin: 2cm;
            }}
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.5;
                color: #333;
            }}
            h1 {{
                color: #2c3e50;
                font-size: 24pt;
                text-align: center;
                margin-bottom: 20px;
            }}
            h2 {{
                color: #3498db;
                font-size: 18pt;
                margin-top: 30px;
                margin-bottom: 15px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
            }}
            h3 {{
                color: #2980b9;
                font-size: 14pt;
                margin-top: 20px;
                margin-bottom: 10px;
            }}
            p {{
                margin-bottom: 10px;
            }}
            .image-container {{
                text-align: center;
                margin: 20px 0;
            }}
            .image-container img {{
                max-width: 100%;
                height: auto;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }}
            th, td {{
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }}
            th {{
                background-color: #f2f2f2;
            }}
            tr:nth-child(even) {{
                background-color: #f9f9f9;
            }}
            .highlight {{
                background-color: #e8f4f8;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                font-size: 10pt;
                color: #7f8c8d;
            }}
            .page-break {{
                page-break-before: always;
            }}
        </style>
    </head>
    <body>
        <h1>Music Collection Analysis Report</h1>
        
        <div class="highlight">
            <h3>Executive Summary</h3>
            <p>This report provides a comprehensive analysis of your music collection, consisting of {insights['collection_overview']['total_songs']} songs across {insights['collection_overview']['total_playlists']} playlists in {insights['collection_overview']['total_categories']} categories. The analysis includes insights on playlist optimization, category distribution, and recommendations for ideal playlist lengths.</p>
        </div>
        
        <h2>1. Collection Overview</h2>
        
        <p>Your music collection is diverse and extensive, with a strong focus on instrumental music, artist-specific playlists, and general song collections. The following visualizations provide an overview of your collection's composition.</p>
        
        <div class="image-container">
            <img src="{viz_dir}/top_categories_pie.png" alt="Top Music Categories">
            <p><em>Figure 1: Distribution of songs across top music categories</em></p>
        </div>
        
        <h3>Top Categories</h3>
        <table>
            <tr>
                <th>Category</th>
                <th>Number of Songs</th>
                <th>Percentage</th>
            </tr>
    """
    
    # Add top categories to the table
    total_songs = insights['collection_overview']['total_songs']
    for category in insights['collection_overview']['top_categories']:
        percentage = (category['song_count'] / total_songs) * 100
        html_content += f"""
            <tr>
                <td>{category['category']}</td>
                <td>{category['song_count']}</td>
                <td>{percentage:.1f}%</td>
            </tr>
        """
    
    html_content += """
        </table>
        
        <div class="page-break"></div>
        <h2>2. Playlist Length Analysis</h2>
        
        <p>Understanding the distribution of playlist lengths in your collection provides insights into your listening preferences and helps identify opportunities for optimization.</p>
        
        <div class="image-container">
            <img src="{0}/playlist_length_histogram.png" alt="Playlist Length Distribution">
            <p><em>Figure 2: Distribution of playlist lengths across your collection</em></p>
        </div>
        
        <h3>Current Playlist Statistics</h3>
        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Average Playlist Length</td>
                <td>{1:.1f} songs</td>
            </tr>
            <tr>
                <td>Median Playlist Length</td>
                <td>{2:.1f} songs</td>
            </tr>
            <tr>
                <td>Minimum Playlist Length</td>
                <td>{3} songs</td>
            </tr>
            <tr>
                <td>Maximum Playlist Length</td>
                <td>{4} songs</td>
            </tr>
        </table>
        
        <div class="image-container">
            <img src="{0}/playlist_length_by_category_boxplot.png" alt="Playlist Length by Category">
            <p><em>Figure 3: Playlist length distribution by category</em></p>
        </div>
        
        <div class="page-break"></div>
        <h2>3. Playlist Optimization Recommendations</h2>
        
        <p>Based on analysis of your current playlist patterns and research on listener preferences, we've developed recommendations for optimal playlist lengths.</p>
        
        <div class="highlight">
            <h3>Overall Recommendation</h3>
            <p>For your collection as a whole, we recommend an ideal playlist length of <strong>{5} songs</strong>, with an acceptable range of <strong>{6}</strong>.</p>
        </div>
        
        <div class="image-container">
            <img src="{0}/current_vs_recommended.png" alt="Current vs Recommended Lengths">
            <p><em>Figure 4: Current vs. recommended playlist lengths by category</em></p>
        </div>
        
        <h3>Category-Specific Recommendations</h3>
        <table>
            <tr>
                <th>Category</th>
                <th>Current Median</th>
                <th>Recommended Ideal</th>
                <th>Recommended Range</th>
            </tr>
    """.format(
        viz_dir,
        insights['playlist_analysis']['length_distribution']['mean'],
        insights['playlist_analysis']['length_distribution']['median'],
        insights['playlist_analysis']['length_distribution']['min'],
        insights['playlist_analysis']['length_distribution']['max'],
        optimization['overall_findings']['recommended_ideal_length'],
        optimization['overall_findings']['recommended_range']
    )
    
    # Add category-specific recommendations
    for category, data in optimization['category_highlights'].items():
        html_content += f"""
            <tr>
                <td>{category}</td>
                <td>{data['current_median']:.1f} songs</td>
                <td>{data['recommended_ideal']} songs</td>
                <td>{data['recommended_range']}</td>
            </tr>
        """
    
    html_content += """
        </table>
        
        <div class="page-break"></div>
        <h2>4. Artist Analysis</h2>
        
        <p>Understanding the most prominent artists in your collection provides insights into your musical preferences.</p>
        
        <div class="image-container">
            <img src="{0}/top_artists.png" alt="Top Artists">
            <p><em>Figure 5: Top artists by song count in your collection</em></p>
        </div>
        
        <h3>Top 10 Artists</h3>
        <table>
            <tr>
                <th>Artist</th>
                <th>Number of Songs</th>
            </tr>
    """.format(viz_dir)
    
    # Add top artists
    for artist in insights['artist_insights']['top_artists']:
        html_content += f"""
            <tr>
                <td>{artist['artist']}</td>
                <td>{artist['song_count']}</td>
            </tr>
        """
    
    html_content += """
        </table>
        
        <h2>5. Conclusion and Next Steps</h2>
        
        <p>This analysis provides a comprehensive overview of your music collection and offers recommendations for optimizing your playlists. The key findings include:</p>
        
        <ul>
            <li>Your collection is diverse, with a strong focus on instrumental music (25.3%) and artist-specific playlists (20.2%).</li>
            <li>Your current median playlist length is 13 songs, which is close to the recommended ideal of 15 songs.</li>
            <li>Different categories benefit from different playlist lengths, with artist playlists typically being longer than mood-based or friend-related playlists.</li>
        </ul>
        
        <p>To implement these recommendations, consider:</p>
        
        <ul>
            <li>Reviewing playlists that fall outside the recommended ranges for their categories</li>
            <li>Consolidating very short playlists or splitting very long ones</li>
            <li>Using the accompanying playlist management website to help organize and optimize your collection</li>
        </ul>
        
        <div class="footer">
            <p>Generated on April 25, 2025 | Music Collection Analysis Project</p>
        </div>
    </body>
    </html>
    """
    
    # Generate PDF
    font_config = FontConfiguration()
    html = HTML(string=html_content)
    css = CSS(string="""
        @page {
            size: letter;
            margin: 2cm;
        }
    """, font_config=font_config)
    
    pdf_path = os.path.join(output_dir, "Music_Collection_Analysis_Report.pdf")
    html.write_pdf(pdf_path, stylesheets=[css], font_config=font_config)
    
    # Create a summary report with just the key findings
    summary_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Music Collection Analysis - Summary Report</title>
        <style>
            @page {{
                size: letter;
                margin: 2cm;
            }}
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.5;
                color: #333;
            }}
            h1 {{
                color: #2c3e50;
                font-size: 24pt;
                text-align: center;
                margin-bottom: 20px;
            }}
            h2 {{
                color: #3498db;
                font-size: 18pt;
                margin-top: 30px;
                margin-bottom: 15px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
            }}
            .highlight {{
                background-color: #e8f4f8;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }}
            th, td {{
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }}
            th {{
                background-color: #f2f2f2;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                font-size: 10pt;
                color: #7f8c8d;
            }}
        </style>
    </head>
    <body>
        <h1>Music Collection Analysis - Summary Report</h1>
        
        <div class="highlight">
            <h2>Key Findings</h2>
            <p>Your music collection contains {insights['collection_overview']['total_songs']} songs across {insights['collection_overview']['total_playlists']} playlists in {insights['collection_overview']['total_categories']} categories.</p>
            <p>The recommended ideal playlist length is <strong>{optimization['overall_findings']['recommended_ideal_length']} songs</strong>, with an acceptable range of <strong>{optimization['overall_findings']['recommended_range']}</strong>.</p>
        </div>
        
        <h2>Top Categories</h2>
        <table>
            <tr>
                <th>Category</th>
                <th>Number of Songs</th>
                <th>Percentage</th>
            </tr>
    """
    
    # Add top 5 categories to the summary
    for category in insights['collection_overview']['top_categories'][:5]:
        percentage = (category['song_count'] / total_songs) * 100
        summary_html += f"""
            <tr>
                <td>{category['category']}</td>
                <td>{category['song_count']}</td>
                <td>{percentage:.1f}%</td>
            </tr>
        """
    
    summary_html += """
        </table>
        
        <h2>Category-Specific Recommendations</h2>
        <table>
            <tr>
                <th>Category</th>
                <th>Current Median</th>
                <th>Recommended Ideal</th>
                <th>Recommended Range</th>
            </tr>
    """
    
    # Add top 5 category recommendations
    for i, (category, data) in enumerate(optimization['category_highlights'].items()):
        if i >= 5:
            break
        summary_html += f"""
            <tr>
                <td>{category}</td>
                <td>{data['current_median']:.1f} songs</td>
                <td>{data['recommended_ideal']} songs</td>
                <td>{data['recommended_range']}</td>
            </tr>
        """
    
    summary_html += """
        </table>
        
        <div class="footer">
            <p>Generated on April 25, 2025 | Music Collection Analysis Project</p>
        </div>
    </body>
    </html>
    """
    
    # Generate summary PDF
    summary_html_obj = HTML(string=summary_html)
    summary_pdf_path = os.path.join(output_dir, "Music_Collection_Analysis_Summary.pdf")
    summary_html_obj.write_pdf(summary_pdf_path, stylesheets=[css], font_config=font_config)
    
    return pdf_path, summary_pdf_path

if __name__ == "__main__":
    full_report, summary_report = create_pdf_report()
    print(f"Full PDF report created: {full_report}")
    print(f"Summary PDF report created: {summary_report}")
