// イベント内で使用する(もっとよい方法ないか、)
let _slider = null;
let _centerImage = null;

//スライダークラス
//コンストラクラ引数1:イメージパスの配列
//コンストラクタ引数2:表示されているイメージ要素の配列(3つを想定)
var Slider = function(image_src, images) {
  _slider = this;

  this.Transition_property = "all";
  this.Transition_delay = "300ms";
  this.Transition_duration = "0s";
  this.Transition_timing_function = "ease";

  this.Transition_;
  this.TranslateX = images[0].width;
  this.ImageSrc = image_src;
  this.ImageEle = images;
  // true:処理中 false:なにもしていない
  this.Processing = false;

  this.ImageEle.forEach(element => {
    // transition初期値セット
    element.style.transitionProperty = this.Transition_property;
    element.style.transitionDelay = this.Transition_delay;
    element.style.TransitionDuration = this.Transition_duration;
    element.style.TransitionTimingFunction = this.Transition_timing_function;

    // スライド完了後
    element.addEventListener("transitionend", function() {
      // イベント内でsliderクラスに干渉できない。。
      _slider.ImageEle.forEach(function(element, index) {
        element.src = _centerImage;
        element.style.transitionProperty = "";
        element.style.transitionDelay = "";
        element.style.TransitionDuration = "";
        element.style.TransitionTimingFunction = "";
        element.style.transform = "translateX(0px)";

        switch (index) {
          case 0:
            this.ImageEle[0].src = GetPrevImage(_centerImage, slider.ImageSrc);
            break;
          case 1:
            this.ImageEle[1].src = _centerImage;
            break;
          case 2:
            this.ImageEle[2].src = GetNextImage(_centerImage, slider.ImageSrc);
            break;
        }
      }, _slider);

      setTimeout(
        function(_slider) {
          // アニメーション元に戻す
          _slider.ImageEle.forEach(element => {
            element.style.transitionProperty = this.Transition_property;
            element.style.transitionDelay = this.Transition_delay;
            element.style.TransitionDuration = this.Transition_duration;
            element.style.TransitionTimingFunction = this.Transition_timing_function;
          }, _slider);
          _slider.Processing = false;
        },
        100,
        _slider
      );
    });
  }, this);
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

  this.ImageEle.forEach(element => {
    element.style.transform = isNext
      ? "translateX(-" + this.TranslateX + "px)"
      : "translateX(" + this.TranslateX + "px)";
  });

  _centerImage = isNext ? this.ImageEle[2].src : this.ImageEle[0].src;
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
//#endregion
