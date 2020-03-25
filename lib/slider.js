//スライダークラス
//コンストラクラ引数1:イメージパスの配列
//コンストラクタ引数2:表示されているイメージ要素の配列(3つを想定)
var Slider = function(image_src, images) {
  // アニメーション設定
  this.Transition_property = "all";
  this.Transition_delay = "0s";
  this.Transition_duration = "300ms";
  this.Transition_timing_function = "ease";
  this.Transition_;
  this.TranslateX = images[0].width;

  this.ImageSrc = image_src;
  this.ImageEle = images;
  this.CenterImage = images[1].src;

  // true:処理中 false:なにもしていない
  this.Processing = false;

  this.ImageEle.forEach(element => {
    // transition初期値セット
    element.style.transitionProperty = this.Transition_property;
    element.style.transitionDelay = this.Transition_delay;
    element.style.transitionDuration = this.Transition_duration;
    element.style.transitionTimingFunction = this.Transition_timing_function;

    // スライド完了後イベント付与
    element.addEventListener("transitionend", ResetImages.bind(this), 200);
    // アニメーション再セット処理を付与
    element.addEventListener("load", SetTransition.bind(this));
  });
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

  this.CenterImage = isNext ? this.ImageEle[2].src : this.ImageEle[0].src;
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

// スライド完了イベント付与、スライドアニメーション初期値セット
function ResetImages() {
  this.ImageEle.forEach(function(element, index) {
    // アニメーション解除・位置戻し
    element.src = this.CenterImage;
    element.style.transitionProperty = "";
    element.style.transitionDelay = "";
    element.style.transitionDuration = "";
    element.style.transitionTimingFunction = "";
    element.style.transform = "translateX(0px)";

    switch (index) {
      case 0:
        this.ImageEle[0].src = GetPrevImage(this.CenterImage, this.ImageSrc);
        break;
      case 1:
        this.ImageEle[1].src = this.CenterImage;
        break;
      case 2:
        this.ImageEle[2].src = GetNextImage(this.CenterImage, this.ImageSrc);
        break;
    }
  }, this);
}

// アニメーション元に戻す
function SetTransition() {
  this.ImageEle.forEach(function(element) {
    element.style.transitionProperty = this.Transition_property;
    element.style.transitionDelay = this.Transition_delay;
    element.style.transitionDuration = this.Transition_duration;
    element.style.transitionTimingFunction = this.Transition_timing_function;
  }, this);
  this.Processing = false;
}
//#endregion
