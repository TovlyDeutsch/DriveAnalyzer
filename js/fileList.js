// This function list the files in tab 2 for sorting and grouping
function listFiles(files) {
  console.log(files[0])
  var fileTable = '<table id="file-list" class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">\
  <thead>\
  <tr>\
  <th class="mdl-data-table__cell--non-numeric">File Name</th>\
  <th class="narrow">Quota Used</th>\
  <th class="narrow">Date Created</th>\
  </tr>\
  </thead>\
  <tbody>'

  // iterate over files, adding each info about each to individual rows
  for (var i = 0; i < files.length; i++) {
    if (files[i].ownedByMe === true) {
      fileTable += '\
      <tr data-link=' + files[i].webViewLink + ' data-id=' + files[i].id + '>\
      <td class="mdl-data-table__cell--non-numeric">' + files[i].name + '</td>\
      <td class="narrow">' + files[i].quotaBytesUsed + '</td>\
      <td class="narrow">' + new Date(Date.parse(files[i].createdTime)).toDateString() + '</td>\
      </tr>'
    }
  }


  fileTable += '</tbody></table>'
  document.getElementById('table-slot').innerHTML = fileTable
  bindEventHandlers()
}

function bindEventHandlers() {
  $( "#file-list tbody" ).on( "click", "tr", function() {
    $( this ).toggleClass('selected');
  });

  $( "#file-list tbody" ).on( "dblclick", "tr", function() {
    console.log('test')
    window.open($( this ).attr('data-link'), '_blank');
  });

  $('#delete-button').on('click', function() {
    trashFiles()
  })
}

var trashFiles = function trashFiles(previouslySelected) {
  // if previouslySelected exists, this is an undo command
  if (previouslySelected === undefined) {
    var trash = true
    var selected = $('.selected')
    localStorage['selected'] = JSON.stringify(selected)
  }
  else {
    var trash = false
    var selected = previouslySelected
  }
  var batchRequest = gapi.client.newBatch()
  // iterate over selected files
  for (var j = 0; j < selected.length; j++) {
    batchRequest.add(gapi.client.drive.files.update(
      {
        'fileId': selected[j].getAttribute('data-id'),
        'trashed': trash
      }
    ));
  } // end for loop

  // base info for popup alert
  var snackbarContainer = document.getElementById('snackbar')
  var data = {
    message: 'Error: ',
    timeout: 2000,
    actionHandler: trashFiles,
    actionText: 'Try Again'
  }

  var error = false

  // execute batch request
  batchRequest.then(function(response) {
      console.log(response)
      var results = response.result
      for (var k = 0; k < results.length; k++) {
        if(results[k].status !== '200') {
          data.message += results[k].result.error.message + ', '
          error = true
        }
      }
      if (error === false) {
        data.message = 'Success'
        data.actionText = 'Undo'
        data.actionHandler = Undo
      }
      snackbarContainer.MaterialSnackbar.showSnackbar(data)
      $('.loader').remove()
    }, // end on success function
    function(response){
      console.log(JSON.parse(response.body).error.message)
    })

  } // end trashfiles

  var Undo = function Undo() {
    trashfiles(JSON.parse(localStorage['selected']))
  }
