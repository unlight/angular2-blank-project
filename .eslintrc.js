module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parser": "typescript-eslint-parser",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console": 1,
        "no-debugger": 1,
        "no-duplicate-case": 1,
        "no-empty": 1,
        "no-unreachable": 1,
        "no-unsafe-finally": 1,
        "no-this-before-super": 0,
        "constructor-super": 0,
        "no-unused-vars": 0,
        "indent": ["warn", 4],
        "linebreak-style": ["warn", "unix"],
        "semi": ["warn", "always"]
    }
};
