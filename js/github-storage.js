// github-storage.js - MEMORY-ONLY FOR GITHUB PAGES
class GitHubPagesStorage {
    constructor() {
        console.log('🚀 GitHubPagesStorage - MEMORY MODE (GitHub Pages Compatible)');
        this.data = {}; // Memory storage only
        this.domainKey = this.getDomainKey();
        console.log('🔑 Domain key:', this.domainKey);
        this.loadFromPersistentFallback();
    }
    
    getDomainKey() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part);
        const repo = pathParts[0] || 'main';
        return `jdm_${repo.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
    
    loadFromPersistentFallback() {
        // Try to load from any persistent source on page load
        try {
            // Try window.name first
            if (window.name && window.name !== '') {
                try {
                    const savedData = JSON.parse(window.name);
                    if (savedData && savedData[this.domainKey]) {
                        this.data = { ...savedData[this.domainKey] };
                        console.log('📥 Loaded from window.name:', this.data);
                        return;
                    }
                } catch (e) {
                    // Ignore parse errors
                }
            }
            
            // Try localStorage as backup
            const localStorageData = localStorage.getItem(this.domainKey);
            if (localStorageData) {
                this.data = JSON.parse(localStorageData);
                console.log('📥 Loaded from localStorage:', this.data);
            }
        } catch (e) {
            console.log('No persistent data found, starting fresh');
        }
    }
    
    saveToPersistentFallback() {
        // Try to save to persistent storage
        try {
            // Save to window.name (most reliable on GitHub)
            const saveData = {};
            saveData[this.domainKey] = this.data;
            window.name = JSON.stringify(saveData);
        } catch (e) {
            // Ignore errors
        }
        
        try {
            // Also try localStorage
            localStorage.setItem(this.domainKey, JSON.stringify(this.data));
        } catch (e) {
            // Ignore errors
        }
    }
    
    setItem(key, value) {
        console.log(`💾 SAVING: ${key}`, value);
        this.data[key] = value;
        this.saveToPersistentFallback();
        console.log(`✅ SAVED: ${key} to MEMORY`);
        
        // Verify it was saved
        const verify = this.data[key];
        console.log(`🔍 VERIFY: ${key} =`, verify);
    }
    
    getItem(key) {
        console.log(`🔍 GETTING: ${key}`);
        const value = this.data[key] || null;
        console.log(`📖 RETRIEVED: ${key} =`, value);
        return value;
    }
    
    removeItem(key) {
        console.log(`🗑️ REMOVING: ${key}`);
        delete this.data[key];
        this.saveToPersistentFallback();
    }
    
    clear() {
        console.log('🔥 CLEARING ALL DATA');
        this.data = {};
        this.saveToPersistentFallback();
    }
    
    // Debug method to see all stored data
    debug() {
        console.log('🔍 STORAGE DEBUG:');
        console.log('All data:', this.data);
        console.log('Keys:', Object.keys(this.data));
        return this.data;
    }
}

// Create global instance
const storage = new GitHubPagesStorage();

// Make debug available globally
window.debugStorage = () => storage.debug();