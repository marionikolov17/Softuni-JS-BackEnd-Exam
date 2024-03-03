const express = require('express');
const cookieParser = require("cookie-parser");

function expressConfig(app) {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static("public"));
    app.use(cookieParser());
    return app;
};

module.exports = expressConfig;