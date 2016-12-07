// this function both renders the files counts on tab 1 and seperates owned files from shared files
function fileCount(files) {

  // var fileTypes = [['fileExtension', 'Number of Files'], ['Undefined', 2]
  // for (var i = 0; i < types.length; i++) {
  // if (types.slice(0, i - 1).contains(fileTypes[i].fileExtension)) {

  // }

  // else {
  // 	fileTypes.push([fileTypes[i].fileExtension, 1])
  //}

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

function displayGraph(files) {

  var numberArray = [["Type", "Number"]]
  var quotaArray = [["Type", "Quota Used"]]

  increment = 1
  
  var seperatedArray = seperateBy(files, 'type')
  for (var type in seperatedArray) {
    numberArray.push([type, seperatedArray[type].files.length])
    quotaArray.push([type, 0])
    console.log(quotaArray)
    
    for (var i in seperatedArray[type].files) {
      if (seperatedArray[type].files[i].quotaBytesUsed != 0) {
        quotaArray[increment][1] += parseInt(seperatedArray[type].files[i].quotaBytesUsed) 
      }
    }
    increment += 1
  }
  
  current = quotaArray
  


  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {

    var data = google.visualization.arrayToDataTable(
       current
      );

    var options = {
      title: 'Distribution of file types'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
    $('#graph-loader').remove()
  }
}
