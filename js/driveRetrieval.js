/* files is a global variable because getFiles runs recursively,
if it was local to getFiles(), it would be overwritten on every recursive call */
var files = []
// makes a request to Google Drive API for files
function getFiles(nextPageToken) {
  // 1000 is maximum retrieval size
  // adapted from Google Drive API documentation quickstart //(https://developers.google.com/drive/v3/web/quickstart/js)
  // add shared with me = false, currently not working
  parameters = {
    'pageSize': 1000,
    'fields': "nextPageToken, files(\
    id, name, createdTime, fileExtension, quotaBytesUsed, owners, ownedByMe, webViewLink, mimeType)",
    'q': "mimeType != 'application/vnd.google-apps.folder' and trashed = false",
    'orderBy': 'createdTime'
  }

  // if not first request, set the pageToken to the next page
  if (nextPageToken) { parameters.pageToken = nextPageToken}

  // adapted from Google Drive API documentation quickstart (https://developers.google.com/drive/v3/web/quickstart/js)
  var request = gapi.client.drive.files.list(parameters)

  // use of promises adapted from https://developers.google.com/api-client-library/javascript/features/promises
  request.then(function(response) {
    files = files.concat(response.result.files)
    // if there is a nextPageToken, make a new request (recursively)
    if (response.result.nextPageToken) {
      getFiles(response.result.nextPageToken)
    }
    // else, if there are no more files to retrieve, render displays
    else {
      sessionStorage.setItem('files', files)
      $('.first-loader').remove()
      fileLists = fileCount(files)
      displayGraph(files)
      // only list files owned by me
      var fileTable = listFiles(fileLists[0])
      sessionStorage.clear()
      sessionStorage.setItem('files', JSON.stringify(files))
      document.getElementById('table-slot').innerHTML = fileTable
      bindEventHandlers()
    }
  },
  // catch and display possible errors
  function(response){
    $('.first-loader').remove()
    document.getElementById('file-counts').innerHTML = JSON.parse(response.body).error.message
  })

} // end getFiles()
