//スライダークラス
//コンストラクラ引数1:イメージパスの配列
//コンストラクタ引数2:表示されているイメージ要素の配列(3つを想定)
var Slider = function(image_src, images) {
  // 固定値CSSはここで作成しておく
  CreateStyle(images[0].height, images[0].width);

  // アニメーション設定
  this.Transition_property = "all";
  this.Transition_delay = "0s";
  this.Transition_duration = "300ms";
  this.Transition_timing_function = "ease";
  this.Transition_;
  this.TranslateX = images[0].width;

  // image関連
  this.ImageSrc = image_src;
  this.ImageEle = images;
  this.CenterImage = images[1].src;

  // true:処理中 false:なにもしていない
  this.Processing = false;

  // プログレス関連
  this.NowImageIndex = 0;
  this.TranslateX4Bar = images[0].width / image_src.length;
  this.TranslateY4Bar = images[0].height / image_src.length;

  // image初期値設定
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

  // プログレスバー作成
  this.BarLeft = null;
  this.BarTop = null;
  this.BarRight = null;
  this.BarBottom = null;
  this.CreateProgressBar();

  let parent = this.ImageEle[0].parentElement;

  // カレントイメージ表示作成・設定
  let current_image_view = document.createElement("div");
  current_image_view.classList.add("current_image_no");
  current_image_view.innerText = "1";
  parent.appendChild(current_image_view);
  this.CurrentImageView = current_image_view;

  // waveエフェクト設定
  let effect_wrap = document.createElement("div");
  let effect = document.createElement("div");
  effect.classList.add("ripple_effect");
  effect_wrap.appendChild(effect);
  parent.appendChild(effect_wrap);
  this.WaveElement = effect;
  this.WaveElement.addEventListener("animationend", RemoveAnimation.bind(this));
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

  if (isNext) {
    this.NowImageIndex =
      this.NowImageIndex == this.ImageSrc.length - 1
        ? 0
        : this.NowImageIndex + 1;
    this.CenterImage = this.ImageEle[2].src;
  } else {
    this.NowImageIndex =
      this.NowImageIndex == 0
        ? this.ImageSrc.length - 1
        : this.NowImageIndex - 1;
    this.CenterImage = this.ImageEle[0].src;
  }

  // プログレス移動
  this.BarLeft.style.transform =
    "translateY(-" +
    (this.ImageEle[0].height - (this.NowImageIndex + 1) * this.TranslateY4Bar) +
    "px)";
  this.BarTop.style.transform =
    "translateX(-" +
    (this.ImageEle[0].width - (this.NowImageIndex + 1) * this.TranslateX4Bar) +
    "px)";
  this.BarRight.style.transform =
    "translateY(" +
    (this.ImageEle[0].height - (this.NowImageIndex + 1) * this.TranslateY4Bar) +
    "px)";
  this.BarBottom.style.transform =
    "translateX(" +
    (this.ImageEle[0].width - (this.NowImageIndex + 1) * this.TranslateX4Bar) +
    "px)";

  // カレントイメージ表示更新
  this.CurrentImageView.innerText = this.NowImageIndex + 1;
};

Slider.prototype.SlideLoop = function(interval, isSecVisible) {
  // 切り替えまでの秒数表示要素作成・追加
  let imageWrap = this.ImageEle[0].parentElement;
  let secEle = document.createElement("div");
  secEle.classList.add("to_next_seconds");
  imageWrap.parentElement.appendChild(secEle);

  this.SecEle = secEle;

  // インターバルセット、秒単位に丸め
  let intervalRound = Math.round(interval / 1000) * 1000;
  this.LoopInterval = intervalRound;
  this.ToNextInterval = intervalRound;

  // スタート
  LoopSleep(this);
};

Slider.prototype.SetToNextInterval = function() {
  if (this.ToNextInterval === 0) {
    this.ToNextInterval = this.LoopInterval;
  } else {
    this.ToNextInterval -= 1000;
  }
  // 表示秒数更新
  this.SecEle.innerText = "次のイメージまで : " + this.ToNextInterval / 1000;
};
//#endregion

