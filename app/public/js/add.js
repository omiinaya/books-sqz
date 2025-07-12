/**
 * Add Book Form JavaScript
 * Modern, accessible form handling with validation and user feedback
 */

$(document).ready(function() {
  'use strict';

  // Cache DOM elements
  const $form = $('#book-form');
  const $submitBtn = $('#add-btn');
  const $resetBtn = $('#reset-btn');
  const $loading = $('#loading');
  const $successMessage = $('#success-message');
  const $errorMessage = $('#error-message');
  const $errorText = $('#error-text');

  // Form fields
  const $title = $('#title');
  const $author = $('#author');
  const $genre = $('#genre');
  const $pages = $('#pages');

  /**
   * Validates a single form field
   * @param {jQuery} $field - The field to validate
   * @param {string} fieldName - Human readable field name
   * @returns {boolean} True if valid
   */
  function validateField($field, fieldName) {
    const value = $field.val().trim();
    const $errorDiv = $(`#${$field.attr('id')}-error`);
    let isValid = true;
    let errorMessage = '';

    // Clear previous validation state
    $field.removeClass('is-invalid is-valid');
    $errorDiv.text('');

    // Required field validation
    if (!value) {
      errorMessage = `${fieldName} is required`;
      isValid = false;
    } else {
      // Field-specific validation
      switch ($field.attr('id')) {
        case 'title':
        case 'author':
          if (value.length > 255) {
            errorMessage = `${fieldName} must be 255 characters or less`;
            isValid = false;
          }
          break;
        
        case 'genre':
          const validGenres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Biography', 'History', 'Other'];
          if (!validGenres.includes(value)) {
            errorMessage = 'Please select a valid genre';
            isValid = false;
          }
          break;
        
        case 'pages':
          const pages = parseInt(value);
          if (isNaN(pages) || pages < 1 || pages > 10000) {
            errorMessage = 'Pages must be a number between 1 and 10,000';
            isValid = false;
          }
          break;
      }
    }

    // Update UI based on validation
    if (isValid) {
      $field.addClass('is-valid');
    } else {
      $field.addClass('is-invalid');
      $errorDiv.text(errorMessage);
    }

    return isValid;
  }

  /**
   * Validates the entire form
   * @returns {boolean} True if all fields are valid
   */
  function validateForm() {
    const titleValid = validateField($title, 'Title');
    const authorValid = validateField($author, 'Author');
    const genreValid = validateField($genre, 'Genre');
    const pagesValid = validateField($pages, 'Pages');

    return titleValid && authorValid && genreValid && pagesValid;
  }

  /**
   * Shows a success message
   * @param {string} message - Success message to display
   */
  function showSuccess(message) {
    $successMessage.find('strong').next().text(` ${message}`);
    $successMessage.slideDown();
    $errorMessage.hide();

    // Auto-hide after 5 seconds
    setTimeout(() => {
      $successMessage.slideUp();
    }, 5000);
  }

  /**
   * Shows an error message
   * @param {string} message - Error message to display
   */
  function showError(message) {
    $errorText.text(message);
    $errorMessage.slideDown();
    $successMessage.hide();
  }

  /**
   * Resets the form to initial state
   */
  function resetForm() {
    $form[0].reset();
    $('.form-control').removeClass('is-valid is-invalid');
    $('.invalid-feedback').text('');
    $successMessage.hide();
    $errorMessage.hide();
    $title.focus();
  }

  /**
   * Sets loading state
   * @param {boolean} isLoading - Whether to show loading state
   */
  function setLoadingState(isLoading) {
    if (isLoading) {
      $loading.show();
      $submitBtn.prop('disabled', true).html('<span class="fa fa-spinner fa-spin"></span> Adding Book...');
    } else {
      $loading.hide();
      $submitBtn.prop('disabled', false).html('<span class="fa fa-plus"></span> Add Book to Library');
    }
  }

  /**
   * Submits the form data to the server
   * @param {Object} bookData - Book data to submit
   */
  function submitBook(bookData) {
    setLoadingState(true);

    $.ajax({
      url: '/api/books',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(bookData),
      timeout: 10000
    })
    .done(function(response) {
      console.log('Book added successfully:', response);
      showSuccess('Book has been added to the library successfully!');
      resetForm();
      
      // Optional: redirect to view the book or all books
      setTimeout(() => {
        const viewAllConfirm = confirm('Book added successfully! Would you like to view all books?');
        if (viewAllConfirm) {
          window.location.href = '/all';
        }
      }, 2000);
    })
    .fail(function(xhr) {
      console.error('Error adding book:', xhr);
      
      let errorMessage = 'An error occurred while adding the book. Please try again.';
      
      if (xhr.responseJSON) {
        if (xhr.responseJSON.details && Array.isArray(xhr.responseJSON.details)) {
          errorMessage = xhr.responseJSON.details.join(', ');
        } else if (xhr.responseJSON.error) {
          errorMessage = xhr.responseJSON.error;
        }
      }
      
      showError(errorMessage);
    })
    .always(function() {
      setLoadingState(false);
    });
  }

  // Form submission handler
  $form.on('submit', function(event) {
    event.preventDefault();
    
    if (!validateForm()) {
      showError('Please correct the errors below and try again.');
      // Focus first invalid field
      $('.is-invalid').first().focus();
      return;
    }

    const bookData = {
      title: $title.val().trim(),
      author: $author.val().trim(),
      genre: $genre.val().trim(),
      pages: parseInt($pages.val().trim())
    };

    submitBook(bookData);
  });

  // Reset button handler
  $resetBtn.on('click', function() {
    const confirmReset = confirm('Are you sure you want to reset the form? All entered data will be lost.');
    if (confirmReset) {
      resetForm();
    }
  });

  // Real-time validation on blur
  $('.form-control').on('blur', function() {
    const $field = $(this);
    const fieldName = $field.siblings('label').text().replace('*', '').trim();
    validateField($field, fieldName);
  });

  // Remove validation classes on input to provide immediate feedback
  $('.form-control').on('input', function() {
    const $field = $(this);
    if ($field.hasClass('is-invalid') && $field.val().trim()) {
      $field.removeClass('is-invalid');
      $(`#${$field.attr('id')}-error`).text('');
    }
  });

  // Close success message handler
  $successMessage.on('click', '.close', function() {
    $successMessage.slideUp();
  });

  // Keyboard shortcuts
  $(document).on('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
      $form.trigger('submit');
    }
    
    // Escape to close messages
    if (e.keyCode === 27) {
      $successMessage.slideUp();
      $errorMessage.slideUp();
    }
  });

  // Focus first field on page load
  $title.focus();

  // Auto-capitalize title and author fields
  $title.add($author).on('input', function() {
    const $field = $(this);
    const value = $field.val();
    const capitalizedValue = value.replace(/\b\w/g, char => char.toUpperCase());
    if (value !== capitalizedValue) {
      const cursorPos = $field[0].selectionStart;
      $field.val(capitalizedValue);
      $field[0].setSelectionRange(cursorPos, cursorPos);
    }
  });

  console.log('📚 Add Book form initialized successfully');
});
