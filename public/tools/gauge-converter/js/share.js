/**
 * Shareable result card wiring for the Gauge Converter (PoliShare).
 * State is the mm value; the converter derives gauge and inches from it.
 */
'use strict';

(function () {
  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  PoliShare.init({
    tool: 'gauge-converter',
    mount: '.gauge-converter__visual-container',

    getState: function () {
      var mm = val('mm-input');
      if (!mm) return null;
      return { mm: mm };
    },

    applyState: function (s) {
      var input = document.getElementById('mm-input');
      if (!input || !s.mm) return;
      input.value = s.mm;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    },

    getCard: function () {
      var gauge = val('gauge-input');
      var mm = val('mm-input');
      var inch = val('inch-input');
      if (!mm) return null;
      var t = (gauge ? gauge + ' gauge' : mm + ' mm') + ' = ' + mm + ' mm = ' + inch + '"';
      return {
        t: t,
        d: [
          ['Gauge', gauge || 'between sizes'],
          ['Millimetres', mm + ' mm'],
          ['Inches', inch + '"'],
        ],
      };
    },
  });
})();
