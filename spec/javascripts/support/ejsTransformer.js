module.exports = {
  process(src, filename, config, options) {
    return `
      const ejs = require('ejs');
      module.exports = ejs.compile(\`${src}\`);
    `;
  },
};
