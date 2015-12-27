/**
 * Created by zhaoheng on 2015/5/19.
 */

var imgPath = "../../../images/activity/toWest/";

var sourceArr = ["loading20.png","loading48.png","loading82.png","loading100.png","arrowBlue.png", "arrowWhite.png", "one1.png", "one2.png", "one3.png", "two1.png", "two2.png", "two3-1.png", "two3-2.png", "two3-3.png",
                 "three1.png", "three2.png", "three3.png", "four1.png", "four2.png", "five1.png", "five2.png", "six1.png", "six2.png",
                 "seven1.png","seven2.png","seven-girl.png","seven-girl-star.png","eight1.png","eight2.png","nine1.png","nine2.png","ten1.png","ten2.png","ten3.png",
                 "eleven1.png","eleven2.png","eleven3.png","eleven4.png","eleven5.png","twelve1.png","twelve2.png","twelve3.png","twelve4.png","twelve5.png",
                 "thirteen1.png","thirteen2.png","thirteen3.png","thirteen4.png","fourteen1.png","fourteen1.png","fourteen2.png","fourteen3.png","fourteen4.png"];
for (var i = 0; i < sourceArr.length; i++) {
    sourceArr[i] = (imgPath + sourceArr[i])
}
var loadImage = function (path, callback) {
    var img = new Image();
    img.onload = function () {
        callback(path);
        img.onload = null;
    };
    img.src = path;
};
var imgLoader = function (imgs, callback) {
    var len = imgs.length, i = 0;
    while (imgs.length) {
        loadImage(imgs.shift(), function (path) {
            callback(path, ++i, len)
        })
    }
};
imgLoader(sourceArr, function (path, curNum, total) {
    var percent = Math.floor( curNum / total * 100 );
    console.log( "当前加载速度为： " + Math.floor(percent) + "%" );
    if( percent > 20 && percent < 50 ){
        $("#load").css( "background-image", "url(../../../images/activity/toWest/loading48.png)" );
    }else if ( percent > 50 && percent < 100 ) {
        $("#load").css( "background-image", "url(../../../images/activity/toWest/loading82.png)" );
    } if ( percent == 100 ) {
        $("#load").css( "background-image", "url(../../../images/activity/toWest/loading100.png)" );
        setTimeout( function(){
            showPage(1, function(){});
            $('#load').remove();
            $('#arrow,#audio_btn').show().css('opacity', '1');
        }, 1000);
    }
});

//alert( $(window).width() + "  " + $(window).height() );