// This code and comments is taken directly from Google Drive API documentation quickstart //(https://developers.google.com/drive/v3/web/quickstart/js) as a base mini-library

var CLIENT_ID = '363872304328-t3h8sa4icpbaj9lkrpraf5ujoidtsc6h.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

/**
* Check if current user has authorized this application.
*/
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
  }

  /**
  * Handle response from authorization server.
  *
  * @param {Object} authResult Authorization result.
  */
  function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
      authorizeDiv.style.display = 'none';
      $('.mdl-grid').style('display', 'inline-block')
      loadDriveApi();
    } else {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
      authorizeDiv.style.display = 'block';
      // line below added by Tovly
      $('.mdl-grid').hide()
    }
  }

  /**
  * Initiate auth flow in response to user clicking authorize button.
  *
  * @param {Event} event Button click event.
  */
  function handleAuthClick(event) {
    gapi.auth.authorize(
      {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
      handleAuthResult);
      return false;
    }

    /**
    * Load Drive API client library.
    */
    function loadDriveApi() {
      gapi.client.load('drive', 'v3', getFiles);
    }
