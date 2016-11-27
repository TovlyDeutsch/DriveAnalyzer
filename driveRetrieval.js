files = []

// makes a request to Google Drive API for files
function getFiles(nextPageToken) {
  // 1000 is maximum retrieval size
  // adapted from Google Drive API documentation quickstart //(https://developers.google.com/drive/v3/web/quickstart/js)
  parameters = {
    'pageSize': 1000,
    'fields': "nextPageToken, files(id, name)"
  }

  // if not first request, set the pageToken to the next page
  if (nextPageToken) { parameters.pageToken = nextPageToken}

  // adapted from Google Drive API documentation quickstart (https://developers.google.com/drive/v3/web/quickstart/js)
  var request = gapi.client.drive.files.list(parameters)

  request.then(function(response){
    files = files.concat(response.result.files)
    // if there is a new nextPageToken, make a new request (recursively)
    if (response.result.nextPageToken) {
      getFiles(response.result.nextPageToken)
    }
    // else, if there are no more files to retrieve, print files
    else {
        var fileString = ''
        for (var i = 0; i < files.length; i++) {
          fileString += files[i].name
        }
        document.getElementById('file-count').innerHTML = files.length
    }
  })

} // end getFiles()
