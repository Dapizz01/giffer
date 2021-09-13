const GIF_LENGTH = 100;
var video = document.getElementById("video")
var frames = Array()
var canvas = document.getElementById("frame")
var ctx = canvas.getContext("2d")
var matchValues = Array()

document.getElementById("videoUpload").onchange = (event) => {
    let file = event.target.files[0]
    let blobUrl = URL.createObjectURL(file)
    video.src = blobUrl
}

document.getElementById("searchFrames").onclick = async () => {
    await captureFrame()
    compareFrames()
    document.getElementById("createGifDiv").style.display = "block"
}

document.getElementById("createGif").onclick = () => {
    createGIF(document.getElementById("inputFrame").value)
}

async function captureFrame(){
    for(let i = 0; i < GIF_LENGTH; i++){
        canvas.height = video.videoHeight
        canvas.width = video.videoWidth
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
        // frames.push(canvas.toDataURL("image/jpeg"))
        await video.seekToNextFrame()
    }
}

function compareFrames(){
    for(let i = 0; i < GIF_LENGTH; i++){
        matchValues[i] = {
            value: pixelmatch(frames[0].data, frames[i].data, null, video.videoWidth, video.videoHeight, {threshold: 0.2}),
            index: i
        }
    }
    matchValues.sort((a, b) => {
        return a.value - b.value;
    })
}

function calcDelay(){
    let fps = document.getElementById("inputFPS").value
    if(fps == null)
        fps = 24
    return Math.round((1 / document.getElementById("inputFPS").value) * 1000);
}

function createGIF(lastFrame){
    let delay = calcDelay()
    var gif = new GIF({
        workers: 4,
        quality: 10,
        width: video.videoWidth,
        height: video.videoHeight
    })
    for(let i = 0; i < lastFrame; i++){
        gif.addFrame(frames[i], {delay: delay}) // 1s / n°fps = delay
    }
    gif.on("finished", (blob) => {
        window.open(URL.createObjectURL(blob))
    })
    gif.render()
}