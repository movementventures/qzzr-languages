var should = require('should');
var dir = require('fs').readdirSync;
var read = require('fs').readFileSync;
var yaml = require('js-yaml');

describe('qzzr-languages', function() {
  var root = __dirname + '/../';
  dir(root).forEach(function(locale) {
    if (!~locale.indexOf('.yml') || ~locale.indexOf('travis')) return;

    var l = locale.replace('.yml', '');
    describe(l, function() {
      var doc;
      it('should be free of syntax errors', function() {
        doc = load(root + locale, l);
      });

      it('should be up to date with the english', function() {
        var en = load(root + 'en.yml', 'en');
        var differences = check(en, doc || {}, ['network'], []);
        if (differences.length) console.error('\tmissing keys:\n\t ' + differences.join('\n\t '));
      });
    });
  });
});

function load(path, l) {
  var str = read(path, 'utf8');
  return (yaml.safeLoad(str)[l] || {}).network || {};
}

function check(en, locale, path, acc) {
  for (var k in en) {
    if (!locale[k]) {
      acc.push(path.concat(k).join('.'));
      continue;
    }
    if (typeof en[k] === 'object') check(en[k], locale[k] || {}, path.concat(k), acc);
  }
  return acc;
}
