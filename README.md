# Giffer
<img src="https://user-images.githubusercontent.com/75532982/133305502-77feacbc-a1d3-4a9b-8fde-0bafd803738e.gif" width="45%"></img> <img src="https://user-images.githubusercontent.com/75532982/133305532-c4dc86a8-46c7-4e26-a0c5-7a16abd8d526.gif" width="45%"></img>   
(The original video is [this](https://www.youtube.com/watch?v=1psMjr4LSM8), all credits for the animations to the owner of the video, only the gif file is generated from Giffer)  

## What is it?
A website that automatically finds a similar frame to a chosen one and builds a loop gif from a video.  

## Limitations
- The input file must be a video with a format recognized by Firefox
- The GIF maximum length is set to 100 frames (later, the limit will be decided by the user)
- It's recommended to visit this website with a PC (more power to elaborate the frames)
- It's recommended to not insert long videos with high resolution

## How does it work?
The video is scanned frame by frame (this is done using `seekToNextFrame()` that is the reason for the usage of Firefox, but other solutions are coming up, for example WebCodecs) from the starting frame to 100 frames after the first one. Next, each framed is compared to the first one using [pixelmatch](https://github.com/mapbox/pixelmatch). Pixelmatch returns the number of different pixels between the 2 frames (starting one and another) and, after the user inputs the desired end frame, via [GIF.js](https://github.com/jnordberg/gif.js/) the frames are put together in one GIF file.  
For more details, check the source code.

## Requirements
1. This website runs only on Firefox
2. Must set privacy.resistFingerprinting.autoDeclineNoUserInputCanvasPrompts to false