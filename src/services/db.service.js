class DBService {
  constructor() {
    this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    this.idbTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  }

  getConnection() {
    return new Promise((resolve, reject) => {
      const request = this.indexedDB.open('TravelEditorDB');

      request.onerror = err => reject(err);
     
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = () => {
        // TODO: create all the necessary storages here
        request.result.createObjectStore('Countries');
      }
    });
  }

  // accessMode: readonly, readwrite
  async getStore(storeName, accessMode) {
    if (!this.connection) {
      this.connection = await this.getConnection();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.connection.transaction(storeName, accessMode);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      resolve(transaction.objectStore(storeName))
    })
  }

  // IE doen't support getAll(). make polyfill
  async getAllFromStore(storeName) {
    if (!this.connection) {
      this.connection = await this.getConnection();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.connection.transaction(storeName, 'readonly');
      const request = transaction.objectStore(storeName).getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve([])
      transaction.onerror = () => reject(transaction.error);
    })
  }
}

export const dbService = new DBService();