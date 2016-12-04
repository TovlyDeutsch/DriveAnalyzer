// this function both renders the files counts on tab 1 and seperates owned files from shared files
function fileCount(files) {

  // var fileTypes = [['fileExtension', 'Number of Files'], ['Undefined', 2]
  // for (var i = 0; i < types.length; i++) {
  // if (types.slice(0, i - 1).contains(fileTypes[i].fileExtension)) {

  // }

  // else {
  // 	fileTypes.push([fileTypes[i].fileExtension, 1])
  //}

  var filesNotOwned = []

  // seperate files that are owned from those that are shared into 2 seperate arrays
  var filesOwned = files.filter(function(element){
    if (element.ownedByMe === true) {
      return true
    }
    else {
      filesNotOwned.push(element)
    }
  })

  // render file counts
  document.getElementById('file-counts').innerHTML = '<p id="file-count" class="mdl-typography--headline">\
  Files You Own: ' + filesOwned.length + '</p>\
  <p id="file-count" class="mdl-typography--headline">\
  Files Shared With You: ' + filesNotOwned.length +
  '</p>\
  <p id="file-count" class="mdl-typography--headline">\
  Total: ' + files.length +
  '</p>'

  return [filesOwned, filesNotOwned]
}

function displayGraph(files) {
  var types = []
  for (var i = 0; i < files.length; i++) {
    types.push(files[i].fileExtension)
  }

  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {

    var data = google.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Work',     11],
      ['Eat',      2],
      ['Commute',  2],
      ['Watch TV', 2],
      ['Sleep',    7]
    ]);

    var options = {
      title: 'Distribution of file types'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
  }
}
