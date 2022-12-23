var urlList = document.getElementById("url-list");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "getURLs") {
    urlList.innerHTML = "";
    for (var i = 0; i < request.urls.length; i++) {
      var li = document.createElement("li");
      li.textContent = request.urls[i];
      urlList.appendChild(li);
    }
  }
});