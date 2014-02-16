var newline = /\r?\n|\r/g;

/**
 * Constructor
 */
function Parser(keywords) {
  if (!keywords) {
    keywords = ['gettext', '_'];
  }

  if (typeof keywords === 'string') {
    keywords = [keywords];
  }

  this.keywords = keywords;

  this.pattern = new RegExp('\\{\\{(?:' + keywords.join('|') + ')\\s+(?:"((?:\\\\.|[^"\\\\])*)"|\'((?:\\\\.|[^\'\\\\])*)\')(?:\\s+(?:"((?:\\\\.|[^"\\\\])*)"|\'((?:\\\\.|[^\'\\\\])*)\')\\s+\\w+)?\\s*\\}\\}', 'gm');
}

/**
 * Given a Handlebars template string returns the list of i18n strings.
 *
 * @param String template The content of a HBS template.
 * @return Object The list of translatable strings, the line(s) on which each appears and an optional plural form.
 */
Parser.prototype.parse = function (template) {
  var result = {},
    match,
    msg,
    key;

  while ((match = this.pattern.exec(template)) !== null) {
    key = (match[1] || match[2]).replace(/\\(.)/g, '$1');
    msg = result[key] = result[key] || {};

    if (match[3] || match[4]) {
      msg.plural = msg.plural || (match[3] || match[4]).replace(/\\(.)/g, '$1');
    }
    msg.line = msg.line || [];
    msg.line.push(template.substr(0, match.index).split(newline).length);
  }

  return result;
};

module.exports = Parser;
