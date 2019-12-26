module.exports = {
  presets: [
    [
      '@vue/app', {
        polyfills: [
          'es6.array.iterator',
          'es6.promise'
        ],
        "useBuiltIns": "entry",
        "targets": {
          "ie": "11"
        }
      }
    ]
  ]
};