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

  // Pull HTML from content area
  var contentArea = $('#contentArea').val();
  // Append HTML to hidden div
  $('.htmlTemplate').append(contentArea);

  // Build URI
  var searchURI = "?";

  for (var i = 0; i < viewableArray.length; i++) {
    // Separate values for dd or textfield
    switch(viewableArray[i]["type"]) {
      case "dd":
        var e = document.getElementById('dd-' + viewableArray[i]["tagName"]);
        var selected = e.options[e.selectedIndex].value;
        // concat to string
        // but check if first value
        if (i == 0) {
          searchURI += encodeURI((viewableArray[i]["tagName"] + "=" + selected));
        } else {
          searchURI += encodeURI("&" + (viewableArray[i]["tagName"] + "=" + selected));
        }
        break;

      case "text":
        var e = document.getElementById('text-' + viewableArray[i]["tagName"]).value;
        // concat to string
        // but check if first value
        if (i == 0) {
          searchURI += encodeURI((viewableArray[i]["tagName"] + "=" + e));
        } else {
          searchURI += encodeURI("&" + (viewableArray[i]["tagName"] + "=" + e));
        }
        break;
    }
  }

  // Test search
  console.log(searchURI);
  
  // Map through the links
  $('.htmlTemplate').find("a").map(function() {
    // Check for GA URL
    if ($(this).prop('hostname') == 'generalassemb.ly' ||
        $(this).prop('hostname') == 'go.generalassemb.ly' ||
        $(this).prop('hostname') == 'ga.co') {
      
      // Create new href string
      var newHref = $(this).prop('origin') + $(this).prop('pathname') + searchURI;

      // Replace the href value
      $(this).prop('href', newHref);
    }
    
  });


  // Add the new HTML to the formatted field
  $('#formattedHTML').val($('.htmlTemplate').html());
});