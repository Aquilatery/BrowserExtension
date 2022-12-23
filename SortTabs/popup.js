chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "getURLs") {
    var urlList = document.getElementById("url-list");
    urlList.innerHTML = "";
    for (var i = 0; i < request.urls.length; i++) {
      var li = document.createElement("li");
      li.textContent = request.urls[i];
      urlList.appendChild(li);
    }
  }
});

window.onload = function() {
  chrome.tabs.query({}, function(tabs) {
    var urlArray = [];
    for (var i = 0; i < tabs.length; i++) {
      urlArray.push(tabs[i].url);
    }
    urlArray.sort();
    chrome.runtime.sendMessage({
      action: "getURLs",
      urls: urlArray
    });
  });
};