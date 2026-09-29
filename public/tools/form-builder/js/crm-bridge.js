/**
 * Studio CRM bridge for the Consultation Form Builder.
 *
 * This file exists ONLY in the CRM's copy of the tool. The standalone build on
 * poliinternational.com does not load it, which is what keeps that build's
 * published promise true: it makes no network request beyond its own i18n.json,
 * and no client data leaves the browser.
 *
 * Inside the CRM the promise changes shape rather than disappearing: records go
 * to the studio's own database on the studio's own machine, never to a Poli
 * server. The banner below says exactly that, in the client's language.
 *
 * Nothing here touches the twelve tool modules. They are byte-identical to the
 * audited files serving on the website, and the whole point of a shim is to keep
 * them that way: an upgrade to the standalone tool is a straight file copy.
 *
 * Handshake: the CRM parent posts {type:'crm-host'} after the iframe loads. No
 * handshake means no host, so nothing below activates.
 */
(function () {
    'use strict';

    if (window.self === window.top) return;   // not embedded, nothing to do

    var host = null;                          // {clientId, clientName} once known

    // The tool's own dictionary is nested and already covers seven languages.
    // These four strings are CRM-only, so they live here rather than polluting
    // i18n.json, which has to stay identical to the site copy.
    var STRINGS = {
        en: { save: 'Save to client record', saved: 'Saved to client record',
              failed: 'Could not save. The record was not stored.',
              privacy: 'Stored in your studio database on this machine. Never sent to Poli International.' },
        fr: { save: 'Enregistrer dans le dossier client', saved: 'Enregistre dans le dossier client',
              failed: 'Echec de l\'enregistrement. Le dossier n\'a pas ete stocke.',
              privacy: 'Enregistre dans la base de votre studio, sur cette machine. Jamais transmis a Poli International.' },
        it: { save: 'Salva nella scheda cliente', saved: 'Salvato nella scheda cliente',
              failed: 'Salvataggio non riuscito. La scheda non e stata memorizzata.',
              privacy: 'Memorizzato nel database del tuo studio, su questa macchina. Mai inviato a Poli International.' },
        de: { save: 'In Kundenakte speichern', saved: 'In Kundenakte gespeichert',
              failed: 'Speichern fehlgeschlagen. Der Datensatz wurde nicht gespeichert.',
              privacy: 'In der Datenbank Ihres Studios auf diesem Rechner gespeichert. Wird nie an Poli International gesendet.' },
        es: { save: 'Guardar en la ficha del cliente', saved: 'Guardado en la ficha del cliente',
              failed: 'No se pudo guardar. El registro no se almaceno.',
              privacy: 'Guardado en la base de datos de su estudio, en este equipo. Nunca se envia a Poli International.' },
        nl: { save: 'Opslaan in klantdossier', saved: 'Opgeslagen in klantdossier',
              failed: 'Opslaan mislukt. Het dossier is niet bewaard.',
              privacy: 'Opgeslagen in de database van uw studio, op deze machine. Wordt nooit naar Poli International gestuurd.' },
        pt: { save: 'Salvar no cadastro do cliente', saved: 'Salvo no cadastro do cliente',
              failed: 'Nao foi possivel salvar. O registro nao foi armazenado.',
              privacy: 'Armazenado no banco de dados do seu estudio, nesta maquina. Nunca enviado para a Poli International.' }
    };

    function t(key) {
        var lang = (window.i18n && window.i18n.currentLanguage) || 'en';
        return (STRINGS[lang] || STRINGS.en)[key] || STRINGS.en[key];
    }

    function toast(msg, type) {
        if (window.FormBuilderApp && typeof window.FormBuilderApp.showToast === 'function') {
            window.FormBuilderApp.showToast(msg, type || 'info');
        }
    }

    /**
     * Replace the tool's own privacy line. The standalone build states that
     * nothing leaves the browser, which stops being true the moment the CRM
     * writes a record. Leaving that sentence up would be a false claim on a
     * consent form, so it is swapped rather than hidden.
     */
    function correctPrivacyNote() {
        var el = document.querySelector('.preview-footer-note');
        if (!el) return;
        var want = '🔒 ' + t('privacy');
        // Only write when it differs. Assigning textContent replaces child nodes
        // even for an identical string, which emits a mutation and would re-enter
        // the observer below without this check.
        if (el.textContent !== want) el.textContent = want;
    }

    function collectResponses() {
        var app = window.FormPreviewApp;
        if (app && typeof app.collectResponses === 'function') return app.collectResponses();
        // Fallback: read the rendered preview directly.
        var out = {};
        document.querySelectorAll('#preview-container [data-field-id]').forEach(function (el) {
            var input = el.querySelector('input, select, textarea');
            if (!input) return;
            out[el.getAttribute('data-field-id')] =
                input.type === 'checkbox' ? !!input.checked : input.value;
        });
        return out;
    }

    function saveToClient(btn) {
        if (!host) return;
        var form = window.FormBuilderApp && window.FormBuilderApp.currentForm;
        if (!form) return;

        btn.disabled = true;
        parent.postMessage({
            type: 'crm-save-consent',
            clientId: host.clientId,
            formName: form.name || 'Consent form',
            formCategory: form.category || null,
            language: (window.i18n && window.i18n.currentLanguage) || 'en',
            schema: form,
            responses: collectResponses()
        }, window.location.origin);

        // The parent answers crm-save-result; re-enable either way so a failed
        // save can be retried rather than leaving a dead button.
        setTimeout(function () { btn.disabled = false; }, 4000);
    }

    function addSaveButton() {
        if (!host || document.getElementById('crm-save-consent-btn')) return;

        // Footer group first: it sits directly under the completed form beside
        // Print, Export CSV and Generate PDF, which is where someone who has just
        // finished filling a form looks for a save. The top toolbar is a long way
        // up the page once a 28-field consent form is rendered, so a button parked
        // there is effectively invisible. The toolbar is only a fallback.
        var bar = document.querySelector('.preview-footer-btn-group') ||
                  document.querySelector('.preview-tools');
        if (!bar) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'crm-save-consent-btn';
        btn.className = 'btn-primary btn-large';
        btn.textContent = '💾 ' + t('save') +
            (host.clientName ? ' — ' + host.clientName : '');
        btn.addEventListener('click', function () { saveToClient(btn); });

        // Saving to the client record is the primary action inside the CRM, so it
        // leads the group rather than the PDF button remaining the default.
        bar.insertBefore(btn, bar.firstChild);
    }

    // The preview is re-rendered on language change and on entering preview, so
    // the button and the corrected privacy line have to be re-applied.
    //
    // Both callbacks mutate the subtree being observed, so the observer is
    // disconnected for the duration and reconnected afterwards. Without this the
    // callback re-enters itself indefinitely and the tab locks up.
    var moTarget = null;
    var mo = new MutationObserver(function () {
        mo.disconnect();
        try {
            addSaveButton();
            correctPrivacyNote();
        } finally {
            if (moTarget) mo.observe(moTarget, { childList: true, subtree: true });
        }
    });

    window.addEventListener('message', function (e) {
        if (e.origin !== window.location.origin || !e.data) return;

        if (e.data.type === 'crm-host') {
            host = { clientId: e.data.clientId, clientName: e.data.clientName };
            addSaveButton();
            correctPrivacyNote();
            var root = document.getElementById('preview-container');
            if (root) { moTarget = root; mo.observe(root, { childList: true, subtree: true }); }
            addSaveButton();          // preview may already be open
            correctPrivacyNote();
        }

        if (e.data.type === 'crm-save-result') {
            toast(e.data.ok ? t('saved') : t('failed'), e.data.ok ? 'success' : 'error');
        }
    });

    // Announce readiness so the parent can hand over the client context.
    document.addEventListener('DOMContentLoaded', function () {
        parent.postMessage({ type: 'crm-formbuilder-ready' }, window.location.origin);
    });
})();
