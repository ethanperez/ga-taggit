// Global for count of accordians
var accordions = 0;

$(document).ready(function() {
  accordions = $('.panel').size();

  // Now we check to load!
  chrome.storage.sync.get(null, function(items) {
    var values;
    $.each(items, function(key, value) {
      values = JSON.parse(value);
      console.log(values);

        // Variables for each accordian
        var thisAccordion = accordions++;
        var thisTagName = values["tagName"];
        var tagName = values["tagName"];
        var headingId = 'heading-' + thisTagName;
        var collapseId = 'collapse-' + thisTagName;

        $('#accordion').append('<div class="panel panel-default" id="panel-' + thisTagName + '">' +
            '<div class="panel-heading" role="tab" id="' + headingId +
              '"> <h4 class="panel-title">' +
                '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + collapseId + '" aria-expanded="false" aria-controls="' + collapseId +
                  '">' + thisTagName +
                '</a>' +
              '</h4>' +
            '</div>' +
            '<div id=' + collapseId + ' class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + headingId + '">' +
              '<div class="panel-body">' +
                '<div class="row">' +
                  '<div class="col-xs-6">' +
                    '<h4>Tag Settings</h4>' +
                    '<div class="checkbox">' +
                      '<label>' +
                        '<input type="checkbox" id="show-' + thisTagName +'"> Show in form' +
                      '</label>' +
                    '</div>' +

                    '<div class="form-group">' +
                      '<label for="type-' + thisTagName + '">Type of Content</label>' +
                      '<select class="form-control" id="type-' + thisTagName + '">' +
                        '<option class="type-' + thisTagName + '" value="dd">Dropdown</option>' +
                        '<option class="type-' + thisTagName + '" value="text">Text</option>' +
                      '</select>' +
                    '</div>' +

                    '<div class="form-group">' +
                      '<label for="defaultKey-' + thisTagName + '">Default Key</label>' +
                      '<select class="form-control" id="defaultKey-' + thisTagName + '">' +
                      '</select>' +
                    '</div>' +

                    '<button type="button" class="btn btn-danger deleteBtn" id="delete-' + thisTagName + '">Delete</button>'+

                  '</div>' +

                  '<div class="col-xs-6">' +
                    '<h4>Tag Values</h4>' +
                    '<div class="input-group">' +
                      '<input type="text" class="form-control" id="createValue~' + thisTagName +'" placeholder="e.g., ga_email, ga_partner, etc.">' +
                      '<span class="input-group-btn">' +
                        '<button class="btn btn-primary btnCreateValue" type="button" id="btnCreateValue~' + thisTagName +'">Create</button>' +
                      '</span>' +
                    '</div>' +
                    '<br>' +
                    '<ul class="list-group" id="values-' + thisTagName +'">' +
                    '</ul>' +
                  '</div>' +

                '</div>' +
              '</div>' +
            '</div>' +
          '</div>')

        // Set Preferences
        document.getElementById('show-' + values["tagName"]).checked = values["is_shown"];
        document.getElementById('type-' + values["tagName"]).value = values["type"];
        // set keys
        $.each(values["keys"], function(key, value) {
          // Append to list
          $('#values-' + tagName).append('<li class="list-group-item values-' + tagName +'" id="' + tagName + '-' + value + '">' + value + '</li>');

          // Append to default keys
          $('#defaultKey-' + tagName).append('<option class="' + value + '" value="' + value + '">' + value + '</option>')
        });
        document.getElementById('defaultKey-' + values["tagName"]).value = values["defaultKey"];
    });
  });
});

