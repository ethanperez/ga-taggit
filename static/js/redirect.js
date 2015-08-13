$(document).ready(function() {
  var popupWindow = window.open(
      chrome.extension.getURL("static/index.html"),
      "exampleName",
      "width=500,height=600"
  );
  window.close();
})