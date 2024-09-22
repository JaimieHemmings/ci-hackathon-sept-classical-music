// use jquery in js file to make tidier
$(document).ready(function(){
    
// Map through each div inside wrapper
var matrix = $(".wrapper div")
.map(function () {
  // create variables for the div element
  var e = $(this),
    // The current position of the element
    o = e.offset(),
    // width of the element
    w = e.width(),
    // height of the element
    h = e.height();

  // Then return the coordinates and the element itself
  return {
    top: o.top,
    left: o.left,
    right: o.left + w,
    bottom: o.top + h,
    e: e,
  };
  // convert jQuery objectinto a JavaScript array
})
.get();

// Function that takes the clientX and clientY coordinates
function getCurrent(touch) {
// Filters the matrix to find any objects where the touch is inside the defined boundaries
const a = matrix.filter(
  ({ left, right, top, bottom }) =>
    touch.clientX > left &&
    touch.clientX < right &&
    touch.clientY > top &&
    touch.clientY < bottom
);

return a.length ? a[0].e : null;
}

// A function that takes in the touch events
var touchF = function (e) {
if (e.type == "mousemove") {
  // Get coordinates of touch
  var clientX = e.originalEvent.clientX;
  var clientY = e.originalEvent.clientY;
} else {
  
  // Get coordinates of touch
  var clientX = e.originalEvent.touches[0].clientX;
  var clientY = e.originalEvent.touches[0].clientY;
}

// Get element belonging to those coordinates
var currentTarget = getCurrent({
  clientX: clientX,
  clientY: clientY,
});

// Look for the highlighted element
var highlightElem = document.getElementById("highlight");

// If it exists (i.e. it isn't the first click)
if (highlightElem) {
  // remove id
  highlightElem.removeAttribute("id");
}

if (currentTarget != null) {
  // highlight the current element
  currentTarget[0].setAttribute("id", "highlight");
}
};

// bind the touchF function to just inside the wrapper for touch move and start
$(".wrapper").bind({
touchstart: touchF,
touchmove: touchF,
mousemove: touchF,
});

});