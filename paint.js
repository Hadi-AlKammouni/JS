const canvas = document.querySelector("canvas")
tool_btns = document.querySelectorAll(".tool")
fill_color = document.querySelector("#fill-color")
size_slider = document.querySelector("#size-slider")
color_btns = document.querySelectorAll(".colors .option")
color_picker = document.querySelector("#color-picker")
clear_canvas = document.querySelector(".clear-canvas")
save_img = document.querySelector(".save-img")

ctx = canvas.getContext("2d") // getContext() method returns a drawing context on the canvas

// declaring global variables with default values
let prevMouseX, prevMouseY, snapshot, 
isDrawing = false
selectedTool = "brush"
brushWidth = 5
selectedColor = "#000"

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = selectedColor
}

window.addEventListener("load", () => {
    // to return viewable width/height of an element
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBackground()
})

const drawRect = (e) => {
    if(!fill_color.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

const drawCircle = (e) => {
    ctx.beginPath()
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + (prevMouseY - e.offsetY), 2)
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2*Math.PI)
    fill_color.checked ? ctx.fill() : ctx.stroke()
}

const drawTriangle = (e) => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY) // moving the triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY) // creating the buttom angle of the triangle
    ctx.closePath()
    fill_color.checked ? ctx.fill() : ctx.stroke()
}

const startDraw = (e) => {
    isDrawing = true
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath() // creating new path to draw
    ctx.lineWidth = brushWidth // passing brushSize as line width
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

const drawing = (e) => {
    if(!isDrawing) return
    ctx.putImageData(snapshot, 0, 0) // adding copied canvas data on to this canvas

    if(selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" :selectedColor
        // lineTo() creates a new line.. ctx.lineTo(x-coord., y-coord.)
        // offsetX and offsetY returns x and y coordinates of the mouse pointer
        ctx.lineTo(e.offsetX, e.offsetY) // creating line according to mouse pointer
        ctx.stroke() //drawing/filling line with color
    } else if (selectedTool === "rectangle") {
        drawRect(e)
    } else if (selectedTool === "circle") {
        drawCircle(e)
    } else {
        drawTriangle(e)
    }

}

tool_btns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // changing dynamically the active class
        document.querySelector(".options .active").classList.remove("active")
        btn.classList.add("active")
        selectedTool = btn.id
        console.log(selectedTool)
    })    
});

size_slider.addEventListener("change", () => brushWidth = size_slider.value)

color_btns.forEach(btn => {
    btn.addEventListener("click", () => {
        // changing dynamically the selected class
        document.querySelector(".options .selected").classList.remove("selected")
        btn.classList.add("selected")
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")
    })
})

color_picker.addEventListener("change", () => {
    color_picker.parentElement.style.background = color_picker.value
    color_picker.parentElement.click()
})

clear_canvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setCanvasBackground()
})

save_img.addEventListener("click", () => {
    const link = document.createElement("a")
    link.download = `${Date.now()}.jpg`
    link.href = canvas.toDataURL()
    link.click()
})

canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", () => isDrawing = false)