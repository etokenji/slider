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
  slider = new this.Slider(path_image, images, true);

  slider.SlideLoop(intervalTime);
};

btnPrev.onclick = function() {
  slider.Slide(false);
};

btnNext.onclick = function() {
  slider.Slide(true);
};

window.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37 /* ← */:
      slider.Slide(false);
      break;
    case 39 /* → */:
      slider.Slide(true);
      break;
  }
};

//#region method

//#endregion
