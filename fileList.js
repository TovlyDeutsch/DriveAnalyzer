// This function list the files in tab 2 for sorting and grouping
function listFiles(files) {
  var fileTable = '<table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">\
  <thead>\
    <tr>\
      <th class="mdl-data-table__cell--non-numeric">File Name</th>\
      <th>Quota Used</th>\
      <th>Date Created</th>\
      <th>Owner</th>\
    </tr>\
  </thead>\
  <tbody>'

  // iterate over files, adding each info about each to individual rows
  for (var i = 0; i < files.length; i++) {
    fileTable += '\
    <tr>\
      <td class="mdl-data-table__cell--non-numeric">' + files[i].name + '</td>\
      <td>' + files[i].quotaBytesUsed + '</td>\
      <td>' + files[i].createdTime + '</td>\
      <td></td>\
    </tr>'
  }

  fileTable += '</tbody></table>'
  document.getElementById('content2').innerHTML = fileTable
}
