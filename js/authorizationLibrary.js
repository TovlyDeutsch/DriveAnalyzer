// This code and comments is the from Google Drive API documentation quickstart (https://developers.google.com/drive/v3/web/quickstart/js) as a base mini-library
// modified or added lines are marked

var CLIENT_ID = '363872304328-t3h8sa4icpbaj9lkrpraf5ujoidtsc6h.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive']; // scope changed by Tovly

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
      $('.none').removeClass('none') // line added by Tovly
      loadDriveApi()
    } else {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
      authorizeDiv.style.display = 'block';
      // line below added by Tovly
      $('.mdl-layout__tab-bar-container').addClass('none')
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
