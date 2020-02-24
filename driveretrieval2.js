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
// files = []
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
    let files = await getFiles();
    // let response = await gapi.client.drive.files.list({q: `'${lFiles[0].id}' in parents`})
    // console.log(lFiles[0])
    let archiveResponse = await gapi.client.drive.files.get({
      fileId: '0B5OxMCWiLhrMWncxdjFjdGc5Y0E',
      fields: "quotaBytesUsed, ownedByMe, parents, mimeType"
      })
    console.log(archiveResponse.result)
    let rootFolderResponse = await gapi.client.drive.files.get({fileId: 'root'})
    let rootFolder = rootFolderResponse.result
    let rootFolderId = rootFolder.id
    let knownIds = {}
    knownIds[rootFolderId] = [rootFolderId]
    rootFolder.children = []
    let folderStructure = {children: {}}
    folderStructure.children[rootFolderId] = rootFolder
    let filedIds = new Set([rootFolderId])
    console.log(files)
    function placeFiles() {
      for (file of files) {
        if (file.name === 'Old Resumes') {
          // console.log(knownIds.hasOwnProperty(file.parents[0]))
          // console.log(!filedIds.has(file.id))
        }
        if (file.parents && knownIds.hasOwnProperty(file.parents[0]) && !filedIds.has(file.id)) {
          // if (file.name === 'Old Resumes') {
          //   console.log('att2')
          // }
          let path = knownIds[file.parents[0]]
          let currentObj = folderStructure
          for (el of path) {
            currentObj = currentObj.children[el]
          }
          if (!currentObj.hasOwnProperty('children')) { currentObj.children = {}}
          currentObj.children[file.id] = file
          // console.log(file.mimeType)
          if (file.mimeType === 'application/vnd.google-apps.folder') {
            knownIds[file.id] = path.concat(file.id)
            // console.log('aded to known', file.id)
          }
        }
      }
    }
    let numAttempts = 0
    while (filedIds.size < files.length && numAttempts < 20) {
      placeFiles()
      numAttempts++
    }
  console.log(folderStructure)
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

function idFetch(fileList) {
  returnObj = {}
  for (file of fileList) {
    returnObj[file.id] = file
  }
  return returnObj
}

function createNestedDirStructure(files) {
  let folderStructure = {}
  let dirLevelToFolder = {}
  for (file of files) {
    let depth = file.parents.length
    if (!dirLevelToFolder.hasOwnProperty(depth)) {dirLevelToFolder[depth] = []}
    dirLevelToFolder[depth].push(file)
  }
  console.log(dirLevelToFolder)
  folderStructure = idFetch(dirLevelToFolder[1])
  for (depthLevel of Object.values(dirLevelToFolder).slice(1)) {
    for (file of depthLevel) {
      chainAttach(folderStructure, file)
    }
  }
  return folderStructure
}

function chainAttach(folderStructure, file) {
  let parents = file.parents
  let currentObj = folderStructure[parents[0]]
  for (parent of parents.slice(1)) {
    if (!currentObj) {return}
    currentObj = folderStructure.children[parent]
  }
  if (!currentObj.hasOwnProperty('children')) {
    currentObj.children = []
  }
  currentObj.children.append(file)
}

async function getFolderSize(folderId) {
  let response = await gapi.client.drive.files.list({
    q: `'${folderId}' in parents`,
    fields: "nextPageToken, files(quotaBytesUsed, ownedByMe, parents, mimeType)"
  })
  let files = response.result.files
  let totalFolSize = files.reduce((totalSize, file) => totalSize + parseInt(file.quotaBytesUsed), 0)
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
  let numRequests = 0;
// TODO abstract streaming for nextpage thing
  do {
    parameters = {
      'pageSize': 1000,
      'fields': "nextPageToken, files(id, name, mimeType, parents)",
      // 'fields': "nextPageToken, files(\
      // id, name, createdTime, fileExtension, quotaBytesUsed, owners, ownedByMe, webViewLink, mimeType)",
      // 'q': "mimeType='image/jpeg'",
      q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false and 'me' in owners",
      // spaces: 'drive',
      // corpora: 'user'
    }
  
    // if not first request, set the pageToken to the next page
    if (nextPageToken) { 
      parameters.pageToken = nextPageToken
    }
  
    // adapted from Google Drive API documentation quickstart (https://developers.google.com/drive/v3/web/quickstart/js)
    numRequests++
    
    try {
      let response = await gapi.client.drive.files.list(parameters);
      files = files.concat(response.result.files)
      if (response.result.nextPageToken != nextPageToken) {
        nextPageToken = response.result.nextPageToken
      }
      else {
        console.log('finished')
        break
      }
      // console.log(response)
    } catch(err) {
      console.log(err) // TypeError: failed to fetch
    }
    console.log(numRequests, nextPageToken)
  } while (nextPageToken != null && numRequests < 500);
  return files;
}

function defDict(type) {
  var dict = {};
  console.log('def')
  return {
      get: function (key) {
      console.log('get')
      if (!dict[key]) {
          console.log('filling')
          dict[key] = type.constructor();
      }
      return dict[key];
      },
      dict: dict
  };
}