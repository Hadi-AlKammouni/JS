const canvas = document.querySelector("canvas")

ctx = canvas.getContext("2d") // getContext() method returns a drawing context on the canvas

let isDrawing = false

window.addEventListener("load", () => {
    // to return viewable width/height of an element
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
})

const drawing = (e) => {
    if(!isDrawing) return
    // lineTo() creates a new line.. ctx.lineTo(x-coord., y-coord.)
    // offsetX and offsetY returns x and y coordinates of the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY) // creating line according to mouse pointer
    ctx.stroke() //drawing/filling line with color
}

canvas.addEventListener("mouseover", drawing)