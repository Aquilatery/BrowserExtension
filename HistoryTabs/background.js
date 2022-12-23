chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.history.search({text: ''}, function(results) {
    var historyItems = '';
    for (var i = 0; i < results.length; i++) {
      var historyItem = '<div><a href="' + results[i].url + '">' + results[i].title + '</a></div>';
      historyItems += historyItem;
    }
    chrome.runtime.sendMessage({history: historyItems});
  });
});