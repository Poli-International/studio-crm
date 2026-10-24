/**
 * Tattoo Removal Sessions Estimator - IndexedDB Local Photo Progression Store
 * Pure client-side photo storage, compression, and retrieval.
 * Zero external libraries, zero network requests.
 */
(function(window) {
  'use strict';

  var DB_NAME = 'poli_tattoo_photos_db';
  var DB_VERSION = 1;
  var STORE_NAME = 'photos';

  var dbPromise = null;

  function getDB() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise(function(resolve, reject) {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }
      var request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = function(e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          var store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('profileId', 'profileId', { unique: false });
        }
      };
      request.onsuccess = function(e) {
        resolve(e.target.result);
      };
      request.onerror = function(e) {
        reject(e.target.error);
      };
    });

    return dbPromise;
  }

  /**
   * Compress image file to data URL via HTML5 Canvas
   * Max dimension 1000px, JPEG quality 0.8
   */
  function compressImage(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
          var maxDim = 1000;
          var w = img.width;
          var h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          var canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          var dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(dataUrl);
        };
        img.onerror = function() {
          reject(new Error('Failed to load image for compression'));
        };
        img.src = e.target.result;
      };
      reader.onerror = function(err) {
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Save session photo
   */
  function savePhoto(profileId, sessionIndex, fileOrDataUrl, dateStr) {
    return new Promise(function(resolve, reject) {
      function persist(dataUrl) {
        getDB().then(function(db) {
          var tx = db.transaction([STORE_NAME], 'readwrite');
          var store = tx.objectStore(STORE_NAME);
          var record = {
            id: profileId + '_' + sessionIndex,
            profileId: profileId,
            sessionIndex: sessionIndex,
            dataUrl: dataUrl,
            date: dateStr || ''
          };
          var req = store.put(record);
          req.onsuccess = function() {
            resolve(record);
          };
          req.onerror = function(e) {
            reject(e.target.error);
          };
        }).catch(reject);
      }

      if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.indexOf('data:image') === 0) {
        persist(fileOrDataUrl);
      } else if (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File) {
        compressImage(fileOrDataUrl).then(persist).catch(reject);
      } else {
        reject(new Error('Invalid image payload'));
      }
    });
  }

  /**
   * Get single photo
   */
  function getPhoto(profileId, sessionIndex) {
    return new Promise(function(resolve, reject) {
      getDB().then(function(db) {
        var tx = db.transaction([STORE_NAME], 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req = store.get(profileId + '_' + sessionIndex);
        req.onsuccess = function(e) {
          resolve(e.target.result || null);
        };
        req.onerror = function(e) {
          reject(e.target.error);
        };
      }).catch(reject);
    });
  }

  /**
   * Get all photos for profile
   */
  function getPhotosForProfile(profileId) {
    return new Promise(function(resolve, reject) {
      getDB().then(function(db) {
        var tx = db.transaction([STORE_NAME], 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var index = store.index('profileId');
        var req = index.getAll(profileId);
        req.onsuccess = function(e) {
          resolve(e.target.result || []);
        };
        req.onerror = function(e) {
          reject(e.target.error);
        };
      }).catch(reject);
    });
  }

  /**
   * Delete photo
   */
  function deletePhoto(profileId, sessionIndex) {
    return new Promise(function(resolve, reject) {
      getDB().then(function(db) {
        var tx = db.transaction([STORE_NAME], 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var req = store.delete(profileId + '_' + sessionIndex);
        req.onsuccess = function() {
          resolve(true);
        };
        req.onerror = function(e) {
          reject(e.target.error);
        };
      }).catch(reject);
    });
  }

  /**
   * Delete all photos for profile
   */
  function deletePhotosForProfile(profileId) {
    return new Promise(function(resolve, reject) {
      getDB().then(function(db) {
        var tx = db.transaction([STORE_NAME], 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var index = store.index('profileId');
        var req = index.openKeyCursor(IDBKeyRange.only(profileId));
        req.onsuccess = function(e) {
          var cursor = e.target.result;
          if (cursor) {
            store.delete(cursor.primaryKey);
            cursor.continue();
          } else {
            resolve(true);
          }
        };
        req.onerror = function(e) {
          reject(e.target.error);
        };
      }).catch(reject);
    });
  }

  /**
   * Export all photos for backup
   */
  function exportAllPhotos() {
    return new Promise(function(resolve, reject) {
      getDB().then(function(db) {
        var tx = db.transaction([STORE_NAME], 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req = store.getAll();
        req.onsuccess = function(e) {
          resolve(e.target.result || []);
        };
        req.onerror = function(e) {
          reject(e.target.error);
        };
      }).catch(reject);
    });
  }

  /**
   * Import photos from backup
   */
  function importPhotos(photosArray) {
    return new Promise(function(resolve, reject) {
      if (!Array.isArray(photosArray) || photosArray.length === 0) {
        resolve(0);
        return;
      }
      getDB().then(function(db) {
        var tx = db.transaction([STORE_NAME], 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var count = 0;
        photosArray.forEach(function(item) {
          if (item && item.id && item.dataUrl) {
            store.put(item);
            count++;
          }
        });
        tx.oncomplete = function() {
          resolve(count);
        };
        tx.onerror = function(e) {
          reject(e.target.error);
        };
      }).catch(reject);
    });
  }

  window.PhotoStore = {
    savePhoto: savePhoto,
    getPhoto: getPhoto,
    getPhotosForProfile: getPhotosForProfile,
    deletePhoto: deletePhoto,
    deletePhotosForProfile: deletePhotosForProfile,
    exportAllPhotos: exportAllPhotos,
    importPhotos: importPhotos
  };

})(typeof window !== 'undefined' ? window : this);
