/**
 * All Books Page JavaScript
 * Modern, accessible, and performant book display with error handling
 */

$(document).ready(function() {
  'use strict';

  // Cache DOM elements
  const $wellSection = $('#well-section');
  const $loadingSection = $('#loading');
  const $errorSection = $('#error-section');
  const $bookCount = $('#book-count');
  const $retryBtn = $('#retry-btn');

  /**
   * Creates a book card element with proper accessibility
   * @param {Object} book - Book data object
   * @param {number} index - Book index for unique IDs
   * @returns {jQuery} Book card element
   */
  function createBookCard(book, index) {
    const bookId = `book-${book.id || index}`;
    const readingTime = book.pages ? Math.round((book.pages * 250) / (200 * 60) * 100) / 100 : 0;
    const isLongBook = book.pages > 300;
    
    return $(`
      <article class="book-card card mb-3" id="${bookId}" tabindex="0">
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <h3 class="card-title h4">
                <span class="badge badge-secondary mr-2">${index + 1}</span>
                ${escapeHtml(book.title)}
              </h3>
              <p class="card-text">
                <strong>Author:</strong> ${escapeHtml(book.author)}<br>
                <strong>Genre:</strong> 
                <span class="badge badge-${getGenreBadgeClass(book.genre)}">${escapeHtml(book.genre)}</span><br>
                <strong>Pages:</strong> ${book.pages || 'Unknown'}
                ${isLongBook ? '<span class="badge badge-warning ml-2">Long Read</span>' : ''}
              </p>
            </div>
            <div class="col-md-4 text-md-right">
              <div class="book-meta">
                ${readingTime > 0 ? `
                  <small class="text-muted d-block">
                    <i class="fa fa-clock-o" aria-hidden="true"></i>
                    ~${readingTime} hours reading time
                  </small>
                ` : ''}
                <small class="text-muted d-block mt-1">
                  <i class="fa fa-calendar" aria-hidden="true"></i>
                  Added: ${book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'Unknown'}
                </small>
              </div>
            </div>
          </div>
        </div>
      </article>
    `);
  }

  /**
   * Escapes HTML to prevent XSS attacks
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Gets Bootstrap badge class for genre
   * @param {string} genre - Book genre
   * @returns {string} Bootstrap badge class
   */
  function getGenreBadgeClass(genre) {
    const genreClasses = {
      'Fiction': 'primary',
      'Non-Fiction': 'success',
      'Science Fiction': 'info',
      'Fantasy': 'purple',
      'Mystery': 'dark',
      'Romance': 'danger',
      'Thriller': 'warning',
      'Biography': 'secondary',
      'History': 'light'
    };
    return genreClasses[genre] || 'secondary';
  }

  /**
   * Loads and displays all books
   */
  function loadBooks(page = 1) {
    // Show loading state
    $loadingSection.show();
    $wellSection.hide();
    $errorSection.hide();
    $bookCount.text('Loading...');

    // Make API request with timeout
    const xhr = $.ajax({
      url: '/api/all',
      method: 'GET',
      timeout: 10000, // 10 second timeout
      dataType: 'json',
      data: { page } // Send page number
    });

  xhr.done(function(response) {
    // Handle new API response structure
    const data = response.books || response;
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format received');
    }

    // Hide loading, show content
    $loadingSection.hide();
    $wellSection.show().empty();

    if (data.length === 0) {
      $wellSection.html(`
        <div class="text-center py-5">
          <i class="fa fa-book fa-3x text-muted mb-3"></i>
          <h3>No Books Found</h3>
          <p class="text-muted">The library is empty. Add some books to get started!</p>
          <a href="/add" class="btn btn-primary">
            <i class="fa fa-plus"></i> Add Your First Book
          </a>
        </div>
      `);
      $bookCount.text('0 books');
      return;
    }

    // Create and append book cards
    const fragment = document.createDocumentFragment();
    data.forEach((book, index) => {
      const $bookCard = createBookCard(book, index);
      fragment.appendChild($bookCard[0]);
    });

    $wellSection[0].appendChild(fragment);
    
    // Update count based on response structure
    const count = response.pagination ? response.pagination.total : data.length;
    $bookCount.text(`${count} book${count !== 1 ? 's' : ''}`);

    // Show pagination if available
    if (response.pagination) {
      displayPagination(response.pagination);
    }

    // Announce completion for screen readers
    $wellSection.attr('aria-live', 'polite');
    setTimeout(() => {
      $wellSection.removeAttr('aria-live');
    }, 1000);

    }).fail(function(xhr, status, error) {
      console.error('Failed to load books:', { xhr, status, error });
      
      $loadingSection.hide();
      $errorSection.show();
      $bookCount.text('Error');

      // Focus error section for accessibility
      $errorSection.focus();
    });
  }

  /**
   * Display pagination controls
   * @param {Object} pagination - Pagination data from API
   */
  function displayPagination(pagination) {
    if (pagination.pages <= 1) return;

    const $paginationContainer = $('<nav class="mt-4" aria-label="Book pagination">');
    const $pagination = $('<ul class="pagination justify-content-center">');

    // Previous button
    if (pagination.page > 1) {
      $pagination.append(`
        <li class="page-item">
          <a class="page-link" href="#" data-page="${pagination.page - 1}" aria-label="Previous page">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
      `);
    }

    // Page numbers
    const startPage = Math.max(1, pagination.page - 2);
    const endPage = Math.min(pagination.pages, pagination.page + 2);

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === pagination.page ? ' active' : '';
      $pagination.append(`
        <li class="page-item${isActive}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `);
    }

    // Next button
    if (pagination.page < pagination.pages) {
      $pagination.append(`
        <li class="page-item">
          <a class="page-link" href="#" data-page="${pagination.page + 1}" aria-label="Next page">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      `);
    }

    $paginationContainer.append($pagination);
    $wellSection.after($paginationContainer);

    // Handle pagination clicks
    $pagination.on('click', 'a', function(e) {
      e.preventDefault();
      const page = $(this).data('page');
      if (page && page !== pagination.page) {
        loadBooks(page);
      }
    });
  }

  // Retry button handler
  $retryBtn.on('click', function() {
    loadBooks();
  });

  // Keyboard navigation for book cards
  $wellSection.on('keydown', '.book-card', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $(this).find('.card-body').trigger('click');
    }
  });

  // Initial load
  loadBooks();

  // Auto-refresh every 5 minutes if page is visible
  let refreshInterval;
  
  function startAutoRefresh() {
    refreshInterval = setInterval(() => {
      if (!document.hidden) {
        loadBooks();
      }
    }, 300000); // 5 minutes
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  }

  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoRefresh();
    } else {
      startAutoRefresh();
    }
  });

  // Start auto-refresh
  startAutoRefresh();

  // Cleanup on page unload
  $(window).on('beforeunload', stopAutoRefresh);
});
