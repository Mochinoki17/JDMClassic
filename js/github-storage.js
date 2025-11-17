// github-storage.js - FIXED FOR GITHUB PAGES
class GitHubPagesStorage {
    constructor() {
        console.log('🚀 GitHubPagesStorage initialized - FIXED VERSION');
        this.storageLayers = [
            this.tryWindowName.bind(this),    // Primary - works on GitHub
            this.tryLocalStorage.bind(this),  // Fallback
            this.trySessionStorage.bind(this), // Fallback
            this.tryURLStorage.bind(this)     // Last resort for carts
        ];
        
        this.domainKey = this.getDomainKey();
        console.log('🔑 Domain key:', this.domainKey);
        this.fallbackStorage = {}; // Memory fallback
        this.loadURLData();
    }
    
    getDomainKey() {
        // Handle GitHub Pages URL structure
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part);
        const repo = pathParts[0] || 'main';
        console.log('📁 Repo detected:', repo);
        return `jdm_${repo.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
    
    tryLocalStorage(key, value) {
        try {
            const fullKey = `${this.domainKey}_${key}`;
            if (value === null) {
                localStorage.removeItem(fullKey);
                console.log(`🗑️ LocalStorage: Removed ${fullKey}`);
                return true;
            } else {
                localStorage.setItem(fullKey, JSON.stringify(value));
                console.log(`💾 LocalStorage: Saved ${fullKey}`, value);
                return true;
            }
        } catch (e) {
            console.warn('❌ LocalStorage failed:', e.message);
            return false;
        }
    }
    
    trySessionStorage(key, value) {
        try {
            const fullKey = `${this.domainKey}_${key}`;
            if (value === null) {
                sessionStorage.removeItem(fullKey);
                console.log(`🗑️ SessionStorage: Removed ${fullKey}`);
                return true;
            } else {
                sessionStorage.setItem(fullKey, JSON.stringify(value));
                console.log(`💾 SessionStorage: Saved ${fullKey}`, value);
                return true;
            }
        } catch (e) {
            console.warn('❌ SessionStorage failed:', e.message);
            return false;
        }
    }
    
    tryWindowName(key, value) {
        try {
            let data = {};
            if (window.name && window.name !== '') {
                try {
                    data = JSON.parse(window.name);
                    console.log('📖 Window.name data loaded:', data);
                } catch (parseError) {
                    console.warn('Window.name contains non-JSON data, starting fresh');
                    data = {};
                }
            }
            
            const fullKey = `${this.domainKey}_${key}`;
            
            if (value === null) {
                delete data[fullKey];
                console.log(`🗑️ Window.name: Removed ${fullKey}`);
            } else {
                data[fullKey] = value;
                console.log(`💾 Window.name: Saved ${fullKey}`, value);
            }
            
            window.name = JSON.stringify(data);
            return true;
        } catch (e) {
            console.warn('❌ Window.name storage failed:', e.message);
            return false;
        }
    }
    
    tryURLStorage(key, value) {
        // Only for cart data (small items)
        if (key === 'jdmCart' && value && Array.isArray(value)) {
            try {
                const compressed = btoa(JSON.stringify(value));
                if (compressed.length < 1500) {
                    const newUrl = `${window.location.pathname}#cart=${compressed}`;
                    window.history.replaceState(null, '', newUrl);
                    console.log('🔗 URL Storage: Cart saved to URL');
                    return true;
                }
            } catch (e) {
                console.warn('❌ URL storage failed:', e);
            }
        }
        return false;
    }
    
    loadURLData() {
        // Load cart from URL if present
        const hash = window.location.hash;
        const match = hash.match(/cart=([^&]+)/);
        if (match) {
            try {
                const cartData = JSON.parse(atob(match[1]));
                console.log('📥 Loaded cart from URL:', cartData);
                this.setItem('jdmCart', cartData);
            } catch (e) {
                console.warn('Failed to parse URL cart data');
            }
        }
    }
    
    setItem(key, value) {
        console.log(`💽 STORAGE SET: ${key}`, value);
        
        let saved = false;
        
        // Try all storage layers
        for (const layer of this.storageLayers) {
            if (layer(key, value)) {
                console.log(`✅ ${key} saved via ${layer.name}`);
                saved = true;
                break;
            }
        }
        
        // Memory fallback
        if (!saved) {
            const fullKey = `${this.domainKey}_${key}`;
            this.fallbackStorage[fullKey] = value;
            console.log(`🔄 ${key} saved to memory fallback`);
        }
        
        // Special handling for user data - ensure consistency
        if (key === 'jdmCurrentUser' && value) {
            console.log('👤 Current user updated, syncing login status');
            this.setItem('jdmLoggedIn', 'true');
        }
        
        if (key === 'jdmUsers' && value) {
            console.log('👥 Users list updated');
        }
    }
    
    getItem(key) {
        console.log(`🔍 STORAGE GET: ${key}`);
        
        // Try memory fallback first (fastest)
        const memoryKey = `${this.domainKey}_${key}`;
        if (this.fallbackStorage[memoryKey] !== undefined) {
            console.log(`✅ ${key} loaded from memory`);
            return this.fallbackStorage[memoryKey];
        }
        
        // Try storage layers in order
        for (let i = 0; i < this.storageLayers.length; i++) {
            try {
                const value = this.getFromLayer(this.storageLayers[i], key);
                if (value !== null && value !== undefined) {
                    console.log(`✅ ${key} loaded from ${this.storageLayers[i].name}`);
                    return value;
                }
            } catch (e) {
                console.warn(`Error getting ${key} from ${this.storageLayers[i].name}:`, e);
            }
        }
        
        console.log(`❌ ${key} not found in any storage`);
        return null;
    }
    
    getFromLayer(layer, key) {
        const fullKey = `${this.domainKey}_${key}`;
        
        // Special handling for URL storage
        if (layer === this.tryURLStorage) {
            const hash = window.location.hash;
            const match = hash.match(/cart=([^&]+)/);
            if (match && key === 'jdmCart') {
                return JSON.parse(atob(match[1]));
            }
            return null;
        }
        
        // For window.name storage
        if (layer === this.tryWindowName) {
            if (window.name && window.name !== '') {
                try {
                    const data = JSON.parse(window.name);
                    return data[fullKey] || null;
                } catch (e) {
                    return null;
                }
            }
            return null;
        }
        
        // For localStorage and sessionStorage
        if (layer === this.tryLocalStorage) {
            const item = localStorage.getItem(fullKey);
            return item ? JSON.parse(item) : null;
        }
        
        if (layer === this.trySessionStorage) {
            const item = sessionStorage.getItem(fullKey);
            return item ? JSON.parse(item) : null;
        }
        
        return null;
    }
    
    removeItem(key) {
        console.log(`🗑️ STORAGE REMOVE: ${key}`);
        
        // Remove from all layers
        for (const layer of this.storageLayers) {
            layer(key, null);
        }
        
        // Remove from memory
        const memoryKey = `${this.domainKey}_${key}`;
        delete this.fallbackStorage[memoryKey];
    }
    
    clear() {
        console.log('🔥 STORAGE CLEAR: All JDM data');
        const keys = ['jdmCart', 'jdmCurrentUser', 'jdmLoggedIn', 'jdmUsers', 'jdmPurchases', 'jdmUserProfiles'];
        keys.forEach(key => this.removeItem(key));
        
        // Clear memory
        this.fallbackStorage = {};
    }
    
    // Debug method to show all stored data
    debugStorage() {
        console.group('🔍 STORAGE DEBUG INFO');
        console.log('Domain Key:', this.domainKey);
        console.log('Memory Storage:', this.fallbackStorage);
        
        // Check window.name
        if (window.name && window.name !== '') {
            try {
                console.log('Window.name Data:', JSON.parse(window.name));
            } catch (e) {
                console.log('Window.name (non-JSON):', window.name);
            }
        } else {
            console.log('Window.name: Empty');
        }
        
        // Check URL for cart
        const hash = window.location.hash;
        const match = hash.match(/cart=([^&]+)/);
        if (match) {
            console.log('URL Cart Data: Present');
        }
        console.groupEnd();
    }
}

// Create global instance
const storage = new GitHubPagesStorage();

// Add debug method to window for testing
window.debugStorage = () => storage.debugStorage();