// json-storage.js - JSON-based storage for GitHub Pages - FIXED VERSION

// Ensure storage is available globally immediately
if (typeof window.storage === 'undefined') {
    console.log('📁 Initializing JSON Storage System...');
    
    class JSONStorage {
        constructor() {
            console.log('📁 JSON Storage System Ready');
            // Initialize storage data
            if (!window.jsonStorageData) {
                window.jsonStorageData = {};
                console.log('🆕 JSON Storage initialized');
            }
            
            // Load any existing data from localStorage backup
            this.loadFromLocalStorage();
        }

        loadFromLocalStorage() {
            try {
                const keys = Object.keys(localStorage).filter(key => key.startsWith('json_'));
                keys.forEach(key => {
                    try {
                        const originalKey = key.replace('json_', '');
                        const value = JSON.parse(localStorage.getItem(key));
                        window.jsonStorageData[originalKey] = value;
                    } catch (e) {
                        console.log('Failed to load from localStorage:', key);
                    }
                });
                console.log('📥 Loaded from localStorage backup:', keys.length, 'items');
            } catch (e) {
                console.log('📦 LocalStorage backup unavailable');
            }
        }

        setItem(key, value) {
            console.log(`💾 JSON SAVE: ${key}`, value);
            
            // Store in memory
            window.jsonStorageData[key] = value;
            
            // Backup to localStorage
            try {
                localStorage.setItem(`json_${key}`, JSON.stringify(value));
            } catch (e) {
                console.log('📦 LocalStorage backup failed');
            }
            
            return true;
        }

        getItem(key) {
            console.log(`🔍 JSON GET: ${key}`);
            
            const value = window.jsonStorageData[key] !== undefined ? window.jsonStorageData[key] : null;
            console.log(`📖 ${key} =`, value);
            return value;
        }

        removeItem(key) {
            console.log(`🗑️ JSON REMOVE: ${key}`);
            delete window.jsonStorageData[key];
            try {
                localStorage.removeItem(`json_${key}`);
            } catch (e) {}
        }

        clear() {
            console.log('🔥 JSON CLEAR ALL');
            window.jsonStorageData = {};
            try {
                const keys = Object.keys(localStorage).filter(key => key.startsWith('json_'));
                keys.forEach(key => localStorage.removeItem(key));
            } catch (e) {}
        }

        // Export data as JSON file
        exportData() {
            const data = window.jsonStorageData;
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jdm-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            console.log('📤 Data exported');
        }

        // Debug method
        debug() {
            console.log('🔍 JSON STORAGE DEBUG:');
            console.log('All Data:', window.jsonStorageData);
            console.log('Keys:', Object.keys(window.jsonStorageData));
            return window.jsonStorageData;
        }
    }

    // Create global instance
    window.storage = new JSONStorage();
} else {
    console.log('📁 JSON Storage already initialized');
}

// Create global instance (backward compatibility)
const storage = window.storage;

// Make debug tools available globally
window.debugStorage = () => storage.debug();
window.exportData = () => storage.exportData();

console.log('🚀 JSON Storage System Fully Loaded');