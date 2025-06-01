# Time Lense

A React application for viewing images and videos with a timeline-based interface. Users can browse media content using a datetime slider to find the closest captures to a selected date and time. Real time camera setting.

## Features

- Image and video preview support
- Interactive timeline slider
- Date and time picker
- Media library with thumbnails
- Responsive layout using Material-UI
- Dark theme by default
- Real time camera settings

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/time-lense.git
cd time-lense
```

2. Download and Install Node.js
If you don't have Node.js installed:
### For Windows: download it from here https://nodejs.org/en/download
### For Mac:
```bash
brew install node
```
### For Linux:
```bash
sudo apt install nodejs
```

3. Download and Install npm
### For Windows (if still not have it after installing node): `https://docs.npmjs.com/downloading-and-installing-node-js-and-npm`
### For Mac (if still not have it after installing node):
```bash
brew install npm
```
### For Linux (if still not have it after installing node):
```bash
sudo apt install npm
```

4. Install dependencies:
## Server
```bash
cd server
```
```bash
npm install
```

## Web
```bash
cd web
```
```bash
npm install
```

5. Copy the .env.example in both server and web folder. Rename them to .env and replace everything with the correct configuration.

6. Running the Application
## Server
### For development
```bash
cd server
npm run start-dev
```
### For production
```bash
cd server
npm run start
```
### The application will available at `http://localhost:3030`.

## WEB
### To start the development server:
```bash
cd web
npm start
```
### For Building the application
```bash
npm build
```
### Do not forget to copy the builded Application (build folder) to /server/build

### The application will open in your default browser at `http://localhost:3000`.

7.Install UWI (UUGear Web Interface):  Access Your Devices via Browser 

## Link
`https://www.uugear.com/news/uugear-web-interface-uwi-access-your-devices-via-browser`
## After Installation run `./diagnose.sh`


# Camera parameters
### `https://www.raspberrypi.com/documentation/computers/camera_software.html`
### `https://libcamera.org/api-html/namespacelibcamera_1_1controls.html`
### `https://github.com/raspberrypi/rpicam-apps/issues/548`

## Usage
1. The main viewer displays the currently selected image or video
2. Use the timeline slider or date-time picker to navigate through your media
3. The sidebar shows all available media items that you can click to select
4. The application automatically finds the closest media to your selected date and time
5. Live Preview will give the opportunity to change camera setting in real time

## License

MIT 