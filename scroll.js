var svgMap = document.getElementById('allSvg');
var currentX = 0;
var currentY = 0;
var scale = 1;
var isDragging = false;
var dragStartX, dragStartY;
var dragLastX, dragLastY;
var initialPinchDistance = 0;

function handleStart(e) {
    if (e.touches) {
        if (e.touches.length === 2) {
            initialPinchDistance = getPinchDistance(e);
        } else {
            dragStartX = e.touches[0].clientX;
            dragStartY = e.touches[0].clientY;
        }
    } else {
        dragStartX = e.clientX;
        dragStartY = e.clientY;
    }
    dragLastX = dragStartX;
    dragLastY = dragStartY;
    isDragging = true;
}

function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    if (e.touches && e.touches.length === 2) {
        // Pinch-to-zoom
        var currentPinchDistance = getPinchDistance(e);
        var pinchScale = currentPinchDistance / initialPinchDistance;
        scale = Math.min(Math.max(0.75, scale * pinchScale), 4);
        initialPinchDistance = currentPinchDistance;
    } else {
        // Regular dragging
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        var deltaX = clientX - dragLastX;
        var deltaY = clientY - dragLastY;
        
        currentX += deltaX;
        currentY += deltaY;
        
        dragLastX = clientX;
        dragLastY = clientY;
    }
    
    updateTransform();
}

function handleEnd(e) {
    isDragging = false;
    initialPinchDistance = 0;
}

function updateTransform() {
    requestAnimationFrame(() => {
        svgMap.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${scale})`;
    });
}

function handleWheel(e) {
    e.preventDefault();
    var delta = e.deltaY * -0.001;
    scale = Math.min(Math.max(0.75, scale + delta), 4);
    updateTransform();
}

function getPinchDistance(e) {
    return Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
    );
}

function initializeSvgPosition() {
    var isMobile = window.innerWidth <= 768;
    var svgRect = svgMap.getBoundingClientRect();
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;

    if (isMobile) {
        //mobile
        scale = 2;
        currentX = (viewportWidth - svgRect.width) / 2;
        currentY = (viewportHeight - svgRect.height) / 2;
    } else {
        //PC
        scale = 1;
        currentX = (viewportWidth - svgRect.width) / 2 - 500;
        currentY = (viewportHeight - svgRect.height) / 2 - 50;
    }

    // Calculate the position to center the SVG

    // Reset the SVG's position before applying our calculated transform
    svgMap.style.left = '0';
    svgMap.style.top = '0';

    updateTransform();

    console.log('SVG Rect:', svgRect);
    console.log('Viewport:', viewportWidth, viewportHeight);
    console.log('Calculated Position:', currentX, currentY);
}

function updateTransform() {
    requestAnimationFrame(() => {
        svgMap.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    });
}

// Attach events to the document
document.addEventListener('mousedown', handleStart);
document.addEventListener('touchstart', handleStart, { passive: false });

document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove, { passive: false });

document.addEventListener('mouseup', handleEnd);
document.addEventListener('touchend', handleEnd);

window.addEventListener('load', initializeSvgPosition);
window.addEventListener('resize', initializeSvgPosition);

svgMap.addEventListener('wheel', handleWheel, { passive: false });

// For tapping on mobile
svgMap.addEventListener('touchend', function(e) {
    if (e.touches.length === 0 && // All fingers are lifted
        Math.abs(e.changedTouches[0].clientX - startX) < 10 &&
        Math.abs(e.changedTouches[0].clientY - startY) < 10) {
        let element = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        if (element && element.classList.contains('allPaths')) {
            element.dispatchEvent(new Event('tap'));
        }
    }
});