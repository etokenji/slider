//#region const
const intervalTime = 5000;
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const images = Array.prototype.slice.call(
  document.getElementsByClassName("slider-image")
);
//#endregion

let slider = null;

//#region event
window.onload = function() {
  let path_image = [
    "image/slider-image1.jpg",
    "image/slider-image2.jpg",
    "image/slider-image3.jpg",
    "image/slider-image4.jpg",
    "image/slider-image5.jpg"
  ];
  slider = new this.Slider(path_image, images);

  setTimeout(LoopSleep, 5000, 5000, slider, true);
};

btnPrev.onclick = function() {
  slider.Slide(false);
};

btnNext.onclick = function() {
  slider.Slide(true);
};

//#region method
function LoopSleep(_interval, _mainFunc, _param) {
    var interval = _interval;
    var mainFunc = _mainFunc;
    var param = _param;
  
    var loopFunc = function() {
      setTimeout(loopFunc, interval);
      mainFunc.Slide(param);
    };
    loopFunc();
  }
//#endregion