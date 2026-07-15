// Root loader script for the site.
// Loads local scripts from `assets/scripts/` or falls back to `js/` folder.
(function(){
  // Ensure GSAP and other CDN libraries are ready
  function waitForDependencies(callback) {
    let checkInterval;
    let safetyTimeout;
    let done = false;

    function trigger() {
      if (done) return;
      done = true;
      clearInterval(checkInterval);
      clearTimeout(safetyTimeout);
      callback();
    }

    checkInterval = setInterval(() => {
      if (typeof gsap !== 'undefined' && typeof THREE !== 'undefined') {
        trigger();
      }
    }, 50);

    safetyTimeout = setTimeout(trigger, 5000);
  }

  const localOrder = [
    'assets/scripts/loader.js',
    'assets/scripts/cursor.js',
    'assets/scripts/scroll.js',
    'assets/scripts/animations.js',
    'assets/scripts/script.js'
  ];

  const fallbackOrder = [
    'js/loader.js',
    'js/cursor.js',
    'js/scroll.js',
    'js/animations.js',
    'js/script.js'
  ];

  function loadScriptsSequentially(scripts) {
    let index = 0;

    function loadNext() {
      if (index >= scripts.length) return;
      
      const src = scripts[index];
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      
      s.onerror = () => {
        console.warn('Failed to load ' + src);
        index++;
        loadNext();
      };
      
      s.onload = () => {
        index++;
        loadNext();
      };
      
      document.body.appendChild(s);
    }

    loadNext();
  }

  // Wait for dependencies, then load our scripts
  waitForDependencies(() => {
    loadScriptsSequentially(localOrder);
  });
})();
