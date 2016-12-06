function fileCount(files) {

	var filemime = []
  // var fileTypes = [['fileExtension', 'Number of Files'], ['Undefined', 2]]
  for (var i = 0; i < files.length; i++) {
  	filemime.push(files[i].mimeType)
  	// if (types.slice(0, i - 1).contains(fileTypes[i].fileExtension)) {

  	// }

  	// else {
  	// 	fileTypes.push([fileTypes[i].fileExtension, 1])
  	}

  $('.loader').remove()
  document.getElementById('file-count').innerHTML = filemime
}

function displayGraph(files) {
	// var types = []
	// for (var i = 0; i < files.length; i++) {
	// 	types.push(files[i].fileExtension)
	// }

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
