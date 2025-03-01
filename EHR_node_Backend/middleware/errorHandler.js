// Error handling middleware
module.exports = function(err, req, res, next) {
    console.error(err.stack);
    
    // Set status code
    const statusCode = err.statusCode || 500;
    
    // Render error page or send JSON for API requests
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(statusCode).json({
        error: true,
        message: err.message || 'Something went wrong'
      });
    }
    
    // Render error page for normal requests
    res.status(statusCode).render('error', {
      title: `Error ${statusCode}`,
      message: err.message || 'Something went wrong',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  };