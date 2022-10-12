interface IDBBase {
  dbName: string;
  version: number;
  paramsList: {name: string, uni: boolean}[];
  storeName: string;
  keyPath: string;
}


export default class IndexedDB {
  _dbName: string = 'myDB';
  _dbVersion: number = 1;
  _dbTable: { name: string, uni: boolean}[] = [];
  _db: any = null;
  _storeName: string = '';
  _keyPath: string = '';
  _objectStore: any = null;

  constructor(info: IDBBase) {
    this._dbName = info.dbName;
    this._dbVersion = info.version;
    this._dbTable = info.paramsList;
    this._storeName = info.storeName;
    this._keyPath = info.keyPath

    if (this._db) {
      console.log('已存在打开数据库～～，请关闭')
    }
  }

  public checkIsSupportDB = () => {
    if (!window.indexedDB) {
      console.error('浏览器版本不支持使用')
      return false
    } else {
      return true
    }
  }

  public startObjectStore = () => { // 事务要现开现用，不然事务会结束。
    this._objectStore = this._db.transaction(this._storeName, 'readwrite').objectStore(this._storeName)
  }

  public handleErrorMsg = (err: any) => {
    if (err.type === "error") {
      console.log(err.srcElement.error);
    }
  }

  public handleSingleAdd = (data: any) => {
    return new Promise((resolve, reject) => {
      this.startObjectStore()
      const request = this._objectStore.add(data)
      
      request.onsuccess = () => {
        console.log('数据添加成功');
        resolve(true)
      }
  
      request.onerror = (err) => {
        console.log('数据添加失败');
        this.handleErrorMsg(err)
        reject(false)
      }
    })
  }

  public openDB = () => {
    if (!this.checkIsSupportDB()) return
    return new Promise ((resolve, reject) => {
      const indexDB = window.indexedDB
      const request = indexDB.open(this._dbName, this._dbVersion)
  
      request.onsuccess = (event) => {
        console.log("数据库打开成功");
        resolve(event.target.result)
        this._db = event.target.result
      }
  
      request.onerror = (err) => {
        console.log("数据库打开失败", err);
        reject(null)
        this._db = null
      }
  
      // 数据库更新时的回调
      request.onupgradeneeded = (event) => {
        console.log('数据库更新');
        this._db = event.target.result;
  
        const objectStore = this._db.createObjectStore(this._storeName, {
          keyPath: this._keyPath,
        })
  
        this._dbTable.forEach(i => {
          objectStore.createIndex(i.name, i.name, { unique: i.uni }); 
        })
      }
  
      // 在其他标签页打开了该数据库 触发
      request.onblocked = () => {
        alert("请关闭其它由该站点打开的页签")
      }
    })
  }

  public addData = (data: any[]) => {
    return new Promise(async(resolve, reject) => {
      this.startObjectStore()
      const passIds = []
      const failedIds = []

      for (const item of data) {
        try {
          await this.handleSingleAdd(item)
          passIds.push(item.ssn)
        } catch (error) {
          failedIds.push(item.ssn)
        }
      }
      resolve({
        passIds, failedIds,
        allPassed: failedIds.length <= 0
      })
    })
  }

  // 按主键删除
  public delData = (key: string) => {
    return new Promise((resolve, reject) => {
      this.startObjectStore()
      const request = this._objectStore.delete(key)
      
      request.onsuccess = () => {
        console.log('数据删除成功');
        resolve(true)
      }

      request.onerror = () => {
        console.log('数据删除失败');
        reject(false)
      }
    })
  }

  public updateData = (data: any) => {
    return new Promise((resolve, reject) => {
      this.startObjectStore()
      const request = this._objectStore.put(data)
      
      request.onsuccess = () => {
        console.log('数据更新成功');
        resolve(true)
      }
  
      request.onerror = () => {
        console.log('数据更新失败');
        reject(false)
      }
    })
  }

  public findElByIndex = (idx: string, searchName: string) => {
    return new Promise((resolve, reject) => {
      const list = []
      this.startObjectStore()
      const request = this._objectStore.index(idx).openCursor(IDBKeyRange.only(searchName))
  
      request.onsuccess = (e) => {
        const cursor = e.target.result
        if (cursor) {
          list.push(cursor.value)
          cursor.continue()
        } else {
          resolve(list)
        }
      }
    })
  }

  public queryAllData = () => {
    return new Promise<any[]>((resolve, reject) => {
      this.startObjectStore()
      const list = []

      // 1. 获取全部数据 
      this._objectStore.getAll().onsuccess = (event) => {
        resolve(event.target.result)
      }
    })
  }

  public queryCustomCondition = (callback: (params: object) => boolean) => {
    return new Promise<any[]>((resolve, reject) => {
      this.startObjectStore()
      const list = []
  
      this._objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          callback(cursor.value) && list.push(cursor.value)
          cursor.continue();
        } else {
          resolve(list)
        }
      }
    })
  }

  public closeDB = () => {
    this._db.close()
    this._db = null
  }
}