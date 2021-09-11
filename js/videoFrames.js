const GIF_LENGTH = 100;
var video = document.getElementById("video")
var frames = Array()
var canvas = document.getElementById("frame")
var ctx = canvas.getContext("2d")
var matchValues = Array()

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
    /*let baseFrame = frames[0]
    for(let i = 1; i < frames.length; i++){
        if(frames[i] == baseFrame)
            console.log("Found another frame identical to baseFrame, id: " + i + "\n")
    }*/
    let differentFrameFound = false
    for(let i = 0; i < GIF_LENGTH; i++){
        matchValues[i] = pixelmatch(frames[0].data, frames[i].data, null, video.videoWidth, video.videoHeight)
    }
    for(let i = 0; i < matchValues.length; i++){
        if(differentFrameFound && matchValues[i] == 0){
            console.log("Found suitable frame, number " + i)
            return i;
        }
        else if(matchValues[i] != 0){
            differentFrameFound = true
        }
    }
    console.log("No suitable frame found.")
    return null;
}

function compareStrings(str1, str2){
    for(let i = 0; i < str1.length; i++){
        if(str1[i] != str2[i])
            return "Letter " + str1[i] + " at index " + i
    }
}

function createGIF(lastFrame){
    var gif = new GIF({
        workers: 2,
        quality: 10
    })
    for(let i = 0; i < lastFrame; i++){
        gif.addFrame(frames[i])
    }
    gif.on("finished", (blob) => {
        window.open(URL.createObjectURL(blob))
    })
    gif.render()
}