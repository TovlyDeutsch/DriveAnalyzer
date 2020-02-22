// Client ID and API key from the Developer Console
var CLIENT_ID = '363872304328-t3h8sa4icpbaj9lkrpraf5ujoidtsc6h.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCx2v-_ROpl1g_-3OK8nMIWJjtJkqkFkew';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
files = []
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
async function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(async function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    await updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
async function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    lFiles = await getFiles();
    console.log(lFiles)
    // let response = await gapi.client.drive.files.list({q: `'${lFiles[0].id}' in parents`})
    console.log('fparent', await getFolderSize(lFiles[0].id))
    // for (var i = 0; i < lFiles.length; i++) {
    //   var file = lFiles[i];
    //   appendPre(file.name + ' (' + file.id + ')');
    // }
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

async function getFolderSize(folderId) {
  let response = await gapi.client.drive.files.list({
    q: `'${folderId}' in parents`,
    fields: "nextPageToken, files(quotaBytesUsed, ownedByMe)"
  })
  let files = response.result.files
  let totalFolSize = files.reduce((totalSize, file) => totalSize + parseInt(file.quotaBytesUsed), 0)
  // console.log(parseInt(totalFolSize))
  return totalFolSize / 1e+6
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

async function getFiles() {
  // 1000 is maximum retrieval size
  // adapted from Google Drive API documentation quickstart //(https://developers.google.com/drive/v3/web/quickstart/js)
  // add shared with me = false, currently not working

  let nextPageToken = null;
  let files = [];
  let numRequests;
// TODO abstract streaming for nextpage thing
  do {
    parameters = {
      'pageSize': 1,
      // 'fields': "nextPageToken, files(id, name)",
      // 'fields': "nextPageToken, files(\
      // id, name, createdTime, fileExtension, quotaBytesUsed, owners, ownedByMe, webViewLink, mimeType)",
      'spaces': 'drive',
      // 'q': "mimeType='image/jpeg'",
      q: "mimeType = 'application/vnd.google-apps.folder'",
    }
  
    // if not first request, set the pageToken to the next page
    if (nextPageToken) { parameters.pageToken = nextPageToken}
  
    // adapted from Google Drive API documentation quickstart (https://developers.google.com/drive/v3/web/quickstart/js)
    numRequests++
    
    try {
      let response = await gapi.client.drive.files.list(parameters);
      files = files.concat(response.result.files)
    } catch(err) {
      alert(err); // TypeError: failed to fetch
    }
    // use of promises adapted from https://developers.google.com/api-client-library/javascript/features/promises
    // await request(function(response) {
    //   files = files.concat(response.result.files)
    //   console.log(files)
    // },
    // // catch and display possible errors
    // function(response){
    //   console.log('err')
    // })
    
  } while (nextPageToken && numRequests < 10);
  return files;
}
/**
 * Print files.
 */
// function listFiles() {
//   gapi.client.drive.files.list({
//     'pageSize': 1000,
//     'fields': "nextPageToken, files(id, name)"
//   }).then(function(response) {
//     appendPre('Files:');
//     var files = response.result.files;
//     if (files && files.length > 0) {
//       for (var i = 0; i < files.length; i++) {
//         var file = files[i];
//         appendPre(file.name + ' (' + file.id + ')');
//       }
//     } else {
//       appendPre('No files found.');
//     }
//   });
// }