# gulp-gobin

[![Build Status](https://travis-ci.org/ddliu/gulp-gobin.png)](https://travis-ci.org/ddliu/gulp-gobin)

Convert any file into managable Go source code (like go-bindata).

## Why Gulp Plugin

Gulp plugins works well with each other, which means you can do many things before
you generate the bindata: such as minify css files, combine js files etc.

## Installation

Install package with NPM and add it to your development dependencies:

    npm install --save-dev gulp-gobin

## Usage

```js
var bindata = require('gulp-gobin');
var gulp = require('gulp');

gulp.task('bindata', function() {
    return gulp.src('assets/**/*', {package: 'game'})
        .pipe(bindata('bindata.go'))
        .pipe(gulp.dest('../game/bindata.go'));
});
```

To use the generated `bindata` in your golang program:

```go
package game

import (
    "fmt"
)

func run() {
    fileContents := Assets("images/logo.png")
    fmt.Println(string(fileContents))
}
```

## Options

- `package`

    Package name for the generated bindata. Default value is "main".
    

## TODO

- nomemcopy
- debug

## Changelog

### v0.1.0 (2014-07-01)

First release.
