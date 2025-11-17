// github-storage.js - MINIMAL WORKING VERSION
class GitHubPagesStorage {
    constructor() {
        console.log('🧠 SIMPLE STORAGE: Memory-only mode for GitHub Pages');
        this.data = {}; // Pure JavaScript object - CANNOT fail
        
        // Try to load any existing data
        this.loadExistingData();
    }
    
    loadExistingData() {
        // Try to load from localStorage if available
        try {
            const saved = localStorage.getItem('jdm_storage');
            if (saved) {
                this.data = JSON.parse(saved);
                console.log('📥 Loaded existing data:', Object.keys(this.data));
            }
        } catch (e) {
            console.log('No existing data found, starting fresh');
        }
    }
    
    saveToPersistent() {
        // Try to save to localStorage for persistence
        try {
            localStorage.setItem('jdm_storage', JSON.stringify(this.data));
        } catch (e) {
            // Ignore - memory storage always works
        }
    }
    
    setItem(key, value) {
        console.log('💾 SAVE:', key, value);
        this.data[key] = value;
        this.saveToPersistent(); // Try to persist
        console.log('✅ SAVED:', key);
        return true; // Always succeeds
    }
    
    getItem(key) {
        const value = this.data[key] || null;
        console.log('📖 GET:', key, '=', value);
        return value;
    }
    
    removeItem(key) {
        console.log('🗑️ REMOVE:', key);
        delete this.data[key];
        this.saveToPersistent();
    }
    
    clear() {
        console.log('🔥 CLEAR ALL');
        this.data = {};
        this.saveToPersistent();
    }
}

// Create global instance - THIS WILL ALWAYS WORK
const storage = new GitHubPagesStorage();
console.log('✅ STORAGE READY - Memory storage guaranteed to work');