//to do fix try agian button
// don't remove row on failure
// This function creates the html table rows for tab 2
function listFiles(files, owner) {
  var fileTable = ''
  // iterate over files, adding each info about each to individual rows
  for (var i = 0; i < files.length; i++) {
    if (files[i].ownedByMe === true || owner === true) {
      fileTable += '\
      <tr data-link=' + files[i].webViewLink + ' data-id=' + files[i].id + '>\
      <td class="mdl-data-table__cell--non-numeric">' + files[i].name + '</td>\
      <td class="narrow">' + files[i].quotaBytesUsed + '</td>\
      <td class="narrow">' + new Date(Date.parse(files[i].createdTime)).toDateString() + '</td>\
      </tr>'
    }
  }

  return fileTable
}

function bindEventHandlers() {
  // highlight and select on click
  $( "#file-list tbody" ).on( "click", "tr", function() {
    // if a group header is clicked toggle visibility for that group
    if ($(this).hasClass('group-header-row')) {
      $(this).nextUntil('.group-header-row').toggleClass('hidden')
      var $cell = $(this).children(':first')
      var words = $cell.html().split(' ')
      // toggle carrot direction
      if (words.pop() === '▼') {words.push('▶')}
      else {words.push('▼')}
      // render group header text
      $cell.html(words.join(' '))
    }
    // else highlight file row
    else {
      $( this ).toggleClass('selected')
      // only enable delete button if there is at least one row selected
      if ($('.selected').length > 0 ){
        $('#delete-button').prop('disabled', false)
      }
      else {
        $('#delete-button').prop('disabled', true)
      }
    }
  })

  // open file on double click
  $( "#file-list tbody" ).on( "dblclick", "tr", function() {
    window.open($( this ).attr('data-link'), '_blank')
  })

  $('#delete-button').on('click', function() {
    trashFiles()
  })

  // group files on radio button change
  $('input[type=radio][name=options]').change(function() {
    $('button').prop('disabled', true)
    $('input').prop('disabled', true)
    $('#delete-loader').css('display', 'inline-block')
    var files = JSON.parse(sessionStorage.getItem('files'))
    // none grouping selected
    if (document.getElementById('option-1').checked) {
      document.getElementById('table-slot').innerHTML = listFiles(getFilesNotOwned(files)[0])
      $('input').prop('disabled', false)
      $('label').removeClass('is-disabled')
      $('#delete-loader').css('display', 'none')
      return
    }
    // type grouping selected
    else if (document.getElementById('option-2').checked) {
      var seperatedFiles = seperateBy(files, 'type')
      var owner = false
    }
    // owner grouping selected
    else if (document.getElementById('option-3').checked) {
      var seperatedFiles = seperateBy(files, 'owner')
      var owner = true
    }

    var tableString = ''
    // iterate over groups
    for (var group in seperatedFiles) {
      var img = ''
      // add group header
      if (owner === true) {
        img = '<img src="' + seperatedFiles[group].ownerPhoto + '"/> '
      }
      tableString += '\
      <tr class="group-header-row mdl-shadow--2dp">\
        <td class="group-header mdl-data-table__cell--non-numeric">' + img + group + ' ▼</td>\
        <td class="group-header mdl-data-table__cell--non-numeric">\
        </td>\
        <td class="group-header mdl-data-table__cell--non-numeric">\
        </td>\
      </tr>'
      // add group files
      tableString += listFiles(seperatedFiles[group].files, owner)
    }
    // render list
    document.getElementById('table-slot').innerHTML = tableString
    // enable radio buttons
    $('input').prop('disabled', false)
    $('label').removeClass('is-disabled')
    $('#delete-loader').css('display', 'none')
  });

  // enable radio buttons
  $('input').prop('disabled', false)
  $('label').removeClass('is-disabled')
} // end bind event handlers