// #region private method
// 次のイメージ取得
Slider.prototype.GetNextImage = function() {
  let nextImg = this.ImageSrc[0];
  let findFlg = false;

  for (i = 0; i < this.ImageSrc.length; i++) {
    if (findFlg) {
      nextImg = this.ImageSrc[i];
      break;
    }

    if (this.CenterImage.indexOf(this.ImageSrc[i]) != -1) {
      findFlg = true;
    }
  }
  return nextImg;
};
// 前のイメージ取得
Slider.prototype.GetPrevImage = function() {
  let prevImg = this.ImageSrc[this.ImageSrc.length - 1];
  let findFlg = false;

  for (i = 0; i < this.ImageSrc.length; i++) {
    if (this.CenterImage.indexOf(this.ImageSrc[i]) != -1) {
      findFlg = true;
    }

    if (findFlg) break;

    prevImg = this.ImageSrc[i];
  }
  return prevImg;
};
// スライド完了イベント付与、スライドアニメーション初期値セット
function ResetImages() {
  if (this.NowImageIndex == this.ImageSrc.length - 1) {
    this.WaveElement.classList.add("is-show");
  }
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
        this.ImageEle[0].src = this.GetPrevImage();
        break;
      case 1:
        this.ImageEle[1].src = this.CenterImage;
        break;
      case 2:
        this.ImageEle[2].src = this.GetNextImage();
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
function RemoveAnimation() {
  this.WaveElement.classList.remove("is-show");
}
// ループスライド
function LoopSleep(slider) {
  let loopFunc = function() {
    slider.SetToNextInterval();
    setTimeout(loopFunc, 1000);
    if (slider.ToNextInterval === 0) {
      slider.Slide(true);
    }
  };
  loopFunc();
}
Slider.prototype.CreateProgressBar = function() {
  // プログレスバー作成
  let imageWrap = this.ImageEle[0].parentElement;
  for (let index = 0; index < 4; index++) {
    let bar = document.createElement("div");
    bar.style.position = "absolute";
    bar.style.zIndex = 999;
    bar.style.background = "Black";
    bar.style.transitionProperty = this.Transition_property;
    bar.style.transitionDelay = this.Transition_delay;
    bar.style.transitionDuration = "500ms";
    bar.style.transitionTimingFunction = this.Transition_timing_function;

    let init_x =
      this.ImageEle[0].width - this.ImageEle[0].height / this.ImageSrc.length;
    let init_y =
      this.ImageEle[0].height - this.ImageEle[0].width / this.ImageSrc.length;
    switch (index) {
      case 0: //left
        bar.style.width = "10px";
        bar.style.height = this.ImageEle[0].height + "px";
        bar.style.top = "0px";
        bar.style.left = "0px";
        bar.style.transform = "translateY(-" + init_y + "px)";
        this.BarLeft = bar;
        break;
      case 1: //top
        bar.style.width = this.ImageEle[0].width + "px";
        bar.style.height = "10px";
        bar.style.top = "0px";
        bar.style.left = "0px";
        bar.style.transform = "translateX(-" + init_x + "px)";
        this.BarTop = bar;
        break;
      case 2: //right
        bar.style.width = "10px";
        bar.style.height = this.ImageEle[0].height + "px";
        bar.style.top = "0px";
        bar.style.right = "0px";
        bar.style.transform = "translateY(" + init_y + "px)";
        this.BarRight = bar;
        break;
      case 3: //bottom
        bar.style.width = this.ImageEle[0].width + "px";
        bar.style.height = "10px";
        bar.style.bottom = "0px";
        bar.style.right = "0px";
        bar.style.transform = "translateX(" + init_x + "px)";
        this.BarBottom = bar;
        break;
      default:
        break;
    }
    imageWrap.appendChild(bar);
  }
};
// スタイル作成(固定値はここで作るようにする)
function CreateStyle(height, width) {
  // styleタグを作成
  css = document.createElement("style");
  css.media = "screen";
  css.type = "text/css";

  // wave
  let ripple =
    "@keyframes ripple{" +
    ["from {opacity: 1;}", "to {opacity: 0; transform: scale(2)}"].join(" ") +
    "}";
  let ripple_effect =
    ".ripple_effect{" +
    [
      "width:" + width + "px;",
      "height:" + height + "px;",
      "background: black;",
      "position: absolute;",
      "border-radius: 100%;",
      "pointer-events: none;",
      "transform: scale(0);",
      "opacity: 0;"
    ].join(" ") +
    "}";
  let ripple_effect_isShow =
    ".ripple_effect.is-show{" +
    ["animation: ripple 0.5s ease-out;"].join(" ") +
    "}";
  let to_next_seconds =
    ".to_next_seconds{" +
    ["top: -25px;", "right: 0px;", "position: absolute;"].join(" ") +
    "}";

  let current_image_no =
    ".current_image_no{" +
    [
      "position: absolute;",
      "bottom : 10px;",
      "right: 10px;",
      "color: white;",
      "background: black;",
      "text-align: center;",
      "height: 25px;",
      "width: 25px;",
      "line-height: 30px;",
      "padding-top: 5px;",
      "padding-left: 5px;"
    ].join(" ") +
    "}" +
    "}";

  rules = document.createTextNode(
    [
      ripple,
      ripple_effect,
      ripple_effect_isShow,
      to_next_seconds,
      current_image_no
    ].join("\n")
  );
  css.appendChild(rules);

  document.getElementsByTagName("head")[0].appendChild(css);
}
//#endregion
