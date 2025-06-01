const cors = require('cors');
const express = require('express');
const config = require('./config');
const path = require('path');

module.exports = (app) => {
    // Setup the body parser
    app.use(express.json({
        verify: (req, res, buf, encoding) => {
            try {
                JSON.parse(buf);
            } catch (error) {
                const message = parseError(error);
                console.error(message);
                res.status(400).json({ message: "Invalid data format" });
            }
        }
    }));

    // Setup the body parser
    app.use(express.urlencoded({ extended: true }));

    // Setup the static files
    app.use(express.static(path.join(__dirname, '..', 'build')));

    app.use('/images', express.static(config.baseImageFolder));

    // Setup CORS
    app.use(cors({
        origin: config.origin,
        methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ['Content-Type'],
    }));
};