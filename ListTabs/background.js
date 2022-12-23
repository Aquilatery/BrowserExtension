chrome.tabs.query({}, function(tabs) {
  for (var i = 0; i < tabs.length; i++) {
    console.log(tabs[i].url);
  }
});