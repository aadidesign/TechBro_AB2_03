const path = require('path');
const fs = require('fs');

module.exports = function(req, res, next) {
  // Store the original render function
  const originalRender = res.render;

  // Override the render function
  res.render = function(view, options, callback) {
    options = options || {};
    
    // Call the original render with our modified options
    originalRender.call(this, view, options, function(err, html) {
      if (err) return callback ? callback(err) : next(err);
      
      // Read the layout file
      const layoutPath = path.join(__dirname, '../views/layout.ejs');
      fs.readFile(layoutPath, 'utf8', (err, layoutContent) => {
        if (err) return callback ? callback(err) : next(err);
        
        // Replace the body placeholder with our view html
        const renderedLayout = layoutContent.replace('<%- body %>', html);
        
        return callback ? callback(null, renderedLayout) : res.send(renderedLayout);
      });
    });
  };
  
  next();
};