const config = {
    env: process.env.NODE_ENV, // Environment for the server
    host: process.env.HOST, // Host for the server
    port: process.env.PORT, // Port for the server
    origin: [process.env.ORIGIN], // Origin for the server
    cameraHost: process.env.CAMERA_HOST, // Host for the camera
    cameraUsername: process.env.CAMERA_USERNAME, // Username for the camera
    cameraPassword: process.env.CAMERA_PASSWORD, // Password for the camera
    baseImageFolder: process.env.BASE_IMAGE_FOLDER, // Base directory for images on the storage server
    inMemoryImageFolder: process.env.IN_MEMORY_IMAGE_FOLDER, // In-Memory folder for images on the camera
};

module.exports = config;