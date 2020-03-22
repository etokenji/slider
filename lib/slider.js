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
//#endregion

//#region class

//スライダークラス
//コンストラクラ引数1:イメージパスの配列
//コンストラクタ引数2:表示されているイメージ要素の配列(3つを想定)
var Slider = function(image_src, images) {
  this.ImageSrc = image_src;
  this.ImageEle = images;
  // true:処理中 false:なにもしていない
  this.Processing = false;
};

Slider.prototype.Slide = function(isNext) {
  if (this.Processing) {
    return;
  }
  this.Processing = true;
  let plusStr = "";
  if (isNext) {
    plusStr = "-";
  }
  let transX = this.ImageEle[0].width;

  this.ImageEle.forEach(element => {
    element.classList.add(isNext ? "slider-next" : "slider-prev");
  });

  let centerImage = "";
  centerImage = isNext ? this.ImageEle[2].src : this.ImageEle[0].src;

  // 処理完了後、一定時間経過しないと上手くいかないため
  setTimeout(
    function(_slider) {
      // prev,nextのイメージを変更する
      // 配置をもとに戻す
      _slider.ImageEle.forEach(function(element, index) {
        element.src = centerImage;
        element.classList.remove("slider-image-trans");
        element.classList.remove(isNext ? "slider-next" : "slider-prev");

        switch (index) {
          case 0:
            _slider.ImageEle[0].src = GetPrevImage(
              centerImage,
              slider.ImageSrc
            );
            break;
          case 1:
            _slider.ImageEle[1].src = centerImage;
            break;
          case 2:
            _slider.ImageEle[2].src = GetNextImage(
              centerImage,
              slider.ImageSrc
            );
            break;
        }
      });

      setTimeout(
        function(_slider) {
          _slider.ImageEle.forEach(element => {
            element.classList.add("slider-image-trans");
          });
          _slider.Processing = false;
        },
        100,
        _slider
      );
    },
    400,
    this
  );
};

//#endregion

// #region private method
function GetNextImage(centerImg, path_images) {
  let nextImg = path_images[0];
  let findFlg = false;

  for (i = 0; i < path_images.length; i++) {
    if (findFlg) {
      nextImg = path_images[i];
      break;
    }

    if (centerImg.indexOf(path_images[i]) != -1) {
      findFlg = true;
    }
  }
  return nextImg;
}

function GetPrevImage(centerImg, path_images) {
  let prevImg = path_images[path_images.length - 1];
  let findFlg = false;

  for (i = 0; i < path_images.length; i++) {
    if (centerImg.indexOf(path_images[i]) != -1) {
      findFlg = true;
    }

    if (findFlg) break;

    prevImg = path_images[i];
  }
  return prevImg;
}

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
