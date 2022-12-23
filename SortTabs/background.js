chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "sortURLs") {
    var sortedURLs = request.urls.sort();
    sendResponse({
      sortedURLs: sortedURLs
    });
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({}, function(tabs) {
    var urlArray = [];
    for (var i = 0; i < tabs.length; i++) {
      urlArray.push(tabs[i].url);
    }
    chrome.runtime.sendMessage({
      action: "sortURLs",
      urls: urlArray
    }, function(response) {
      chrome.runtime.sendMessage({
        action: "getURLs",
        urls: response.sortedURLs
      });
    });
  });
});