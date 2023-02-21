## Drawing Board

![ezgif com-crop (6)](https://user-images.githubusercontent.com/94214512/220246922-49560e29-2a01-48bd-9eac-64d6981e5a55.gif)

This is a simple drawing board that I created with canvas

### Goals of the project

1. Use canvas properties and make a drawing board that a user can draw a line, change colors and thickness of lines, place an image, erase, undo, total delete, download, and mini navigator.

### Languages

HTML, SCSS, Javascript, Parcel

### Features

**canvas**

- how to draw the lines

  - beginPath(): This method begins a new path, which means any previously drawn lines or shapes will not be affected by subsequent drawing operations. It's good practice to call beginPath() at the start of each new shape or line you draw.

  - moveTo(): This method sets the starting point for a line or shape. You can think of it as moving a pen to a new location without actually drawing a line.

  - lineTo(): This method creates a line from the current pen position (set by moveTo()) to a new position. The line is not actually drawn until you call the stroke() method.

```js
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveTo(50, 50); // Move pen to (50, 50)
ctx.lineTo(100, 100); // Draw line to (100, 100)
ctx.lineTo(0, 100); // Draw line to (0, 100)
ctx.closePath(); // Draw line back to (50, 50) to complete the triangle
ctx.stroke(); // Actually draw the lines
```

---

**event.currentTarget vs event.target** <br>

- event.target : <br>
  event.target refers to the element on which the event was originally triggered, i.e. the element that initiated the event. For example, if you click a button, the event.target would refer to that button.

- event.currentTarget : <br>
  event.currentTarget, on the other hand, refers to the element that the event listener is attached to, i.e. the element that is currently handling the event. For example, if you have a click event listener attached to a parent element that contains several child elements, event.currentTarget would refer to the parent element, while event.target would refer to the specific child element that was clicked.

```php
<div id="parent">
  <button>Click me!</button>
</div>

<script>
  const parent = document.querySelector('#parent');
  parent.addEventListener('click', function(event) {
    console.log('currentTarget:', event.currentTarget);
    console.log('target:', event.target);
  });
</script>
```

```js
currentTarget: <div id="parent">
  <button>Click me!</button>
</div>;
target: <button>Click me!</button>;
```

As you can see, event.currentTarget refers to the parent element div, while event.target refers to the button element.

---

**undo function** <br>

```js
//when a user click 'undo' icon
onClickUndo() {
    if (this.undoArray.length === 0) {
      alert("you have reached the undo limit💩");
      return;
    }
    let previousDataUrl = this.undoArray.pop(); //pop removes the last element from an array and returns that element.
    let previousImage = new Image();
    previousImage.onload = () => {
      this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height); //clear the canvas and redraw
      this.context.drawImage(
        previousImage,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height
      );
    };
    previousImage.src = previousDataUrl;
    this.navigatorImageEl.src = previousDataUrl;
  }

  saveState() {
    //limit number of undos allowed
    //Save only the last 5 statuses
    if (this.undoArray.length > 4) {
      this.undoArray.shift(); //shift() that removes the first item in the array.
      this.undoArray.push(this.canvasEl.toDataURL()); //push() that adds one or more elements to the end of an array
    } else {
      this.undoArray.push(this.canvasEl.toDataURL());
    }
  }

  onMouseDown(){
    //mousedown event
    //starting point on the canvas.
    if (this.MODE === "NONE") { // total of four modes : NONE, BRUSH, IMGBRUSH, ERASER
      return;
    }
    this.IsMouseDown = true;
    const currentPosition = this.getMousePosition(event);
    this.context.moveTo(currentPosition.x, currentPosition.y);  // Set the starting point for a new path

    if (this.MODE === "BRUSH") {
      this.context.beginPath(); //start a new path
      this.context.lineCap = "round";
      this.context.strokeStyle = this.colorPickerEl.value; //<input type="color">
      this.context.lineWidth = this.brushSliderEl.value; //<input type="range">
    } else if (this.MODE === "ERASER") {
      this.context.beginPath();
      this.context.lineCap = "round";
      this.context.strokeStyle = this.eraserColor; //#FFFFFF
      this.context.lineWidth = this.eraserColor; //#FFFFFF
    } else if (this.MODE === "IMGBRUSH") {
      const imgElem = new Image();
      imgElem.crossOrigin = "anonymous"; //set the crossOrigin property to "anonymous" before loading the image.
      imgElem.src =
        "https://cdn.pixabay.com/photo/2018/02/17/20/00/person-3160763_1280.png";
      imgElem.onload = () => {
        this.context.drawImage(
          imgElem,
          currentPosition.x,
          currentPosition.y,
          50,
          50
        );
      };
    }
    this.saveState();
  }
```

**_How to save canvas image_**

- Canvas API provides a method called toDataURL()
- This method immediately returns the canvas area as a base64 value. You can put this value in a variable and use it.
  - If you want to adjust details, you can set the type and quality like canvas.toDataURL(image format, quality). For example, canvas.toDataURL('image/jpeg', 1)
  - Quality is set to a value between 0 and 1

**_What is crossOrigin?_** <br>
crossOrigin is an attribute that provides support to Cross-Origin Resource Sharing (CORS), defining how certain elements should handle cross-origin requests. In my project, I had to set the attribute to "anonymous" in order to avoid errors caused by the Same-Origin Policy. By doing this, the browser will treat the image as anonymous content and the script accesses the image data from a different domain.

### Reference Links

[HTMLCanvasElement.toDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)
[CanvasRenderingContext2D.drawImage()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)

### Self-reflection

It was good practice utilizing canvas and SCSS in a mini-project.
