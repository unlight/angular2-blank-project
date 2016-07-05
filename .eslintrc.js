module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "warning",
            4
        ],
        "linebreak-style": [
            "warning",
            "unix"
        ],
        "semi": [
            "warning",
            "always"
        ]
    }
};