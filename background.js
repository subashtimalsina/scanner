chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: "wxcafe",
    singleton: true,
    'innerBounds': {
      'width': 1024,
      'height': 768
    },
    //"resizable": false,
    "state": "fullscreen",
    //frame: "none"
  },
  function(win) {
    if (!win.isFullscreen())
    {
      win.fullscreen();
    }

    win.contentWindow.onkeydown = function(e) {
      if (((e.keyCode == 81 || e.keyCode == 87) && (e.ctrlKey || e.metaKey)) || (e.keyCode == 81 && e.altKey)) {
        e.preventDefault();
      }
    };
  });
});