//#region const
const path_image = [
  "image/slider-image1.jpg",
  "image/slider-image2.jpg",
  "image/slider-image3.jpg",
  "image/slider-image4.jpg",
  "image/slider-image5.jpg"
];
const intervalTime = 5000;
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const imgSlide = document.getElementById("sliderImage");
//#endregion

//#region event
window.onload = function() {
  window.setTimeout(
    this.LoopSleep(intervalTime, this.ChangeNextImage),
    intervalTime
  );
};

btnPrev.onclick = function() {
  ChangePrevImage();
};

btnNext.onclick = function() {
  ChangeNextImage();
};
//#endregion

// #region private method
function ChangeNextImage() {
  let nowImg = imgSlide.src;
  let nextImg = path_image[0];
  let findFlg = false;

  for (i = 0; i < path_image.length; i++) {
    if (findFlg) {
      nextImg = path_image[i];
      break;
    }

    if (nowImg.indexOf(path_image[i]) != -1) {
      findFlg = true;
    }
  }
  imgSlide.src = nextImg;
}
function ChangePrevImage() {
  let nowImg = imgSlide.src;
  let prevImg = path_image[path_image.length - 1];
  let findFlg = false;

  for (i = 0; i < path_image.length; i++) {
    if (nowImg.indexOf(path_image[i]) != -1) {
      findFlg = true;
    }

    if (findFlg) break;

    prevImg = path_image[i];
  }
  imgSlide.src = prevImg;
}

function LoopSleep(_interval, _mainFunc) {
  var interval = _interval;
  var mainFunc = _mainFunc;
  var loopFunc = function() {
    setTimeout(loopFunc, interval);
    mainFunc();
  };
  loopFunc();
}

//#endregion
