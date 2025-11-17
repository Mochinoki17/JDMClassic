// github-storage.js - ULTIMATE GITHUB PAGES FIX
class GitHubPagesStorage {
    constructor() {
        console.log('🚀 GitHubPagesStorage initialized - ULTIMATE FIX');
        this.storageLayers = [
            this.tryWindowName.bind(this),
            this.tryLocalStorage.bind(this),
            this.trySessionStorage.bind(this),
            this.tryURLStorage.bind(this)
        ];
        
        this.domainKey = this.getDomainKey();
        console.log('🔑 Domain key:', this.domainKey);
        this.fallbackStorage = {};
        this.loadURLData();
        
        // Test storage immediately
        this.testStorage();
    }
    
    testStorage() {
        console.log('🧪 Testing storage layers...');
        const testData = { test: 'data', timestamp: Date.now() };
        
        // Test each layer
        this.storageLayers.forEach(layer => {
            const layerName = layer.name.replace('try', '');
            try {
                layer('testKey', testData);
                const retrieved = this.getFromLayer(layer, 'testKey');
                console.log(`✅ ${layerName}:`, retrieved ? 'WORKING' : 'FAILED');
                layer('testKey', null); // Cleanup
            } catch (e) {
                console.log(`❌ ${layerName}: FAILED -`, e.message);
            }
        });
    }
    
    getDomainKey() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part);
        const repo = pathParts[0] || 'main';
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
            if (window.name && window.name !== '') {
                try {
                    data = JSON.parse(window.name);
                } catch (e) {
                    data = {};
                }
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
        if (key === 'jdmCart' && value && Array.isArray(value)) {
            try {
                const compressed = btoa(JSON.stringify(value));
                if (compressed.length < 1500) {
                    const newUrl = `${window.location.pathname}#cart=${compressed}`;
                    window.history.replaceState(null, '', newUrl);
                    return true;
                }
            } catch (e) {
                // Ignore URL errors
            }
        }
        return false;
    }
    
    loadURLData() {
        const hash = window.location.hash;
        const match = hash.match(/cart=([^&]+)/);
        if (match) {
            try {
                const cartData = JSON.parse(atob(match[1]));
                this.setItem('jdmCart', cartData);
            } catch (e) {
                // Ignore parse errors
            }
        }
    }
    
    setItem(key, value) {
        console.log(`💽 SET: ${key}`, value);
        
        let saved = false;
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
            console.log(`🔄 ${key} saved to MEMORY`);
        }
    }
    
    getItem(key) {
        console.log(`🔍 GET: ${key}`);
        
        // Try memory first
        const memoryKey = `${this.domainKey}_${key}`;
        if (this.fallbackStorage[memoryKey] !== undefined) {
            console.log(`✅ ${key} from MEMORY`);
            return this.fallbackStorage[memoryKey];
        }
        
        // Try storage layers
        for (let i = 0; i < this.storageLayers.length; i++) {
            try {
                const value = this.getFromLayer(this.storageLayers[i], key);
                if (value !== null && value !== undefined) {
                    console.log(`✅ ${key} from ${this.storageLayers[i].name}`);
                    return value;
                }
            } catch (e) {
                // Continue to next layer
            }
        }
        
        console.log(`❌ ${key} NOT FOUND`);
        return null;
    }
    
    getFromLayer(layer, key) {
        const fullKey = `${this.domainKey}_${key}`;
        
        if (layer === this.tryURLStorage && key === 'jdmCart') {
            const hash = window.location.hash;
            const match = hash.match(/cart=([^&]+)/);
            if (match) {
                return JSON.parse(atob(match[1]));
            }
            return null;
        }
        
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
        console.log(`🗑️ REMOVE: ${key}`);
        for (const layer of this.storageLayers) {
            layer(key, null);
        }
        const memoryKey = `${this.domainKey}_${key}`;
        delete this.fallbackStorage[memoryKey];
    }
    
    clear() {
        console.log('🔥 CLEAR ALL');
        const keys = ['jdmCart', 'jdmCurrentUser', 'jdmLoggedIn', 'jdmUsers', 'jdmPurchases', 'jdmUserProfiles'];
        keys.forEach(key => this.removeItem(key));
        this.fallbackStorage = {};
    }
}

// Create global instance
const storage = new GitHubPagesStorage();