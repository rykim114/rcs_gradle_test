function absOffset(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);
    
    return {
        top: top,
        left: left
    };
};

// works out the X, Y position of the click inside the canvas from the X, Y position on the page
function getPosition(mouseEvent, sigCanvas) {
    var x, y;

//    if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
//        x = mouseEvent.pageX;
//        y = mouseEvent.pageY;
//    } else {
//        x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
//        y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
//    }

	var domWrapper = $(mouseEvent.currentTarget);

    x = mouseEvent.clientX + domWrapper.scrollLeft();
    y = mouseEvent.clientY + $('#contents').scrollTop();
    var abspo = absOffset(sigCanvas);

    x = x - abspo.left;
    y = y - abspo.top;
//    x = abspo.left;
//    y = abspo.top;
    
//    alert("2x = " + x + ", y = " + y);

    return { X: x, Y: y };
}




function canvasclear(id, imgsrc, x, y) {
    var s_canvas = document.getElementById(id);
    var context = s_canvas.getContext("2d");
    var deferred = $.Deferred();

    context.clearRect(0, 0, s_canvas.width, s_canvas.height);

    s_canvas.cPushArray = [];
    s_canvas.cStep = -1;
    
    if (imgsrc != null && imgsrc != "") {
        var img = new Image;
        img.onload = function () {
            
            context.drawImage(img, x, y);
            canvasPush(s_canvas);
            deferred.resolve();
        };
        img.src = imgsrc;
    }
    
    return deferred;
}

function canvasToImage(canvasid, imgid)
{
    var imgsrc = document.getElementById(canvasid).toDataURL();
    var img = $('#' + imgid);
    img.attr('src', imgsrc);
    img.show();

    $("#" + canvasid).hide();
    //$("#<%=txtSignData.ClientID%>").val(imgsrc);
}

function initialize(id, color, width) {
    // get references to the canvas element as well as the 2D drawing context
	
    var sigCanvas = document.getElementById(id);
    var context = sigCanvas.getContext("2d");
    context.strokeStyle = color;
    context.lineWidth = width;
    
    sigCanvas.cPushArray = [];
    sigCanvas.cStep = -1;
    
    canvasPush(sigCanvas);

    // This will be defined on a TOUCH device such as iPad or Android, etc.
    var is_touch_device = 'ontouchstart' in document.documentElement;
    if (is_touch_device) {
        // create a drawer which tracks touch movements
        var drawer = {
            isDrawing: false,
            touchstart: function (coors, sigCanvas) {
            	sigCanvas.scaleX = sigCanvas.width / $(sigCanvas).width();
            	sigCanvas.scaleY = sigCanvas.height / $(sigCanvas).height();
                context.beginPath();
                context.moveTo(coors.x * sigCanvas.scaleX, coors.y * sigCanvas.scaleY);
                this.isDrawing = true;
            },
            touchmove: function (coors, sigCanvas) {
                if (this.isDrawing) {
                    context.lineTo(coors.x * sigCanvas.scaleX, coors.y * sigCanvas.scaleY);
                    context.stroke();
                }
            },
            touchend: function (coors, sigCanvas) {
                if (this.isDrawing) {
//                    this.touchmove(coors);
                    this.isDrawing = false;
                    context.closePath();
                    canvasPush(sigCanvas);
                }
            },
            touchcancel: function(coors, sigCanvas) {
            	this.touchend(coors, sigCanvas);
            }
        };

        // create a function to pass touch events and coordinates to drawer
        function draw(event) {
            if (event.targetTouches.length==0) {
            	if ("touchend" === event.type || "touchcancel" === event.type) {
            		drawer[event.type](null, sigCanvas);
            	}
                return false;
            }

        	var domWrapper = $(event.currentTarget).closest(".modal");
        	
            // get the touch coordinates.  Using the first touch in case of multi-touch
            var coors = {
//                x: event.targetTouches[0].pageX,
//                y: event.targetTouches[0].pageY
                x: event.targetTouches[0].clientX + domWrapper.scrollLeft(),
                y: event.targetTouches[0].clientY + $('#contents').scrollTop()
            };

            // Now we need to get the offset of the canvas location
            var obj = sigCanvas;

            if (obj.offsetParent) {
                // Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.
                do {
                    coors.x -= obj.offsetLeft;
                    coors.y -= obj.offsetTop;
                }
                    // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
                    // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
                while ((obj = obj.offsetParent) != null);
            }

            // pass the coordinates to the appropriate handler
            drawer[event.type](coors, sigCanvas);
        }


        // attach the touchstart, touchmove, touchend event listeners.
        sigCanvas.addEventListener('touchstart', draw, false);
        sigCanvas.addEventListener('touchmove', draw, false);
        sigCanvas.addEventListener('touchend', draw, false);
        sigCanvas.addEventListener('touchcancel', draw, false);

        // prevent elastic scrolling
        sigCanvas.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, false);
    }
    else {

        // start drawing when the mousedown event fires, and attach handlers to
        // draw a line to wherever the mouse moves to
        
        $("#" + id).mousedown(function (mouseEvent) {

        	sigCanvas.scaleX = sigCanvas.width / $(sigCanvas).width();
        	sigCanvas.scaleY = sigCanvas.height / $(sigCanvas).height();
        	
            var position = getPosition(mouseEvent, sigCanvas);
            
            context.moveTo(position.X * sigCanvas.scaleX, position.Y * sigCanvas.scaleY);
            context.beginPath();

            // attach event handlers
            $(this).mousemove(function (mouseEvent) {
                drawLine(mouseEvent, sigCanvas, context);
            }).mouseup(function (mouseEvent) {
                finishDrawing(mouseEvent, sigCanvas, context);
            }).mouseout(function (mouseEvent) {
                finishDrawing(mouseEvent, sigCanvas, context);
            });
        });

    }
}

