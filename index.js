// Generated by CoffeeScript 1.10.0
(function() {
  var Fs, Path;

  Fs = require('fs');

  Path = require('path');

  module.exports = function(robot) {
    var path;
    path = Path.resolve(__dirname, 'scripts');
    return Fs.exists(path, function(exists) {
      var file, i, len, ref, results;
      if (exists) {
        ref = Fs.readdirSync(path);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          file = ref[i];
          results.push(robot.loadFile(path, file));
        }
        return results;
      }
    });
  };

}).call(this);
