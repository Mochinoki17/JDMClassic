// github-storage.js
class GitHubPagesStorage {
    constructor() {
        console.log('GitHubPagesStorage initialized');
        this.storageLayers = [
            this.tryLocalStorage.bind(this),
            this.trySessionStorage.bind(this),
            this.tryWindowName.bind(this),
            this.tryURLStorage.bind(this)
        ];
        
        this.domainKey = this.getDomainKey();
        console.log('Domain key:', this.domainKey);
        this.loadURLData();
    }
    
    getDomainKey() {
        // Create consistent key across all GitHub Pages URLs
        const repo = window.location.pathname.split('/')[1] || 'main';
        return `jdm_${repo.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
    
    tryLocalStorage(key, value) {
        try {
            const fullKey = `${this.domainKey}_${key}`;
            if (value === null) {
                localStorage.removeItem(fullKey);
                return true;
            } else {
                localStorage.setItem(fullKey, JSON.stringify(value));
                return true;
            }
        } catch (e) {
            return false;
        }
    }
    
    trySessionStorage(key, value) {
        try {
            const fullKey = `${this.domainKey}_${key}`;
            if (value === null) {
                sessionStorage.removeItem(fullKey);
                return true;
            } else {
                sessionStorage.setItem(fullKey, JSON.stringify(value));
                return true;
            }
        } catch (e) {
            return false;
        }
    }
    
    tryWindowName(key, value) {
        try {
            let data = {};
            if (window.name) {
                data = JSON.parse(window.name);
            }
            
            const fullKey = `${this.domainKey}_${key}`;
            
            if (value === null) {
                delete data[fullKey];
            } else {
                data[fullKey] = value;
            }
            
            window.name = JSON.stringify(data);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    tryURLStorage(key, value) {
        // Only for cart data and small items
        if (key === 'jdmCart' && value && Array.isArray(value)) {
            try {
                const compressed = btoa(JSON.stringify(value));
                if (compressed.length < 1500) { // URL length limit
                    const newUrl = `${window.location.pathname}#cart=${compressed}`;
                    window.history.replaceState(null, '', newUrl);
                    return true;
                }
            } catch (e) {
                console.warn('URL storage failed:', e);
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
                this.setItem('jdmCart', cartData);
                console.log('Loaded cart from URL');
            } catch (e) {
                console.warn('Failed to parse URL cart data');
            }
        }
    }
    
    setItem(key, value) {
        console.log(`🔧 STORAGE DEBUG: Setting ${key}`, value);
        
        let saved = false;
        // Try all storage layers
        for (const layer of this.storageLayers) {
            if (layer(key, value)) {
                console.log(`✅ STORAGE: ${key} saved via ${layer.name}`);
                saved = true;
                break;
            }
        }
        
        if (!saved) {
            console.error(`❌ STORAGE: Failed to save ${key} to any storage layer`);
        }
    }
    
    getItem(key) {
        console.log(`🔧 STORAGE DEBUG: Getting ${key}`);
        
        // Try layers in reverse order (URL -> Window -> Session -> Local)
        for (let i = this.storageLayers.length - 1; i >= 0; i--) {
            try {
                const value = this.getFromLayer(this.storageLayers[i], key);
                if (value !== null && value !== undefined) {
                    console.log(`✅ STORAGE: ${key} loaded from ${this.storageLayers[i].name}`, value);
                    return value;
                }
            } catch (e) {
                console.warn(`STORAGE: Error getting ${key} from ${this.storageLayers[i].name}:`, e);
            }
        }
        
        console.log(`❌ STORAGE: ${key} not found in any storage layer`);
        return null;
    }
    
    getFromLayer(layer, key) {
        // Special handling for URL storage
        if (layer === this.tryURLStorage) {
            const hash = window.location.hash;
            const match = hash.match(/cart=([^&]+)/);
            if (match && key === 'jdmCart') {
                return JSON.parse(atob(match[1]));
            }
            return null;
        }
        
        // For other layers, we need to retrieve differently
        if (layer === this.tryLocalStorage) {
            const fullKey = `${this.domainKey}_${key}`;
            const item = localStorage.getItem(fullKey);
            return item ? JSON.parse(item) : null;
        }
        
        if (layer === this.trySessionStorage) {
            const fullKey = `${this.domainKey}_${key}`;
            const item = sessionStorage.getItem(fullKey);
            return item ? JSON.parse(item) : null;
        }
        
        if (layer === this.tryWindowName) {
            if (window.name) {
                const data = JSON.parse(window.name);
                const fullKey = `${this.domainKey}_${key}`;
                return data[fullKey] || null;
            }
            return null;
        }
        
        return null;
    }
    
    removeItem(key) {
        for (const layer of this.storageLayers) {
            layer(key, null);
        }
    }
    
    clear() {
        // Clear all JDM data
        const keys = ['jdmCart', 'jdmCurrentUser', 'jdmLoggedIn', 'jdmUsers', 'jdmPurchases', 'jdmUserProfiles'];
        keys.forEach(key => this.removeItem(key));
    }
}

// Create global instance
const storage = new GitHubPagesStorage();