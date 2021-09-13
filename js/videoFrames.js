const GIF_LENGTH = 100;
var video = document.getElementById("video")
var frames = Array()
var canvas = document.getElementById("frame")
var ctx = canvas.getContext("2d")
var matchValues = Array()

document.getElementById("videoUpload").onchange = (event) => {
    resetEverything()
    let file = event.target.files[0]
    let blobUrl = URL.createObjectURL(file)
    video.src = blobUrl
    document.getElementById("searchFrames").disabled = false
}

document.getElementById("searchFrames").onclick = async () => {
    setLoadingScreen("on")
    await captureFrame()
    compareFrames()
    document.getElementById("thirdStep").style.display = "block"
    document.getElementById("searchFrames").disabled = true
    setLoadingScreen("off")
}

document.getElementById("createGif").onclick = () => {
    createGIF(document.getElementById("inputFrame").value)
}

function resetVariables(){
    frames = Array()
    matchValues = Array()
}

function resetEverything(){
    resetVariables()
    document.getElementById("thirdSteè").style.display = "none"
    document.getElementById("searchFrames").disabled = true
}

function setLoadingScreen(status){
    if(status == "on"){
        document.getElementById("loadingScreen").style.display = "block"
    }
    else if(status == "off"){
        document.getElementById("loadingScreen").style.display = "none"
    }
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
    if(fps == "")
        fps = 24
    return Math.round((1 / fps) * 1000);
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