let presets = [
    [
        '@babel/preset-env',
        {
            targets: {
                browsers: [
                    'last 3 versions',
                    'Safari >= 8',
                    'iOS >= 8',
                    'ie >= 8'
                ]
            },
            debug: true,
            useBuiltIns: "entry", // 使用 babel 的 polyfill
        }
    ],
    '@babel/react'
];

let plugins = [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-syntax-import-meta",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-json-strings",
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-export-namespace-from",
];

if (process.env["ENV"] === "prod") {

} else {

}

module.exports = {presets, plugins};