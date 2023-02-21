class DrawingBoard {
  MODE = "NONE"; //NONE BRUSH ERASER
  IsMouseDown = false; //마우스가 눌린지 안눌린지 상태
  eraserColor = "#ffffff";
  canvasBgColor = "#ffffff";
  IsNavigatorVisible = false;
  undoArray = [];

  constructor() {
    this.assignElement();
    this.initContext();
    this.initCanvasBackgroundColor();
    this.addEvent();
  }

  assignElement() {
    this.containerEl = document.querySelector("#container");
    this.toolbarEl = this.containerEl.querySelector("#toolbar");
    this.canvasEl = this.containerEl.querySelector("#canvas");
    this.brushEl = this.toolbarEl.querySelector("#brush");
    this.colorPickerEl = this.toolbarEl.querySelector("#colorPicker");
    this.brushPanelEl = this.containerEl.querySelector("#brushPanel");
    this.brushSliderEl = this.brushPanelEl.querySelector("#brushSize");
    this.brushSizePreviewEl =
      this.brushPanelEl.querySelector("#brushSizePreview");

    this.eraserEl = this.toolbarEl.querySelector("#eraser");
    this.navigatorEl = this.toolbarEl.querySelector("#navigator");
    this.navigatorImageContainerEl = this.containerEl.querySelector("#imgNav");
    this.navigatorImageEl =
      this.navigatorImageContainerEl.querySelector("#canvasImg");
    this.undoEl = this.toolbarEl.querySelector("#undo");
    this.clearEl = this.toolbarEl.querySelector("#clear");
    this.downloadEl = this.toolbarEl.querySelector("#download");

    this.imgBrush = this.toolbarEl.querySelector("#imgBrush");
  }

  initContext() {
    this.context = this.canvasEl.getContext("2d");
  }
  initCanvasBackgroundColor() {
    this.context.fillStyle = this.canvasBgColor; //캔버스 직사각형 전체 배경채우기
    this.context.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height); //캔버스 직사각형 전체크기
  }
  addEvent() {
    this.brushEl.addEventListener("click", this.onClickBrush.bind(this));
    this.canvasEl.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvasEl.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvasEl.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.brushSliderEl.addEventListener(
      "input",
      this.onChangeBrushSize.bind(this)
    );
    this.colorPickerEl.addEventListener("input", this.onChangeColor.bind(this));
    this.canvasEl.addEventListener("mouseout", this.onMouseOut.bind(this));
    this.eraserEl.addEventListener("click", this.onClickEraser.bind(this));
    this.navigatorEl.addEventListener(
      "click",
      this.onClickNavigator.bind(this)
    );
    this.undoEl.addEventListener("click", this.onClickUndo.bind(this));
    this.clearEl.addEventListener("click", this.onClickClear.bind(this));
    this.downloadEl.addEventListener("click", this.onClickDownload.bind(this));
    this.imgBrush.addEventListener("click", this.onClickImgBrush.bind(this));
  }

  onClickImgBrush(event) {
    const IsActive = event.currentTarget.classList.contains("active");
    this.MODE = IsActive ? "NONE" : "IMGBRUSH";
    this.brushPanelEl.classList.toggle("hide");
    this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
    this.imgBrush.classList.toggle("active");
    this.brushEl.classList.remove("active");
    this.eraserEl.classList.remove("active");
  }

  onClickDownload() {
    this.downloadEl.href = this.canvasEl.toDataURL("image/jpeg", 1);
    this.downloadEl.download = "example.jpeg";
  }

  onClickClear() {
    this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.undoArray = [];
    this.updateNavigator();
    this.initCanvasBackgroundColor();
  }

  onClickUndo() {
    if (this.undoArray.length === 0) {
      alert("not able to undo ❌");
      return;
    }
    let previousDataUrl = this.undoArray.pop();
    let previousImage = new Image();
    previousImage.onload = () => {
      //이미지가 로드된 시점에
      this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height); //캔버스를 지우고 다시그림
      this.context.drawImage(
        //그릴이미지, 0,0기준,이미지는 900너비에 800높이그릴꺼고, 그리는데 바탕이 되는애는 0,0,900,800이다
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
    //실행취소 제한
    //최근상태 5개만 저장
    if (this.undoArray.length > 4) {
      //어레이에 길이가 5보다 크면 최근것만 저장
      this.undoArray.shift(); //배열에 맨앞에 넣었던걸 빼줌.
      this.undoArray.push(this.canvasEl.toDataURL());
    } else {
      //어레이길이가 5미만이면
      this.undoArray.push(this.canvasEl.toDataURL());
    }
  }

  onClickNavigator() {
    this.IsNavigatorVisible = !this.navigatorEl.classList.contains("active"); //네비게이트 안보이면 src업데이트 안함
    this.navigatorEl.classList.toggle("active");
    this.navigatorImageContainerEl.classList.toggle("hide");
    this.updateNavigator();
  }

  updateNavigator() {
    if (!this.IsNavigatorVisible) return;
    this.navigatorImageEl.src = this.canvasEl.toDataURL();
  }

  onClickEraser(event) {
    const IsActive = event.currentTarget.classList.contains("active");
    this.MODE = IsActive ? "NONE" : "ERASER";
    this.brushPanelEl.classList.add("hide");
    this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
    this.eraserEl.classList.toggle("active");
    this.brushEl.classList.remove("active");
    this.imgBrush.classList.remove("active");
  }

  onMouseOut() {
    if (this.MODE === "NONE") return;
    this.IsMouseDown = false;
    this.updateNavigator();
  }

  onChangeColor(event) {
    this.brushSizePreviewEl.style.background = `${event.target.value}`;
  }

  onChangeBrushSize(event) {
    this.brushSizePreviewEl.style.width = `${event.target.value}px`;
    this.brushSizePreviewEl.style.height = `${event.target.value}px`;
  }

  onMouseUp() {
    //마우스떼면 정지
    if (this.MODE === "NONE") return;
    this.IsMouseDown = false;
    this.updateNavigator();
  }

  onMouseMove(event) {
    //마우스가 움직이는대로 그려짐
    if (!this.IsMouseDown) return;

    const currentPosition = this.getMousePosition(event);
    if (this.MODE === "BRUSH" || this.MODE === "ERASER") {
      const currentPosition = this.getMousePosition(event);
      this.context.lineTo(currentPosition.x, currentPosition.y);
      this.context.stroke();
    }

    if (this.MODE === "IMGBRUSH") {
      const imgElem = new Image();
      imgElem.crossOrigin = "anonymous";
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
  }

  onMouseDown(event) {
    //시작점을 찍음
    if (this.MODE === "NONE") {
      return;
    }
    this.IsMouseDown = true;
    // this.context.beginPath();
    // this.context.lineCap = "round";
    const currentPosition = this.getMousePosition(event);
    this.context.moveTo(currentPosition.x, currentPosition.y); //펜의 위치

    if (this.MODE === "BRUSH") {
      this.context.beginPath();
      this.context.lineCap = "round";
      this.context.strokeStyle = this.colorPickerEl.value; //검은색 스트로크
      this.context.lineWidth = this.brushSliderEl.value; //라인두께
    } else if (this.MODE === "ERASER") {
      this.context.beginPath();
      this.context.lineCap = "round";
      this.context.strokeStyle = "#FFFFFF";
      this.context.lineWidth = this.eraserColor;
    } else if (this.MODE === "IMGBRUSH") {
      const imgElem = new Image();
      imgElem.crossOrigin = "anonymous";
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

    this.saveState(); //실행취소 제한
  }

  getMousePosition(event) {
    //마우스가 캔버스 위에서만 움직여야함
    const boundaries = this.canvasEl.getBoundingClientRect();
    return {
      x: event.clientX - boundaries.left,
      y: event.clientY - boundaries.top,
    };
  }

  onClickBrush(event) {
    const IsActive = event.currentTarget.classList.contains("active");
    this.MODE = IsActive ? "NONE" : "BRUSH";
    this.brushPanelEl.classList.toggle("hide");
    this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
    this.brushEl.classList.toggle("active");
    this.eraserEl.classList.remove("active");
    this.imgBrush.classList.remove("active");
  }
}

new DrawingBoard();
