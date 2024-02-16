/*const parseValidationErrors = (e, req) => {
    const keys = Object.keys(e.errors);
    keys.forEach((key) => {
      req.flash("error", key + ": " + e.errors[key].properties.message);
    });
};
  
module.exports = parseValidationErrors;
*/

const parseValidationErrors = (e, req) => {
  console.log('e.errors:', e.errors);
  const keys = Object.keys(e.errors);
  keys.forEach((key) => {
      console.log('e.errors[' + key + ']:', e.errors[key]);
      if (e.errors[key] && e.errors[key].properties && e.errors[key].properties.message) {
          req.flash("error", key + ": " + e.errors[key].properties.message);
      } else {
          console.error("Error object or its properties are undefined for key:", key);
          req.flash("error", key + ": Unknown error");
      }
  });
};

module.exports = parseValidationErrors;
