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
      <tr>\
        <td class="mdl-data-table__cell--non-numeric">' + files[i].name + '</td>\
        <td class="narrow">' + files[i].quotaBytesUsed + '</td>\
        <td class="narrow">' + files[i].createdTime + '</td>\
      </tr>'
      }
  }


  fileTable += '</tbody></table>'
  document.getElementById('content2').innerHTML = fileTable

  $( "#file-list tbody" ).on( "click", "tr", function() {
    $( this ).toggleClass('selected');
  });
}
