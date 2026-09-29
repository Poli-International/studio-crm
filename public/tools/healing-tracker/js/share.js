/**
 * Shareable result card wiring for the Healing Tracker (PoliShare).
 * State is the tracking setup: procedure type, date, and location/size.
 */
'use strict';

(function () {
  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  function setVal(id, value) {
    var el = document.getElementById(id);
    if (!el || value === undefined || value === null) return;
    el.value = value;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  if (typeof PoliShare !== 'undefined' && typeof PoliShare.init === 'function') {
    PoliShare.init({
      tool: 'healing-tracker',
      mount: '#resultsSection',

      getState: function () {
        var type = val('procedureType');
        var date = val('procedureDate');
        if (!type || !date) return null;
        var s = { type: type, date: date };
        if (type === 'piercing') {
          s.loc = val('piercingLocation');
          if (!s.loc) return null;
        } else {
          s.size = val('tattooSize');
          if (!s.size) return null;
        }
        return s;
      },

      applyState: function (s) {
        if (!s.type || !s.date) return;
        setVal('procedureType', s.type);
        setVal('procedureDate', s.date);
        if (s.type === 'piercing') setVal('piercingLocation', s.loc);
        else setVal('tattooSize', s.size);
        var btn = document.getElementById('startTracking');
        if (btn) btn.click();
      },

      getCard: function () {
        var header = document.querySelector('#timelineResults .timeline-header');
        var section = document.getElementById('resultsSection');
        if (!header || !section || section.style.display === 'none') return null;
        var h3 = header.querySelector('h3');
        var ps = header.querySelectorAll('p');
        var name = h3 ? h3.textContent.trim() : window.t('share.fallbackTitle');
        var day = ps[0] ? ps[0].textContent.trim() : '';
        var typical = ps[1] ? ps[1].textContent.replace(/^Typical[^:]*:\s*/, '').trim() : '';
        var d = [[window.t('share.tracking'), name]];
        if (day) d.push([window.t('share.progress'), day]);
        if (typical) d.push([window.t('share.typicalHealing'), typical]);
        return { t: name + (day ? ': ' + day.toLowerCase() : ''), d: d };
      },
    });
  }
})();
