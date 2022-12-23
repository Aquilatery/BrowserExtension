chrome.runtime.onMessage.addListener(function(request) {
  if (request.history) {
    document.getElementById('history-items').innerHTML = request.history;
  }
});