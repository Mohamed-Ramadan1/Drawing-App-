const canvas = document.querySelector("canvas"),
    tooLBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#Size-slider"),
    colorsBtn = document.querySelectorAll(".colors .option"),
    colorPacker = document.querySelector("#color-picker"),
    clearBtn = document.querySelector(".clear-canvas"),
    downloadBtn = document.querySelector(".save-img"),
    ctx = canvas.getContext("2d");

let prevMouseX,prevMouseY,snapshot,
    isDrawing = false,
    selectedTool = "brush",
    slectedColor= "#000",
    brushWidth = 5;


// set the background of the downolad image to white 
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = slectedColor;
};

//get the width and the height
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
}); 

// drawing rectangle function;
const drawRect = (e) => {
    if (!fillColor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }

    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);

    
}

// Drawing the circle function
const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
    ctx.stroke();
    // depending on the fill state draw fill or strock circle .
    fillColor.checked ? ctx.fill() : ctx.stroke();
    
};


// Drawing triangle.
const drawTringle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath()
    ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke();

};


// Drawing 
const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : slectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    }  else if (selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "triangle") {
        drawTringle(e);
    }
};

// start Drawing 
const startDraw = (e) => {
    isDrawing = true;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    // get the postion of the x and y .
    prevMouseX = e.offsetX;  
    prevMouseY = e.offsetY;

    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = slectedColor;
    ctx.fillStyle = slectedColor;
    
}
// stop Drawing
const stopDraw = () => {
    isDrawing = false;
}

// contrall on the active class .
tooLBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

// the colors controles change and mange.
colorsBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".colors .selected").classList.remove("selected");
        btn.classList.add("selected");
        slectedColor= window.getComputedStyle(btn).getPropertyValue("background-color")
    });
});


// controll on the color packer.
colorPacker.addEventListener("change", () => {
    colorPacker.parentElement.style.background = colorPacker.value;
    colorPacker.parentElement.click();
});

//clear the canvas.
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0,0,canvas.width,canvas.height)
});

// downolad the image .
downloadBtn.addEventListener("click", () => {
    let link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});




// contrall on the width of the drawing line .
sizeSlider.addEventListener("change", ()=>brushWidth=sizeSlider.value);

canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);
