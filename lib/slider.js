//#region const
const path_image = [
    "image/slider-image1.jpg"
    ,"image/slider-image2.jpg"
    ,"image/slider-image3.jpg"
    ,"image/slider-image4.jpg"
    ,"image/slider-image5.jpg"
]
const intervalTime = 5000;
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const imgSlide = document.getElementById("sliderImage");
//#endregion

//#region event
window.onload = function(){
    window.setTimeout(this.LoopSleep(intervalTime,this.ChangeImageSource),intervalTime);
}

btnPrev.onclick = function(){
    ChangeImageSource();
}

btnNext.onclick = function(){
    ChangeImageSource();
    
}
//#endregion

// #region private method
function ChangeImageSource(){
    let nowImg = imgSlide.src;
    let nextImg = path_image[0];
    let findFlg = false;

    for(i = 0; i < path_image.length; i++){
        if(findFlg){
            nextImg = path_image[i];
            break;
        }

        if(nowImg.indexOf(path_image[i]) != -1){
            findFlg = true;
        }
    }
    imgSlide.src = nextImg;
}

function LoopSleep(_interval, _mainFunc){
    var interval = _interval;
    var mainFunc = _mainFunc;
    var loopFunc = function () {
        setTimeout(loopFunc, interval);
        mainFunc();
    }
    loopFunc();
  }

//#endregion
