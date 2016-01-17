# Parlameter card dev tools

This is a build and development environment for developing and compiling parlameter cards. It uses EJS templating and SCSS for CSS compiling.

## Prerequsites

SCSS/Compass, NodeJS,  

## Installation

Clone the repository

Install NPM packages
```
$ npm install
```

## Usage

### Development

After installation you can run ```$ grunt serve``` to start the tasks required for previewing and on the go compiling of your card.


#### HTML
Work on the HTML takes place inside
```
card/card.ejs
```

#### JSON mock data
Mock data that simulates the API response is in 
```
card/data.json
```

#### S/CSS
Work on the CSS for individual card takes place inside 
```
card/scss/_custom.scss
```

#### JavaScript
Work on the client side JavaScript for individual card takes place inside 
```
card/js/script.js
```

### Build for distribution

Once you are ready to build for distribution run
```
$ grunt build
```

The resulting file
```
dist/card.compiled.ejs
```
is the compiled result of the EJS template, JavaScript and SCSS and is ready to be copy pasted for publishing.
