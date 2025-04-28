const fs = require('fs');
const path = require('path');

// Count files in the fromMusic_app folder
const playlistFolder = path.join(__dirname, 'fromMusic_app');
const files = fs.readdirSync(playlistFolder).filter(file => file.endsWith('.txt') && file !== '.DS_Store');

// Count songs in text files
let totalSongsInFiles = 0;
files.forEach(file => {
  const content = fs.readFileSync(path.join(playlistFolder, file), 'utf8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  totalSongsInFiles += lines.length;
});

// Parse data_new.js to extract key counts
const dataFile = fs.readFileSync('./data_new.js', 'utf8');

// Extract insights data using more reliable regex patterns
const insightsSongsMatch = dataFile.match(/total_songs:\s*(\d+)/);
const insightsPlaylistsMatch = dataFile.match(/total_playlists:\s*(\d+)/);
const insightsCategoriesMatch = dataFile.match(/total_categories:\s*(\d+)/);

let insightsSongs = insightsSongsMatch ? parseInt(insightsSongsMatch[1]) : 0;
let insightsPlaylists = insightsPlaylistsMatch ? parseInt(insightsPlaylistsMatch[1]) : 0;
let insightsCategories = insightsCategoriesMatch ? parseInt(insightsCategoriesMatch[1]) : 0;

console.log('\n--- Data Validation Report ---\n');

// Validate playlist count
console.log(`Playlists in fromMusic_app: ${files.length}`);
console.log(`Playlists reported in insights: ${insightsPlaylists}`);
console.log(`Match: ${files.length === insightsPlaylists ? 'Yes ✓' : 'No ✗'}`);

// Validate songs count
console.log(`\nSongs in fromMusic_app: ${totalSongsInFiles}`);
console.log(`Songs reported in insights: ${insightsSongs}`);
console.log(`Match: ${totalSongsInFiles === insightsSongs ? 'Yes ✓' : 'No ✗'}`);

// Validate categories
console.log(`\nCategories reported in insights: ${insightsCategories}`);
console.log(`Expected number of categories: 19`);
console.log(`Match: ${insightsCategories === 19 ? 'Yes ✓' : 'No ✗'}`);

console.log('\n--- End of Report ---\n'); 