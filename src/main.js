if((typeof window !== 'undefined' && !window._babelPolyfill) ||
    (typeof global !== 'undefined' && !global._babelPolyfill)) {
    require('babel-polyfill')
}

let app = require('./bin/www.js');