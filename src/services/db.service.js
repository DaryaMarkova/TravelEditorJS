const AccessMode = {
	ReadOnly: 'readonly',
	ReadAndWrite: 'readwrite'
};

class DBService {
	constructor() {
		this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    this.idbTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
		this.connection = null;
		this.store = null;
	}

	async getConnection() {
		const connection = await new Promise((resolve, reject) => {
      const request = this.indexedDB.open('TravelEditorDB');

      request.onerror = error => reject(error);
     
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = () => {
        request.result.createObjectStore('Countries');
        request.result.createObjectStore('Markers', { keyPath: "id", autoIncrement: true })
      }
		});

		return connection;
	}

	async getStore(storeName, accessMode = AccessMode.ReadOnly) {
		if (!this.connection) {
			this.connection = await this.getConnection()
		}

		const store = await new Promise((resolve, reject) => {
      const transaction = this.connection.transaction(storeName, accessMode);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      resolve(transaction.objectStore(storeName))
		});
		
		return store;
	}

	async getDataFromStore(storeName) {
		return new Promise( async (resolve, reject) => {
			if (!this.store) {
				this.store = await this.getStore(storeName, AccessMode.ReadAndWrite);
			}

			if ('getAll' in this.store) {
				const request = this.store.getAll();

				request.onsuccess = () => resolve(request.result);
				request.onerror = () => resolve([])
			} else {
				const values = [], request = this.store.openCursor();
				
				request.onsuccess = event => {
					const cursor = event.target.result;

					if (cursor) {
						values.push(cursor.value);
						cursor.continue();
					} else {
						resolve(values);
					}
				}
			}
		});
	}
}

export const dbService = new DBService();