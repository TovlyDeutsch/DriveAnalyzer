function fileCount(files) {
  var fileString = ''
  for (var i = 0; i < files.length; i++) {
    fileString += files[i].name
  }
  $('.loader').remove()
  document.getElementById('file-count').innerHTML = files.length
}

function displayGraph(files) {
  
}
