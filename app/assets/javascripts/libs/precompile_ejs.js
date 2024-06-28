import ejs from 'ejs';
import fs from 'fs';

export default function precompileEjs() {
  return {
    name: 'precompile-ejs',
    enforce: 'pre',
    load: function (id) {
      if (!id.endsWith('.ejs')) {
        return null;
      }

      const code = fs.readFileSync(id).toString('utf-8');
      const template = ejs.compile(code, {
        filename: id,
        client: true,
        strict: true,
        rmWhitespace: true,
      });
      const transpiled =
        '/** eslint-disable */\nexport default ' + template.toString() + ';';

      return {
        code: transpiled,
      };
    },
    transform: function (src, id) {
      if (!id.endsWith('.ejs')) {
        return null;
      }

      return {
        code: src,
      };
    },
  };
}
