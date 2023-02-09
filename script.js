
var canvas = document.getElementById("whiteCard");
var ctx = canvas.getContext("2d");
var sex = 'M';

var canvasOffset = $("#whiteCard").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

var startX;
var startY;
var isDown = false;

var pi2 = Math.PI * 2;
var resizerRadius = 8;
var rr = resizerRadius * resizerRadius;
var draggingResizer = {
    x: 0,
    y: 0
};
var img;
var imageX = 50;
var imageY = 50;
var imageWidth, imageHeight, imageRight, imageBottom;
var draggingImage = false;
var startX;
var startY;

const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
previewImg = document.querySelector(".preview-img img"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");

const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return;
    img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
        imageWidth = img.width;
        imageHeight = img.height;
        imageRight = imageX + imageWidth;
        imageBottom = imageY + imageHeight
        drawWhiteCard(true, false);
    } 
}

const saveImage = () => {
    drawWhiteCard(false,false);
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
    drawWhiteCard(true,false);
}

function checkSex(choose_sex) {
    sex = choose_sex;
    drawWhiteCard();
}

function drawWhiteCard(withAnchors, withBorders) {
    var name = document.getElementById("name").value;
    var validTo = document.getElementById("validTo").value;
    var type = document.getElementById("type").value;
    var serialNum = document.getElementById("serialNum").value;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f1efd5";
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, 15);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = "#00630d";
    ctx.fillRect(0, canvas.height * 0.3, canvas.width, 10);
    
    ctx.font = "bold 16px Arial"; 
    ctx.fillText(text_name, 50, canvas.height * 0.45);
    ctx.fillText(text_sex, 50, canvas.height * 0.45 + 25);
    ctx.fillText(text_validTo, 50, canvas.height * 0.45 + 50);
    ctx.fillText(text_type, 50, canvas.height * 0.45 + 75);
    ctx.fillText(text_serialNum, 50, canvas.height * 0.45 + 100);

    ctx.fillStyle = "black";
    ctx.font = "bold 18px Arial"; 
    ctx.fillText(header_ch, canvas.width/2 - ctx.measureText(header_ch).width/2, 40);
    ctx.fillText(header_en, canvas.width/2 - ctx.measureText(header_en).width/2, 70);
    ctx.fillText(name, 40 + ctx.measureText(text_name).width, canvas.height * 0.45);
    ctx.fillText(sex, 40 + ctx.measureText(text_sex).width, canvas.height * 0.45 + 25);
    ctx.fillText(validTo, 35 + ctx.measureText(text_validTo).width, canvas.height * 0.45 + 50);
    ctx.fillText(type, 40 + ctx.measureText(text_type).width, canvas.height * 0.45 + 75);
    ctx.fillText(serialNum, 35 + ctx.measureText(text_serialNum).width, canvas.height * 0.45 + 100);

    if (img != undefined) {
        ctx.drawImage(img, 0, 0, img.width, img.height, imageX, imageY, imageWidth, imageHeight);
    
        // optionally draw the draggable anchors
        if (withAnchors) {
            drawDragAnchor(imageX, imageY);
            drawDragAnchor(imageRight, imageY);
            drawDragAnchor(imageRight, imageBottom);
            drawDragAnchor(imageX, imageBottom);
        }

        // optionally draw the connecting anchor lines
        if (withBorders) {
            ctx.beginPath();
            ctx.moveTo(imageX, imageY);
            ctx.lineTo(imageRight, imageY);
            ctx.lineTo(imageRight, imageBottom);
            ctx.lineTo(imageX, imageBottom);
            ctx.closePath();
            ctx.stroke();
        }
    }
    
    ctx.restore();
}

function drawDragAnchor(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, resizerRadius, 0, pi2, false);
    ctx.closePath();
    ctx.fill();
}

function anchorHitTest(x, y) {
    var dx, dy;

    // top-left
    dx = x - imageX;
    dy = y - imageY;
    if (dx * dx + dy * dy <= rr) {
        return (0);
    }
    // top-right
    dx = x - imageRight;
    dy = y - imageY;
    if (dx * dx + dy * dy <= rr) {
        return (1);
    }
    // bottom-right
    dx = x - imageRight;
    dy = y - imageBottom;
    if (dx * dx + dy * dy <= rr) {
        return (2);
    }
    // bottom-left
    dx = x - imageX;
    dy = y - imageBottom;
    if (dx * dx + dy * dy <= rr) {
        return (3);
    }
    return (-1);

}

function hitImage(x, y) {
    return (x > imageX && x < imageX + imageWidth && y > imageY && y < imageY + imageHeight);
}

function handleMouseDown(e) {
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    draggingResizer = anchorHitTest(startX, startY);
    draggingImage = draggingResizer < 0 && hitImage(startX, startY);
}

function handleMouseUp(e) {
    draggingResizer = -1;
    draggingImage = false;
    drawWhiteCard(true, false);
}

function handleMouseOut(e) {
    handleMouseUp(e);
}

function handleMouseMove(e) {

    if (draggingResizer > -1) {

        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

        // resize the image
        switch (draggingResizer) {
            case 0:
                //top-left
                imageX = mouseX;
                imageWidth = imageRight - mouseX;
                imageY = mouseY;
                imageHeight = imageBottom - mouseY;
                break;
            case 1:
                //top-right
                imageY = mouseY;
                imageWidth = mouseX - imageX;
                imageHeight = imageBottom - mouseY;
                break;
            case 2:
                //bottom-right
                imageWidth = mouseX - imageX;
                imageHeight = mouseY - imageY;
                break;
            case 3:
                //bottom-left
                imageX = mouseX;
                imageWidth = imageRight - mouseX;
                imageHeight = mouseY - imageY;
                break;
        }

        if(imageWidth<25){imageWidth=25;}
        if(imageHeight<25){imageHeight=25;}

        // set the image right and bottom
        imageRight = imageX + imageWidth;
        imageBottom = imageY + imageHeight;

        // redraw the image with resizing anchors
        drawWhiteCard(true, true);

    } else if (draggingImage) {

        imageClick = false;

        mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

        // move the image by the amount of the latest drag
        var dx = mouseX - startX;
        var dy = mouseY - startY;
        imageX += dx;
        imageY += dy;
        imageRight += dx;
        imageBottom += dy;
        // reset the startXY for next time
        startX = mouseX;
        startY = mouseY;

        // redraw the image with border
        drawWhiteCard(false, true);
    }

}

$("#whiteCard").mousedown(function (e) {
    handleMouseDown(e);
});
$("#whiteCard").mousemove(function (e) {
    handleMouseMove(e);
});
$("#whiteCard").mouseup(function (e) {
    handleMouseUp(e);
});
$("#whiteCard").mouseout(function (e) {
    handleMouseOut(e);
});

saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
