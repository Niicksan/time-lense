const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const imageController = require('express').Router();
const { Client } = require('ssh2');

// Helper function to safely read directory
const safeReaddir = (path) => {
    try {
        return fs.existsSync(path) ? fs.readdirSync(path) : [];
    } catch (error) {
        console.error(`Error reading directory ${path}:`, error);
        return [];
    }
};

// Image tuning
imageController.post('/image-tuning', async (req, res) => {
    // For debuging
    // console.log(req.body);
    try {
        const destFile = `${config.inMemoryImageFolder}/test-image.jpg`;
        const {
            exposure,
            exposureValue,
            whiteBalance,
            autofocusMode,
            lensPosition,
            lensPositionNumber,
            quality,
            sharpness,
            contrast,
            saturation,
            brightness,
            iso,
            shutterSpeed } = req.body;

        let comand = `libcamera-still --immediate --mode 4608:2592:12:P -q ${quality} -o ${destFile}`;

        if (exposure !== 'auto') {
            if (exposure === 'custom') {
                comand += ` --ev ${exposureValue}`;
            } else {
                comand += ` --exposure ${exposure}`;
            }
        }

        if (whiteBalance !== 'auto') {
            comand += ` --awb ${whiteBalance}`;
        }

        if (autofocusMode !== 'auto') {
            comand += ` --autofocus-mode ${autofocusMode}`;
        }

        if (autofocusMode === 'manual') {
            if (lensPosition === 'number') {
                comand += ` --lens-position ${lensPositionNumber}`;
            } else {
                comand += ` --lens-position ${lensPosition}`;
            }
        }

        if (sharpness !== 1) {
            comand += ` --sharpness ${sharpness}`;
        }

        if (contrast !== 1) {
            comand += ` --contrast ${contrast}`;
        }

        if (saturation !== 1) {
            comand += ` --saturation ${saturation}`;
        }

        if (brightness !== 0) {
            comand += ` --brightness ${brightness}`;
        }

        if (shutterSpeed !== 0.01) {
            comand += ` --shutter ${shutterSpeed * 1000000}`;
        }

        console.log('Executing remotely:', comand);

        const ssh = new Client();

        ssh.on('ready', () => {
            ssh.exec(comand, (err, stream) => {
                if (err) {
                    console.error('SSH exec error:', err);
                    ssh.end();
                    return;
                }
                stream.on('close', (code, signal) => {
                    console.log('Stream closed with code', code, 'and signal', signal);
                    ssh.end();
                    return res.status(200).json({
                        message: 'Image tuning successful'
                    });
                }).on('data', (data) => {
                    console.log('STDOUT:', data.toString());
                }).stderr.on('data', (data) => {
                    console.error('STDERR:', data.toString());
                });
            });
        }).connect({
            host: config.cameraHost,
            username: config.cameraUsername,
            password: config.cameraPassword,
        });
    } catch (error) {
        console.error('Error tuning image:', error);
        return res.status(400).json({
            error: 'Error tuning image'
        });
    }
});

// Get date range
imageController.get('/date-range', async (req, res) => {
    try {
        // Check if base path exists
        if (!fs.existsSync(config.baseImageFolder)) {
            return res.json({
                min: new Date(),
                max: new Date(),
                error: 'Image directory not found'
            });
        }

        const years = safeReaddir(config.baseImageFolder).sort();
        if (years.length === 0) {
            return res.json({
                min: new Date(),
                max: new Date(),
                error: 'No images found'
            });
        }

        const firstYear = years[0];
        const lastYear = years[years.length - 1];

        // Get earliest date
        const firstYearPath = path.join(config.baseImageFolder, firstYear);
        const firstMonth = safeReaddir(firstYearPath).sort()[0] || '01';
        const firstMonthPath = path.join(firstYearPath, firstMonth);
        const firstDay = safeReaddir(firstMonthPath).sort()[0] || '01';

        // Get latest date
        const lastYearPath = path.join(config.baseImageFolder, lastYear);
        const lastMonth = safeReaddir(lastYearPath).sort().reverse()[0] || '12';
        const lastMonthPath = path.join(lastYearPath, lastMonth);
        const lastDay = safeReaddir(lastMonthPath).sort().reverse()[0] || '31';

        return res.json({
            min: new Date(parseInt(firstYear), parseInt(firstMonth) - 1, parseInt(firstDay)),
            max: new Date(parseInt(lastYear), parseInt(lastMonth) - 1, parseInt(lastDay))
        });
    } catch (error) {
        console.error('Error getting date range:', error);
        return res.json({
            min: new Date(),
            max: new Date(),
            error: 'Error getting date range'
        });
    }
});

// Get images for a specific date
imageController.get('/images', (req, res) => {
    try {
        const date = new Date(req.query.date);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        const datePath = path.join(config.baseImageFolder, year, month, day);
        const images = [];

        // Check if directory exists
        if (!fs.existsSync(datePath)) {
            return res.json([]);
        }

        // Get all hour folders
        const hourFolders = safeReaddir(datePath);

        for (const hour of hourFolders) {
            const hourPath = path.join(datePath, hour);
            if (fs.existsSync(hourPath) && fs.statSync(hourPath).isDirectory()) {
                // Get all images in the hour folder
                const files = safeReaddir(hourPath);

                files.forEach(file => {
                    if (file.match(/\.(jpg|jpeg|png)$/i)) {
                        const timestamp = new Date(
                            parseInt(year),
                            parseInt(month) - 1,
                            parseInt(day),
                            parseInt(hour)
                        );

                        const relativePath = path.join(year, month, day, hour, file);
                        images.push({
                            id: relativePath,
                            type: 'image',
                            url: `/images/${relativePath}`,
                            timestamp: timestamp.toISOString(),
                            filePath: path.join(hourPath, file)
                        });
                    }
                });
            }
        }

        return res.json(images);
    } catch (error) {
        console.error('Error getting images:', error);
        return res.json([]);
    }
});

module.exports = imageController;