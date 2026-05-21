     1|// Make a get request to our api route that will return every "long" book (300 pages or more)
     2|$.get('/api/books/long', function (data) {
     3|  // For each book that our server sends us back
     4|  for (let i = 0; i < data.length; i++) {
     5|    // Create a parent div to hold book data
     6|    const wellSection = $('<div>');
     7|    // Add a class to this div: 'well'
     8|    wellSection.addClass('well');
     9|    // Add an id to the well to mark which well it is
    10|    wellSection.attr('id', 'book-well-' + i);
    11|    // Append the well to the well section
    12|    $('#well-section').append(wellSection);
    13|
    14|    // Now  we add our book data to the well we just placed on the page
    15|    $('#book-well-' + i).append(
    16|      '<h2>' + (i + 1) + '. ' + data[i].title + '</h2>',
    17|    );
    18|    $('#book-well-' + i).append('<h3>Author: ' + data[i].author + '</h4>');
    19|    $('#book-well-' + i).append('<h3>Genre: ' + data[i].genre + '</h4>');
    20|    $('#book-well-' + i).append('<h3>Pages: ' + data[i].pages + '</h4>');
    21|  }
    22|});
    23|