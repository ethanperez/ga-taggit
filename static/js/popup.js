// Global variable of array to
// hold viewable keys/values
var viewableArray = [];

// On load:
//  Pull keys/values from localStorage
//  Check if the key is shown on form
//  Format key/value 
$(document).ready(function() {
  // Get the storage values
  chrome.storage.sync.get(null, function(items) {
    var values,
        tagName,
        formType,
        keys,
        defaultKey;
    $.each(items, function(key, value) {
      values = JSON.parse(value);
      tagName = values["tagName"];
      formType = values["type"];
      keys = values["keys"];
      defaultKey = values["defaultKey"];
      
      // check if shown
      if (values["is_shown"]) {
        viewableArray.push({"tagName": tagName,
                           "type": formType});
      } else {
        return;
      }

      // check for text or dd
      switch(formType) {
        case "dd":
          $('#tagForm').append('<div class="form-group">' +
            '<label class="col-xs-4 control-label text-right">' + tagName + '</label>' +
            '<div class="col-xs-8">' +
              '<select class="form-control" id="dd-' + tagName + '">' +

              '</select>' +
            '</div>' +
            '</div>')

          // add keys in
          $.each(keys, function(key, value) {
            $('#dd-' + tagName).append('<option value="' + value + '">' + value + '</option>');
          document.getElementById('dd-' + values["tagName"]).value = defaultKey;
          });
          break;

        case "text":
          $('#tagForm').append('<div class="form-group">' +
            '<label class="col-xs-4 control-label text-right">' + tagName + '</label>' +
            '<div class="col-xs-8">' +
              '<input class="form-control" id="text-' + tagName + '">' +
            '</div>' +
            '</div>')
      }
      
    });
  });
});


// On click of execution script
//  Create encode search URI
//  Add the content area to a hidden <p>
//  Switch out the search links
//  Add to completed textare
$('#sMTM').click(function() {
  // Clear the formatted area, string, and <p>
  $('#formattedHTML').val("");
  $('.htmlTemplate').text("");
  var htmlString = "";

  // Build URI
  var searchURI = "?";

  for (var i = 0; i < viewableArray.length; i++) {
    // Separate values for dd or textfield
    switch(viewableArray[i]["type"]) {
      case "dd":
        if (viewableArray[i]["tagName"] !== "kmi"){
          var e = document.getElementById('dd-' + viewableArray[i]["tagName"]);
          var selected = e.options[e.selectedIndex].value;
          // concat to string
          searchURI += encodeURI("&" + (viewableArray[i]["tagName"] + "=" + selected));
        } else {
          // This is form KMI specifically
          // HARD CODED IN - NEEDS TO CHANGE
          var e = document.getElementById('dd-' + viewableArray[i]["tagName"]);
          var selected = e.options[e.selectedIndex].value;
          // concat to string
          searchURI += ("&" + (viewableArray[i]["tagName"] + "=" + selected));
        }
        break;

      case "text":
        var e = document.getElementById('text-' + viewableArray[i]["tagName"]).value;
        // concat to string
        searchURI += encodeURI("&" + (viewableArray[i]["tagName"] + "=" + e));
        break;
    }

    // // CHECK FOR KMI
    // console.log(viewableArray[i]["tagName"]);
    // if (viewableArray[i]["tagName"] == "kmi") {
    //   var e = document.getElementById('dd-kmi');
    //   var selected = e.options[e.selectedIndex].value;
    //   searchURI += ("&kmi=" + selected);
    // }
  }

  // Find all the links
  // var $parsed = $.parseHTML(document.getElementById('contentArea').value)
  htmlString = document.getElementById('contentArea').value;
  // var $anchors = $htmlString.find('a');

  // console.log($parsed);
  $('.htmlTemplate').append(htmlString);
  
  // Get all the links now
  var linkObjects = document.links;
  for (var i = 0; i < linkObjects.length; i++) {

    // Filter out correct links
    if ((linkObjects[i].search).startsWith('?')) {
      linkObjects[i].search = searchURI;
    }
  }


  // Add it to the formatted box
  $('#formattedHTML').val($('.htmlTemplate').html());
});

