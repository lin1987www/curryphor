const path = require('path');
module.exports = {
    env: {
        'browser': true,
        'es6': true,
        "node": true
    },
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true
        },
        sourceType: 'module'
    },
    plugins: [
        'react'
    ],
    rules: {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        'semi': [
            'error',
            'always'
        ],
        'quotes': [
            'error',
            'single'
        ]
    }
};


