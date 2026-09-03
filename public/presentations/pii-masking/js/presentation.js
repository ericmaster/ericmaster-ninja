document.addEventListener("DOMContentLoaded", function() {
  // Initialize impress.js
  if (typeof impress === "function") {
    var api = impress();
    api.init();

    // Hook up navigation buttons
    var btnPrev = document.getElementById('btn-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', function() {
        api.prev();
      });
    }

    var btnNext = document.getElementById('btn-next');
    if (btnNext) {
      btnNext.addEventListener('click', function() {
        api.next();
      });
    }

    var btnOverview = document.getElementById('btn-overview');
    if (btnOverview) {
      btnOverview.addEventListener('click', function() {
        api.goto('overview');
      });
    }
  }

  // Fullscreen toggle
  var btnFs = document.getElementById('btn-fullscreen');
  if (btnFs) {
    btnFs.addEventListener('click', function() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function(err) {
          console.error("Error attempting to enable fullscreen:", err);
        });
        btnFs.textContent = "Exit Fullscreen";
      } else {
        document.exitFullscreen();
        btnFs.textContent = "⛶ Pantalla Completa";
      }
    });
  }
});
