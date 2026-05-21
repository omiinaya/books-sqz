     1|// When user hits the search-btn
     2|$('#search-btn').on('click', function (event) {
     3|  event.preventDefault();
     4|
     5|  // Save the book they typed into the book-search input
     6|  const bookSearched = $('#book-search').val().trim();
     7|
     8|  // Make an AJAX get request to our api, including the user's book in the url
     9|  $.get('/api/' + bookSearched, function (data) {
    10|    console.log(data);
    11|    // Call our renderBooks function to add our books to the page
    12|    renderBooks(data);
    13|  });
    14|});
    15|
    16|// When user hits the author-search-btn
    17|$('#author-search-btn').on('click', function () {
    18|  // Save the author they typed into the author-search input
    19|  const authorSearched = $('#author-search').val().trim();
    20|
    21|  // Make an AJAX get request to our api, including the user's author in the url
    22|  $.get('/api/author/' + authorSearched, function (data) {
    23|    // Log the data to the console
    24|    console.log(data);
    25|    // Call our renderBooks function to add our books to the page
    26|    renderBooks(data);
    27|  });
    28|});
    29|
    30|// When user hits the genre-search-btn
    31|$('#genre-search-btn').on('click', function () {
    32|  // Save the book they typed into the genre-search input
    33|  const genreSearched = $('#genre-search').val().trim();
    34|
    35|  // Make an AJAX get request to our api, including the user's genre in the url
    36|  $.get('/api/genre/' + genreSearched, function (data) {
    37|    console.log(data);
    38|    // Call our renderBooks function to add our books to the page
    39|    renderBooks(data);
    40|  });
    41|});
    42|
    43|function renderBooks(data) {
    44|  if (data.length !== 0) {
    45|    $('#stats').empty();
    46|    $('#stats').show();
    47|
    48|    for (let i = 0; i < data.length; i++) {
    49|      const div = $('<div>');
    50|
    51|      div.append('<h2>' + data[i].title + '</h2>');
    52|      div.append('<p>Author: ' + data[i].author + '</p>');
    53|      div.append('<p>Genre: ' + data[i].genre + '</p>');
    54|      div.append('<p>Pages: ' + data[i].pages + '</p>');
    55|      div.append(
    56|        '<button class=\'delete\' data-id=\'' +
    57|          data[i].id +
    58|          '\'>DELETE BOOK</button>',
    59|      );
    60|
    61|      $('#stats').append(div);
    62|    }
    63|
    64|    $('.delete').click(function () {
    65|      $.ajax({
    66|        method: 'DELETE',
    67|        url: '/api/book/' + $(this).attr('data-id'),
    68|      })
    69|        // On success, run the following code
    70|        .then(function () {
    71|          console.log('Deleted Successfully!');
    72|        });
    73|
    74|      $(this).closest('div').remove();
    75|    });
    76|  }
    77|}
    78|