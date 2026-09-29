/**
 * Shareable result card wiring for the Pain Guide (PoliShare).
 * State is the procedure type + selected body location; restore replays the
 * same selection through the app's own displayPainInfo().
 */
'use strict';

(function () {
  function text(id) {
    var el = document.getElementById(id);
    return el ? el.textContent.trim() : '';
  }

  PoliShare.init({
    tool: 'piercing-pain-guide',
    mount: '#painDetails',

    getState: function () {
      if (typeof selectedLocation === 'undefined' || !selectedLocation) return null;
      return { p: currentProcedure, l: selectedLocation };
    },

    applyState: function (s) {
      if (!s.l) return;
      if (s.p && typeof currentProcedure !== 'undefined' && s.p !== currentProcedure) {
        var btn = document.getElementById(s.p === 'piercing' ? 'piercingBtn' : 'tattooBtn');
        if (btn) btn.click();
      }
      if (typeof window.displayPainInfo === 'function') window.displayPainInfo(s.l);
    },

    getCard: function () {
      var details = document.getElementById('painDetails');
      if (!details || details.style.display === 'none') return null;
      var name = text('locationName');
      var rating = text('painRating');
      var category = text('painCategory');
      var proc =
        typeof currentProcedure !== 'undefined' && currentProcedure === 'piercing'
          ? 'Piercing'
          : 'Tattoo';
      if (!name || !rating) return null;
      return {
        t: name + ' ' + proc.toLowerCase() + ' pain: ' + rating,
        d: [
          ['Pain level', rating],
          ['Category', category],
          ['Procedure', proc],
        ],
      };
    },
  });
})();