$('#btnCreateTag').click(function() {
  // Validate for text
  if ($('#tagFormName').val() == "") {
    $('.alert-warning').removeClass('hidden');
    return;
  } else {
    $('.alert-warning').addClass('hidden');
    $('.alert-success').addClass('hidden');

  }

  // Variables for each accordian
  var thisAccordion = accordions++;
  var thisTagName = $('#tagFormName').val();
  var headingId = 'heading-' + thisTagName;
  var collapseId = 'collapse-' + thisTagName;

  $('#accordion').append('<div class="panel panel-default" id="panel-' + thisTagName + '">' +
      '<div class="panel-heading" role="tab" id="' + headingId +
        '"> <h4 class="panel-title">' +
          '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + collapseId + '" aria-expanded="false" aria-controls="' + collapseId +
            '">' + thisTagName +
          '</a>' +
        '</h4>' +
      '</div>' +
      '<div id=' + collapseId + ' class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + headingId + '">' +
        '<div class="panel-body">' +
          '<div class="row">' +
            '<div class="col-xs-6">' +
              '<h4>Tag Settings</h4>' +
              '<div class="checkbox">' +
                '<label>' +
                  '<input type="checkbox" id="show-' + thisTagName +'"> Show in form' +
                '</label>' +
              '</div>' +

              '<div class="form-group">' +
                '<label for="type-' + thisTagName + '">Type of Content</label>' +
                '<select class="form-control" id="type-' + thisTagName + '">' +
                  '<option class="type-' + thisTagName + '" value="dd">Dropdown</option>' +
                  '<option class="type-' + thisTagName + '" value="text">Text</option>' +
                '</select>' +
              '</div>' +

              '<div class="form-group">' +
                '<label for="defaultKey-' + thisTagName + '">Default Key</label>' +
                '<select class="form-control" id="defaultKey-' + thisTagName + '">' +
                '</select>' +
              '</div>' +

              '<button type="button" class="btn btn-danger deleteBtn" id="delete-' + thisTagName + '">Delete</button>'+
            '</div>' +

            '<div class="col-xs-6">' +
              '<h4>Tag Values</h4>' +
              '<div class="input-group">' +
                '<input type="text" class="form-control" id="createValue~' + thisTagName +'" placeholder="e.g., ga_email, ga_partner, etc.">' +
                '<span class="input-group-btn">' +
                  '<button class="btn btn-primary btnCreateValue" type="button" id="btnCreateValue~' + thisTagName +'">Create</button>' +
                '</span>' +
              '</div>' +
              '<br>' +
              '<ul class="list-group" id="values-' + thisTagName +'">' +
              '</ul>' +
            '</div>' +

          '</div>' +
        '</div>' +
      '</div>' +
    '</div>')
});

$('body').delegate('.btnCreateValue', 'click', function() {
  var tagName = $(this).attr('id').split("~")[1];
  var valueId = 'createValue~' + tagName;
  var newKeyValue = document.getElementById(valueId).value;

  // Append to list
  $('#values-' + tagName).append('<li class="list-group-item values-' + tagName +'" id="' + tagName + '-' + newKeyValue + '">' + newKeyValue + '</li>');

  // Append to default keys
  $('#defaultKey-' + tagName).append('<option class="' + tagName + '" value="' + newKeyValue + '">' + newKeyValue + '</option>')
});

// On save
$('#save').click(function saveChanges() {
  // Clear storage
  chrome.storage.sync.clear();

  // Map over each value
  $('.panel').find('.panel-heading').map(function() {
    // Variables to store info
    var tagName,
        type,
        is_shown,
        keys = [],
        defaultKey,
        panel,
        jsonObject,
        dataToStore;

    tagName = $(this).attr('id').split("-")[1];
    console.log(tagName);

    // is_shown
    is_shown = $('#show-' + tagName).prop("checked");
    console.log($('#show-' + tagName).prop("checked"));
    // type
    type = $('#type-' + tagName).val();
    console.log($('#type-' + tagName).val());
    // default key
    defaultKey = $('#defaultKey-' + tagName).val();
    console.log($('#defaultKey-' + tagName).val())
    // values
    $('.values-' + tagName).map(function() {
      keys.push($(this).text());
      console.log($(this).text());
    });

    // Add to JSON object
    jsonObject = {
      "tagName": tagName,
      "is_shown": is_shown,
      "type": type,
      "defaultKey": defaultKey,
      "keys": keys
    }

    // Save to local storage!
    dataToStore = JSON.stringify(jsonObject);
    var obj = {};
    obj[tagName] = dataToStore;
    chrome.storage.sync.set(obj, function() {
      // Notify that we saved.
      $('.alert-success').removeClass('hidden');
    });
  });
});

$('body').delegate('.deleteBtn', 'click', function () {
  // Get tag name
  var tagName = $(this).attr('id').split("-")[1];
  console.log(tagName);
  $('#panel-' + tagName).hide('slow');
  chrome.storage.sync.remove(tagName, function() {
    location.reload();
  });
});