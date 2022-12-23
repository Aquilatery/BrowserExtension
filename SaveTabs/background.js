chrome.tabs.query({}, function(tabs) {
  var urlList = "";
  for (var i = 0; i < tabs.length; i++) {
    urlList += tabs[i].url + "\n";
  }
  var blob = new Blob([urlList], {type: "text/plain"});
  chrome.downloads.download({
    url: URL.createObjectURL(blob),
    filename: "tab-urls.txt"
  });
});