// draws a line to the x and y coordinates of the mouse event inside
// the specified element using the specified context
function drawLine(mouseEvent, sigCanvas, context) {
    var position = getPosition(mouseEvent, sigCanvas);
    console.log(position);
    context.lineTo(position.X * sigCanvas.scaleX, position.Y * sigCanvas.scaleY);
    context.stroke();
}

// draws a line from the last coordiantes in the path to the finishing
// coordinates and unbind any event handlers which need to be preceded
// by the mouse down event
function finishDrawing(mouseEvent, sigCanvas, context) {
    // draw the line to the finishing coordinates
    drawLine(mouseEvent, sigCanvas, context);

    context.closePath();
    
    canvasPush(sigCanvas);
    
    // unbind any events which could draw
    $(sigCanvas).unbind("mousemove")
                .unbind("mouseup")
                .unbind("mouseout");
}

function canvasPush(sigCanvas) {
    ++sigCanvas.cStep;
    if (sigCanvas.cPushArray.length > sigCanvas.cStep) {
    	sigCanvas.cPushArray.length = sigCanvas.cStep;
    }
	sigCanvas.cPushArray.push(sigCanvas.toDataURL());
}

function canvasUndo(id) {
    var sigCanvas = document.getElementById(id);
	if (0 < sigCanvas.cStep) {
		--sigCanvas.cStep;
		var canvasPic = new Image();
		canvasPic.src = sigCanvas.cPushArray[sigCanvas.cStep];
		canvasPic.onload = function() {
	    	var context = sigCanvas.getContext("2d");
			context.drawImage(canvasPic, 0, 0);
		}
	}

    return false;
}

function canvasRedo(id) {
    var sigCanvas = document.getElementById(id);
	if (sigCanvas.cPushArray.length - 1 > sigCanvas.cStep) {
		++sigCanvas.cStep;
		var canvasPic = new Image();
		canvasPic.src = sigCanvas.cPushArray[sigCanvas.cStep];
		canvasPic.onload = function() {
	    	var context = sigCanvas.getContext("2d");
	    	context.drawImage(canvasPic, 0, 0);
		}
	}

    return false;
}