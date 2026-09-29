/**
 * Offline Studio Backup & Encrypted Vault Export Engine
 * Poli International Tattoo Tools Suite
 * 
 * Cryptographic standard: W3C Web Cryptography API (PBKDF2 SHA-256 + AES-GCM 256-bit).
 * 100% client-side, zero network transmission.
 */

(function () {
  'use strict';

  const VAULT_SCHEMA_VERSION = '2.0.0';

  // Helper to convert ArrayBuffer to Base64
  function bufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Helper to convert Base64 to ArrayBuffer
  function base64ToBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Collect all studio data from localStorage
  function collectStudioData() {
    const formulas = [];
    const inventory = [];
    let calibration = null;
    let theme = 'light';
    let lang = 'en';

    try {
      // Formulas
      const f1 = localStorage.getItem('ink_mixer_formulas');
      const f2 = localStorage.getItem('tattoo_saved_formulas');
      if (f1) formulas.push(...JSON.parse(f1));
      if (f2) formulas.push(...JSON.parse(f2));

      // Inventory
      const inv1 = localStorage.getItem('tattoo_inventory');
      const inv2 = localStorage.getItem('tattoo_ink_inventory');
      if (inv1) inventory.push(...JSON.parse(inv1));
      if (inv2) inventory.push(...JSON.parse(inv2));

      // Calibration
      const cal = localStorage.getItem('poli_ink_mixer_drop_calibration');
      if (cal) calibration = JSON.parse(cal);

      // Settings
      theme = localStorage.getItem('poli_ink_mixer_theme') || 'light';
      lang = localStorage.getItem('poli_ink_mixer_lang') || 'en';
    } catch (e) {
      console.warn('Error aggregating studio local storage data', e);
    }

    return {
      appName: 'Tattoo Ink Mixer',
      publisher: 'Poli International',
      schemaVersion: VAULT_SCHEMA_VERSION,
      exportTimestamp: new Date().toISOString(),
      data: {
        formulas: formulas,
        inventory: inventory,
        calibration: calibration,
        settings: {
          theme: theme,
          language: lang
        }
      }
    };
  }

  // Encrypt JSON with PBKDF2 + AES-GCM
  async function encryptVaultPayload(plainObject, passphrase) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Web Cryptography API is not available in this environment.');
    }

    const enc = new TextEncoder();
    const plainBytes = enc.encode(JSON.stringify(plainObject));

    // Generate random 16-byte salt and 12-byte IV
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Derive key from passphrase
    const passphraseKey = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const aesKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passphraseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // Encrypt
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      aesKey,
      plainBytes
    );

    return {
      encrypted: true,
      format: 'PoliStudioVaultAESGCM256',
      schemaVersion: VAULT_SCHEMA_VERSION,
      salt: bufferToBase64(salt),
      iv: bufferToBase64(iv),
      ciphertext: bufferToBase64(ciphertext),
      timestamp: new Date().toISOString()
    };
  }

  // Decrypt Vault Payload
  async function decryptVaultPayload(vaultObject, passphrase) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Web Cryptography API is not available in this environment.');
    }

    if (!vaultObject.salt || !vaultObject.iv || !vaultObject.ciphertext) {
      throw new Error('Corrupted or invalid encrypted vault envelope structure.');
    }

    const salt = new Uint8Array(base64ToBuffer(vaultObject.salt));
    const iv = new Uint8Array(base64ToBuffer(vaultObject.iv));
    const ciphertext = base64ToBuffer(vaultObject.ciphertext);

    const enc = new TextEncoder();
    const passphraseKey = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const aesKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passphraseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    try {
      const decryptedBytes = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        aesKey,
        ciphertext
      );

      const dec = new TextDecoder();
      const jsonString = dec.decode(decryptedBytes);
      return JSON.parse(jsonString);
    } catch (e) {
      throw new Error('Incorrect passphrase or corrupted vault file.');
    }
  }

  // Trigger File Download
  function downloadBlob(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  // Restore payload to localStorage
  function restoreStudioData(payload) {
    if (!payload || !payload.data) {
      throw new Error('Invalid backup data structure.');
    }

    const { formulas, inventory, calibration, settings } = payload.data;

    if (Array.isArray(formulas)) {
      localStorage.setItem('ink_mixer_formulas', JSON.stringify(formulas));
    }

    if (Array.isArray(inventory)) {
      localStorage.setItem('tattoo_inventory', JSON.stringify(inventory));
    }

    if (calibration) {
      localStorage.setItem('poli_ink_mixer_drop_calibration', JSON.stringify(calibration));
    }

    if (settings && settings.language) {
      localStorage.setItem('poli_ink_mixer_lang', settings.language);
    }

    // Trigger UI refresh
    if (typeof window.loadSavedFormulas === 'function') window.loadSavedFormulas();
    if (typeof window.refreshInventoryUI === 'function') window.refreshInventoryUI();
    if (typeof window.initCalibrationUI === 'function') window.initCalibrationUI();
  }

  // Init Studio Vault UI
  function initStudioVaultUI() {
    const exportJsonBtn = document.getElementById('vaultExportJsonBtn');
    const exportEncBtn = document.getElementById('vaultExportEncBtn');
    const encPassInput = document.getElementById('vaultEncPassphrase');
    const fileInput = document.getElementById('vaultFileInput');
    const restoreBtn = document.getElementById('vaultRestoreBtn');
    const decPassInput = document.getElementById('vaultDecPassphrase');
    const decPassGroup = document.getElementById('vaultDecPassGroup');
    const previewSummary = document.getElementById('vaultPreviewSummary');

    let pendingRestoreFile = null;

    if (!exportJsonBtn && !restoreBtn) return;

    const _t = (k, p) => typeof window.t === 'function' ? window.t(k, p) : k;

    if (exportJsonBtn) {
      exportJsonBtn.onclick = function () {
        const studioData = collectStudioData();
        const json = JSON.stringify(studioData, null, 2);
        const dateStr = new Date().toISOString().split('T')[0];
        downloadBlob(json, `tattoo_studio_backup_${dateStr}.json`, 'application/json');
        if (typeof window.showNotification === 'function') {
          window.showNotification(_t('studioVault.jsonDownloaded'), 'success');
        }
      };
    }

    if (exportEncBtn) {
      exportEncBtn.onclick = async function () {
        const pass = encPassInput ? encPassInput.value : '';
        if (!pass || pass.length < 4) {
          if (typeof window.showNotification === 'function') {
            window.showNotification(_t('studioVault.passphraseWarning'), 'warning');
          }
          if (encPassInput) encPassInput.focus();
          return;
        }

        try {
          const studioData = collectStudioData();
          const encryptedVault = await encryptVaultPayload(studioData, pass);
          const json = JSON.stringify(encryptedVault, null, 2);
          const dateStr = new Date().toISOString().split('T')[0];
          downloadBlob(json, `tattoo_studio_vault_${dateStr}.vault`, 'application/json');
          if (typeof window.showNotification === 'function') {
            window.showNotification(_t('studioVault.vaultExportSuccess'), 'success');
          }
          if (encPassInput) encPassInput.value = '';
        } catch (e) {
          if (typeof window.showNotification === 'function') {
            window.showNotification(_t('studioVault.encryptionError', { error: e.message }), 'error');
          }
        }
      };
    }

    if (fileInput) {
      fileInput.onchange = function (e) {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          pendingRestoreFile = file;

          const reader = new FileReader();
          reader.onload = function (ev) {
            try {
              const parsed = JSON.parse(ev.target.result);
              if (parsed.encrypted && parsed.format === 'PoliStudioVaultAESGCM256') {
                if (decPassGroup) decPassGroup.style.display = 'block';
                if (previewSummary) {
                  previewSummary.innerHTML = `
                    <div style="padding: 0.75rem; border-radius: var(--border-radius); background: var(--bg-secondary); border: 1px solid var(--border-primary);">
                      🔒 <strong>${_t('studioVault.encryptedVaultDetected')}</strong><br>
                      <span style="font-size: 0.85rem; color: var(--text-secondary);">${_t('studioVault.enterPassphraseToRestore')}</span>
                    </div>
                  `;
                }
              } else if (parsed.data) {
                if (decPassGroup) decPassGroup.style.display = 'none';
                const fCount = Array.isArray(parsed.data.formulas) ? parsed.data.formulas.length : 0;
                const iCount = Array.isArray(parsed.data.inventory) ? parsed.data.inventory.length : 0;
                if (previewSummary) {
                  previewSummary.innerHTML = `
                    <div style="padding: 0.75rem; border-radius: var(--border-radius); background: var(--bg-secondary); border: 1px solid var(--border-primary);">
                      📄 <strong>${_t('studioVault.standardBackupVerified')}</strong><br>
                      <span style="font-size: 0.85rem; color: var(--text-secondary);">${_t('studioVault.backupContentsFound', { fCount, iCount })}</span>
                    </div>
                  `;
                }
              } else {
                if (previewSummary) {
                  previewSummary.innerHTML = `<span style="color: var(--accent-error);">⚠️ ${_t('studioVault.unrecognizedFormat')}</span>`;
                }
              }
            } catch (err) {
              if (previewSummary) {
                previewSummary.innerHTML = `<span style="color: var(--accent-error);">⚠️ ${_t('studioVault.unableToParseJson')}</span>`;
              }
            }
          };
          reader.readAsText(file);
        }
      };
    }

    if (restoreBtn) {
      restoreBtn.onclick = async function () {
        if (!pendingRestoreFile) {
          if (typeof window.showNotification === 'function') {
            window.showNotification(_t('studioVault.selectFileFirst'), 'warning');
          }
          return;
        }

        const reader = new FileReader();
        reader.onload = async function (ev) {
          try {
            const parsed = JSON.parse(ev.target.result);
            let payloadToRestore = null;

            if (parsed.encrypted) {
              const pass = decPassInput ? decPassInput.value : '';
              if (!pass) {
                if (typeof window.showNotification === 'function') {
                  window.showNotification(_t('studioVault.enterPassphrase'), 'warning');
                }
                if (decPassInput) decPassInput.focus();
                return;
              }

              payloadToRestore = await decryptVaultPayload(parsed, pass);
            } else {
              payloadToRestore = parsed;
            }

            restoreStudioData(payloadToRestore);

            if (typeof window.showNotification === 'function') {
              window.showNotification(_t('studioVault.restoreSuccess'), 'success');
            }

            if (previewSummary) {
              previewSummary.innerHTML = `<span style="color: var(--accent-success);">✅ ${_t('studioVault.restoreComplete')}</span>`;
            }

            setTimeout(() => {
              window.location.reload();
            }, 800);
          } catch (e) {
            if (typeof window.showNotification === 'function') {
              window.showNotification(_t('studioVault.restoreFailed', { error: e.message }), 'error');
            }
          }
        };
        reader.readAsText(pendingRestoreFile);
      };
    }
  }

  // Global exposure
  window.collectStudioData = collectStudioData;
  window.encryptVaultPayload = encryptVaultPayload;
  window.decryptVaultPayload = decryptVaultPayload;
  window.restoreStudioData = restoreStudioData;
  window.initStudioVaultUI = initStudioVaultUI;

  document.addEventListener('DOMContentLoaded', initStudioVaultUI);
})();
