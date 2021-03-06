var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var Buffer = require('buffer').Buffer;
var through = require('through');

const PLUGIN = 'gulp-gobin';

function toHex(content) {
    var result = [];
    for (var i = 0, length = content.length; i < length; i++) {
        result.push('0x' + content[i].toString(16) + ', ');
    }

    return result.join('');
}

module.exports = function(filename, options) {
    if (typeof filename !== 'string') {
        throw new PluginError(PLUGIN, 'Missing filename option');
    }

    if (!options) {
        options = {};
    }

    if (typeof options.package !== 'string') {
        options.package = 'main';
    }

    var contents = [];
    var firstFile = null;
    return through(function(file) {
        if (file.isNull()) {
            return;
        }

        if (file.isStream()) {
            return this.emit('error', new PluginError('gulp-gobin', 'Streaming not supported'));
        }

        if (!firstFile) {
            firstFile = file;
        }

        var name = file.relative;
        contents.push('    "' + name + '": func()[]byte{return []byte{' + toHex(file.contents) + "}}")
    }, function() {
        if (contents.length === 0) {
            return this.emit('end');
        }

        var fileContents = contents.join(",\n") + ",\n";
        fileContents = 
        'package ' + options.package + "\n" +
        'var _bindata = map[string]func()[]byte{' + "\n" + 
        fileContents + 
        '}' + "\n" +
        'func Asset(name string) []byte {' + "\n" +
        '   if f, ok := _bindata[name]; ok {' + "\n" +
        '       return f()' + "\n" +
        '   }' + "\n" +
        '   return nil' + "\n" + 
        '}';

        var joinedPath = path.join(firstFile.base, filename);

        var joinedFile = new File({
            cwd: firstFile.cwd,
            base: firstFile.base,
            path: joinedPath,
            contents: new Buffer(fileContents)
        });

        this.emit('data', joinedFile);
        this.emit('end');
    });
};