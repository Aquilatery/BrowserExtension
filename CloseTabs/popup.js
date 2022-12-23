document.addEventListener('DOMContentLoaded', function() {
  var closeTabsButton = document.getElementById('close-tabs-button');
  closeTabsButton.addEventListener('click', function() {
	chrome.tabs.query({}, function(tabs) {
	  for (var i = 0; i < tabs.length; i++) {
		chrome.tabs.remove(tabs[i].id);
	  }
	  chrome.windows.getAll({populate:true}, function(windows){
		for (var i = 0; i < windows.length; i++) {
		  if (windows[i].id != chrome.windows.WINDOW_ID_NONE) {
			chrome.windows.remove(windows[i].id);
		  }
		}
	  });
	});
  })
});