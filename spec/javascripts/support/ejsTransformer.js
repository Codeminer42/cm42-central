module.exports = {
  process(src, filename, config, options) {
    return `
      const _ = require('underscore');
      module.exports = _.template(\`${src}\`);
    `;
  }
};
