const GIF_LENGTH = 100;
var video = document.getElementById("video")
var frames = Array()
var canvas = document.getElementById("frame")
var ctx = canvas.getContext("2d")
var matchValues = Array()
var createdGIF
var videoURL

document.getElementById("videoUpload").onchange = (event) => {
    try{
        if(HTMLMediaElement.prototype.seekToNextFrame){
            resetEverything()
            let file = event.target.files[0]
            videoURL = URL.createObjectURL(file)
            video.src = videoURL
            document.getElementById("searchFrames").disabled = false
        }
        else
            throw "Attention! It seems you're not using Firefox (or any other browser with Gecko). This website will not work correctly in Google Chrome or similar browsers."
    }
    catch(e){
        alert(e)
    }
}

document.getElementById("searchFrames").onclick = async () => {
    try{
        setLoadingScreen("on")
        await captureFrame()
        compareFrames()
        document.getElementById("thirdStep").style.display = "block"
        document.getElementById("searchFrames").disabled = true
        setLoadingScreen("off")
    }
    catch(e){
        alert(e)
    }
}

document.getElementById("createGif").onclick = () => {
    try{
        setLoadingScreen("on")
        createGIF(document.getElementById("inputFrame").value)
    }
    catch(e){
        alert(e)
    }
}

document.getElementById("qualitySlider").onchange = () => {
    document.getElementById("qualitySliderValue").innerText = document.getElementById("qualitySlider").value
}

function resetVariables(){
    frames = Array()
    matchValues = Array()
}

function resetEverything(){
    resetVariables()
    document.getElementById("thirdStep").style.display = "none"
    document.getElementById("searchFrames").disabled = true
    let table = document.getElementById("frameSuggestions")
    document.getElementsByTagName("tbody")[0].innerHTML = table.rows[0].innerHTML
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
    for(let i = 0; i < GIF_LENGTH; i++){
        setFrameSuggestion(matchValues[i].index, matchValues[i].value)
    }
}

function setFrameSuggestion(index, value){
    let table = document.getElementById("frameSuggestions")
    let row = table.insertRow()
    let td1 = row.insertCell()
    let td2 = row.insertCell()
    td1.innerHTML = index
    td2.innerHTML = value
}

function calcDelay(){
    let fps = document.getElementById("inputFPS").value
    if(fps == "")
        fps = 24
    return Math.round((1 / fps) * 1000);
}

function createGIF(lastFrame){
    let delay = calcDelay()
    let quality = document.getElementById("qualitySlider").value
    if(lastFrame == undefined || lastFrame == null || lastFrame > 100 || lastFrame < 0)
        throw "Error! The chosen last frame is not valid!"
    var gif = new GIF({
        workers: 4,
        quality: quality,
        width: video.videoWidth,
        height: video.videoHeight
    })
    for(let i = 0; i < lastFrame; i++){
        gif.addFrame(frames[i], {delay: delay}) // 1s / n°fps = delay
    }
    gif.on("finished", (blob) => {
        setLoadingScreen("off")
        createdGIF = URL.createObjectURL(blob) 
        window.open(createdGIF)
    })
    gif.render()
}