// function below adapted from http://stackoverflow.com/a/14696535/4159228
// this function seperates an array of objects by a property
function seperateBy(files, property) {
  var seperatedFiles = files.reduce(function(fileArray, file) {
    var prop = property === 'type' ? getType(file) : file.owners[0].emailAddress
    // exclude files not owned by me except when grouping by owner
    if (file.ownedByMe === true || property === 'owner') {
      var photoLink = typeof file.owners[0].photoLink === 'undefined' ? '' : file.owners[0].photoLink
      if (!fileArray[prop]) {fileArray[prop] = {files: [], ownerPhoto: photoLink}}
      fileArray[prop].files.push(file)
    }
    return fileArray
  }, {})
  return seperatedFiles
}

function getType(file) {
  if (typeof file.fileExtension !== 'undefined' && file.fileExtension !== '') {
    return file.fileExtension.toUpperCase()
  }
  else {
    // handle Google's file types which don't have a .fileExtension
    switch (file.mimeType) {
      case 'application/vnd.google-apps.audio':
        return 'Audio'
      case 'application/vnd.google-apps.document':
        return	'Google Docs'
      case 'application/vnd.google-apps.drawing':
        return	'Google Drawing'
      case 'application/vnd.google-apps.file':
        return 'Google Drive file'
      case 'application/vnd.google-apps.folder':
        return	'Google Drive folder'
      case 'application/vnd.google-apps.form':
        return	'Google Forms'
      case 'application/vnd.google-apps.fusiontable':
        return	'Google Fusion Tables'
      case 'application/vnd.google-apps.map':
        return	'Google My Maps'
      case 'application/vnd.google-apps.photo':
        return 'Photos'
      case 'application/vnd.google-apps.presentation':
        return	'Google Slides'
      case 'application/vnd.google-apps.script':
        return	'Google Apps Scripts'
      case 'application/vnd.google-apps.sites':
        return	'Google Sites'
      case 'application/vnd.google-apps.spreadsheet':
        return	'Google Sheets'
      case 'application/vnd.google-apps.unknown':
        return 'Unknown'
      case 'application/vnd.google-apps.video':
        return 'Videos'
      case 'application/pdf':
        return 'PDF'
    }
  }
}

var trashFiles = function trashFiles(previouslySelected) {
  $('#delete-loader').css('display', 'inline-block')
  // if previouslySelected is undefined, then this is a standard trash command
  if (previouslySelected === undefined) {
    var trash = true
    var selected = $('.selected')
    // line below adapted from http://stackoverflow.com/a/25416276/4159228
    var stringArray = selected.map(function (index, element) {return $(element).prop('outerHTML')}).get().join()
    // store selected rows as a string in sessionStorage
    sessionStorage.setItem('selected', stringArray)
  }
  // else, if previouslySelected exists, this is an undo command
  else {
    var trash = false
    var selected = previouslySelected
    var actionText = ''
  }
  var batchRequest = gapi.client.newBatch()
  // iterate over selected files, adding each file deletion to the batch request
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
    timeout: 4000,
    actionHandler: trashFiles,
    actionText: ''
  }

  var error = false

  // execute batch request
  batchRequest.then(function(response) {
    var results = response.result
    // iterate over results checking for errors
    for (var prop in results) {
      if(results[prop].status !== 200) {
        data.message += results[prop].result.error.message + ', '
        error = true
        delete data.actionHandler
        delete data.actionText
      }
    } // end for loop
    if (error === false) {
      data.message = trash === true ? 'Success' : 'Done'
      data.actionText = trash === true ? 'Undo' : ''
      data.actionHandler = trash === true ? Undo : ''
      // remove selected rows if delete command

    }
    snackbarContainer.MaterialSnackbar.showSnackbar(data)
    if (trash === true && error === false) {
     $('.selected').addClass('trash')
     setTimeout(function(){$('.trash').remove()}, 4000)
    }
    // display trashed rows if undo command
    else {
      $('.trash').removeClass('trash')
    }
    $('.selected').removeClass('selected')
    $('#delete-loader').css('display', 'none')
  }, // end on success function
  function(response){
    data.message += results[prop].result.error.message + ', '
    error = true
    console.log(JSON.parse(response.body).error.message)
  })

} // end trashfiles

var Undo = function Undo() {
  var selectedString = sessionStorage.getItem('selected')

  trashFiles($('<div/>').html(selectedString).contents())
}
