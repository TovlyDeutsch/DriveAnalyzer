// this function both renders the files counts on tab 1 and seperates owned files from shared files
function fileCount(files) {

  var seperatedFiles = getFilesNotOwned(files)
  var filesOwned = seperatedFiles[0]
  var filesNotOwned = seperatedFiles[1]

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

function getFilesNotOwned(files) {
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

  return [filesOwned, filesNotOwned]
}

// creates piechart
function displayGraph(files) {

  // initialize to seperate arrays for the two different pie chart views
  var numberArray = [['Type', 'Number']]
  var quotaArray = [['Type', 'Quota Used']]

  // track which file type is currently being iterated through
  var increment = 1

  // create array of files seperated based on type
  var seperatedArray = seperateBy(files, 'type')
  // increment through array based on type
  for (var type in seperatedArray) {
    // add number of files to numberArray
    numberArray.push([type, seperatedArray[type].files.length])
    // initialize quota used by type to 0
    quotaArray.push([type, 0])

    // look through files in each file type
    for (var i in seperatedArray[type].files) {
      // if file uses some quota
      if (seperatedArray[type].files[i].quotaBytesUsed != 0) {
        // increment total quota used by file type
        quotaArray[increment][1] += parseInt(seperatedArray[type].files[i].quotaBytesUsed)
      }
    }
    increment += 1
  }

  // initialize variable to track which data to use
  var current = numberArray

  // the remaining lines below are directly taken and adapted from https://developers.google.com/chart/interactive/docs/gallery/piechart
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    // stores current chosen data to be displayed
    var data = google.visualization.arrayToDataTable(
       current
      );
    // set chart title
    var options = {
      title: 'Distribution of file types'
    };

    //
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    // draws chart
    chart.draw(data, options);
    $('#graph-loader').remove()

    $('#piechart-button').on('click', function() {
      
    })
  }

}
