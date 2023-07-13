
    // select the SVG element
    var svgMap = document.getElementById('allSvg');

    // these will hold the current position of the mouse
    var currentX = 0;
    var currentY = 0;

    // this will hold the current scale of the SVG
    var scale = 1;

    // these will hold the position of the SVG when the drag starts
    var initialX = 0;
    var initialY = 0;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoveX = 0;
    let touchMoveY = 0;

    // add the mousedown event listener to start the drag
    svgMap.addEventListener('mousedown', function(event) {
        // set the initial positions when the drag starts
        initialX = event.clientX - currentX;
        initialY = event.clientY - currentY;

        // add the mousemove and mouseup event listeners
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', stopDrag);
    });

    svgMap.addEventListener('touchstart', function(e) {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    svgMap.addEventListener('touchmove', function(e) {
        e.preventDefault();
        touchMoveX = e.touches[0].clientX;
        touchMoveY = e.touches[0].clientY;
    
        let dx = touchMoveX - touchStartX;
        let dy = touchMoveY - touchStartY;
    
        currentX += dx;
        currentY += dy;
    
        svgMap.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
    
        touchStartX = touchMoveX;
        touchStartY = touchMoveY;
    });
    
    svgMap.addEventListener('touchend', function(e) {
        e.preventDefault();
        // handle end of touch event
    });

    // add the wheel event listener to zoom in and out
    svgMap.addEventListener('wheel', function(event) {
        // prevent the default scroll behavior
        event.preventDefault();

        // remember the old scale
          var oldScale = scale;
          console.log("oldScale: ", oldScale);  // debug oldScale
        // calculate the new scale
        scale += event.deltaY * -0.001; 
        console.log("newScale: ", scale);  // debug newScale

        // restrict scale to reasonable values
        scale = Math.min(Math.max(.75, scale), 4);

        // calculate the mouse position relative to the SVG's parent element
        var x = event.clientX - svgMap.parentElement.offsetLeft;
        var y = event.clientY - svgMap.parentElement.offsetTop;
        console.log("mouseX: ", x);  // debug mouse X position
        console.log("mouseY: ", y);  // debug mouse Y position

        // calculate the translation needed to keep the mouse over the same point in the SVG
        // currentX -= x * (1 - oldScale / scale);
        // currentY -= y * (1 - oldScale / scale);
        console.log("currentX: ", currentX);  // debug currentX
        console.log("currentY: ", currentY);  // debug currentY

        // update the transform property to include the new position and scale
        // svgMap.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px) scale(' + scale + ')';
        svgMap.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px) scale(' + scale + ')';
    }, { passive: false });  // add this to indicate that we're calling preventDefault in the event handler

    // this function is called when the mouse is moved
    function drag(event) {
        // update the current position of the mouse
        currentX = event.clientX - initialX;
        currentY = event.clientY - initialY;

        // update the transform property to include the new position and current scale
        svgMap.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px) scale(' + scale + ')';
    }

    // this function is called when the mouse button is released
    function stopDrag() {
        // remove the mousemove and mouseup event listeners
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', stopDrag);
    }
