chrome.browserAction.onClicked.addListener(function(tab) {
  var color = getRandomColor();
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor = "' + color + '";'
  });
});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}