function simplifyError(error) {
  const message = error.message || error;
  
  // Handle duplicate key constraint errors
  if (message.includes('duplicate key value violates unique constraint')) {
    if (message.includes('discord_id_key')) {
      return 'You are already signed up!';
    }
    return 'This entry already exists.';
  }
  
  // Handle "players not signed up" errors
  if (message.includes('Some players have not signed up yet')) {
    return 'Some team members need to sign up first using /signup.';
  }
  
  // Handle common HTTP status codes
  if (message.includes('500 Internal Server Error')) {
    return 'Server error. Please try again later.';
  }
  
  if (message.includes('400 Bad Request')) {
    return 'Invalid request. Please check your input.';
  }
  
  if (message.includes('404 Not Found')) {
    return 'Resource not found.';
  }
  
  if (message.includes('403 Forbidden')) {
    return 'Access denied.';
  }
  
  // Return original message if no simplification applies
  return message;
}

module.exports = { simplifyError };