class IndexedDBStore {
    constructor(dbName, storeName) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.db = null;
        this.ready = this.init();
    }

    // 初始化数据库
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: "id" });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                Promise.all(['labels','keywords'].map(async (key)=>{(await storage.get(key)!=null||await storage.set(key,[]))})).then(resolve)
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async clear() {
        try {
            const db = this.db;
            const storeNames = Array.from(db.objectStoreNames); // 获取所有存储对象
            if (storeNames.length === 0) {
                console.log("No object stores to clear.");
                return;
            }

            const transaction = db.transaction(storeNames, "readwrite");
            storeNames.forEach((storeName) => {
                const objectStore = transaction.objectStore(storeName);
                objectStore.clear();
                console.log(`Cleared object store: ${storeName}`);
            });

            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => {
                    console.log("All object stores cleared.");
                    resolve();
                };
                transaction.onerror = (event) => {
                    reject(`Transaction failed: ${event.target.error}`);
                };
            });
        } catch (error) {
            console.error("Error clearing storage:", error);
        }
        this.ready = this.init();
        await  this.ready ;
    }
    // 设置数据
    async set(key, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);

            // 将 key 和 value 存储
            const data = { id: key, value: value };
            const request = store.put(data);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
    // 删除数据
    async delete(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
    // 获取数据
    async get(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result ? request.result.value : null);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
}

const storage = new IndexedDBStore("treeSkills", "graph");

export { storage };