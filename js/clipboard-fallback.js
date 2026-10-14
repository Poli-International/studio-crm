// Opened from another device (http://the-server:3000) the browser gives a page no
// clipboard, so every Copy button in the tools failed. Copy the old way instead.
// The server adds this file to every tool page.
if (!navigator.clipboard) {
  navigator.clipboard = {
    writeText: function (text) {
      return new Promise(function (resolve, reject) {
        var box = document.createElement('textarea');
        box.value = text;
        box.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
        document.body.appendChild(box);
        box.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        box.remove();
        if (ok) resolve(); else reject(new Error('copy not allowed'));
      });
    }
  };
}
