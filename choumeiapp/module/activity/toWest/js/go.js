/**
 * Created by zhaoheng on 2015/5/20.
 */


/**
 * @return  控制显示page页面
 */
function showPage( id , fun ){

    $(".page").css({
        "opacity": "0",
        "display": "none"
    }).removeClass( "active" );

    $( $(".page")[id-1]).css({
            "opacity": "1",
            "display": "block"
    });

    $(".title, .suggestion-cont2, .suggestion-cont3, .big-brother-monkey, .big-brother-monkey-say, .brother-pig, .brother-pin-say," +
        ".big-brother-sha,.big-brother-sha-say,.brother-long, .brother-long-say," +
        ".appointment-places,.favourable-download,.appointment-map").attr( "style", "" );

    setTimeout(function(){
        $( $(".page")[id-1] ).addClass( "active" );
        judge();
    }, 300 );

    function judge(){

        switch( id ){
            case 1 :
                arrowControl(true);
                $("#one.active").find( ".title").css("opacity", "1").off().addClass( 'animated bounceInDown' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e){
                    $(this).removeClass( 'animated bounceInDown' );
                    $("#one.active").find(".earth").off().addClass( 'animated pulse' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e){
                        $(this).removeClass( 'animated pulse' );
                        $(".active").find(".logo").off().addClass( 'animated bounceIn' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e){
                            $(this).removeClass( 'animated bounceIn' );
                            if( typeof fun == "function" ){
                                fun();
                            }

                        });
                    });
                });
                break;

            case 2 :
                arrowControl(false);
                $("#two.active").find( ".title" ).css("opacity", "1").off().addClass( 'animated bounceInDown' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated bounceInDown');

                    $(".suggestion-cont2, .suggestion-cont3").css( "opacity", "1" );

                    setTimeout( function(){
                        if( typeof fun == "function" ){
                            fun();
                        }
                    }, 1500 );
                });
                break;

            case 3 :

                arrowControl(false);
                $("#three.active").find( ".title" ).css("opacity", "1").off().addClass( 'animated bounceInDown' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated bounceInDown');

                    $("#three.active").find( ".laoxue-head").off().addClass( 'animated tada' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                        $(this).removeClass('animated tada');
                        if( typeof fun == "function" ){
                            fun();
                        }
                    })

                });
                break;

            case 4 :

                arrowControl(false);
                $("#four.active").find( ".title" ).css("opacity", "1").off().addClass( 'animated zoomInDown' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated zoomInDown');
                    if( typeof fun == "function" ){
                        fun();
                    }
                });
                break;

            case 5 :

                arrowControl(true);
                $("#five.active").find( ".title" ).css("opacity", "1").off().addClass( 'animated zoomInUp' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated zoomInUp');
                    if( typeof fun == "function" ){
                        fun();
                    }
                });
                break;

            case 6 :

                arrowControl(true);
                $("#six.active").find( ".title" ).css("opacity", "1").off().addClass( 'animated zoomInUp' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated zoomInUp');
                    if( typeof fun == "function" ){
                        fun();
                    }
                });
                break;

            case 7 :

                arrowControl(true);
                $("#seven.active").find( ".title" ).css("opacity", "1").off().addClass( 'animated zoomInUp' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated zoomInUp');
                    if( typeof fun == "function" ){
                        fun();
                    }
                });
                break;

            case 8 :

                arrowControl(true);
                $("#eight.active").find( ".title" ).css("opacity", "1").off().addClass( 'animated zoomInUp' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated zoomInUp');
                    if( typeof fun == "function" ){
                        fun();
                    }
                });
                break;

            case 9 :

                arrowControl(true);
                $("#nine.active").find( ".title" ).css("opacity", "1").off().addClass( 'animated zoomInUp' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated zoomInUp');
                    if( typeof fun == "function" ){
                        fun();
                    }
                });
                break;

            case 10 :

                arrowControl(true);
                $("#ten.active").find( ".title" ).css("opacity", "1").off().addClass( 'animated bounceInDown' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated zoomInUp');
                    if( typeof fun == "function" ){
                        fun();
                    }
                });
                break;

            case 11 :

                arrowControl(true);
                $("#eleven.active").find( ".big-brother-monkey" ).off().css("opacity", "1").addClass( 'animated fadeInLeft' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated fadeInLeft');
                });

                $("#eleven.active").find( ".big-brother-monkey-say" ).css("opacity", "1").off().addClass( 'animated fadeInRight' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated fadeInRight');
                });

                $("#eleven.active").find( ".brother-pig" ).css("opacity", "1").off().addClass( 'animated fadeInRight' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated fadeInRight');
                });

                $("#eleven.active").find( ".brother-pin-say" ).css("opacity", "1").off().addClass( 'animated fadeInLeft' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated fadeInLeft');

                    if( typeof fun == "function" ){
                        fun();
                    }
                });
                break;

            case 12 :

                arrowControl(true);
                $("#twelve.active").find( ".big-brother-sha-say" ).off().css("opacity", "1").addClass( 'animated fadeInLeft' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated fadeInLeft');
                });

                $("#twelve.active").find( ".big-brother-sha" ).css("opacity", "1").off().addClass( 'animated fadeInRight' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated fadeInRight');
                });

                $("#twelve.active").find( ".brother-long-say" ).css("opacity", "1").off().addClass( 'animated fadeInRight' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated fadeInRight');
                });

                $("#twelve.active").find( ".brother-long" ).css("opacity", "1").off().addClass( 'animated fadeInLeft' ).one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated fadeInLeft');

                    if( typeof fun == "function" ){
                        fun();
                    }
                });
                break;

            case 13 :

                arrowControl(false);
                $("#thirteen.active").find( ".title").css("opacity", "1").off().addClass( 'animated bounceInDown' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated bounceInDown');

                    $("#thirteen.active").find( ".favourable-say").off().addClass( 'animated wobble' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                        $(this).removeClass('animated wobble');

                        $("#thirteen.active").find( ".favourable-time").off().addClass( 'animated tada' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                            $(this).removeClass('animated tada');

                            if( typeof fun == "function" ){
                                fun();
                            }

                        });
                    });
                });

            case 14 :

                arrowControl(false);
                $("#fourteen.active").find( ".title").css("opacity", "1").off().css("opacity", "1").addClass( 'animated bounceInDown' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated bounceInDown');
                });

                $("#fourteen.active").find( ".appointment-places").off().css("opacity", "1").addClass( 'animated bounceInUp' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated bounceInUp');
                });

                $("#fourteen.active").find( ".favourable-download").off().css("opacity", "1").addClass( 'animated bounceInUp' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $(this).removeClass('animated bounceInUp');
                });

                $("#fourteen.active").find( ".appointment-map" ).off().css("opacity", "1").addClass( 'animated bounceInUp' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {

                    $(this).removeClass('animated bounceInUp');

                    if( typeof fun == "function" ){
                        fun();
                    }

                });

            default :
                break;

        }
    }

}

function arrowControl( status ){
    if( status == true ){
        $("#arrow").css({
            "background" : "url(../../../images/activity/toWest/arrowBlue.png) no-repeat center",
            "background-size" : "5%"
        });
    }else{
        $("#arrow").css({
            "background" : "url(../../../images/activity/toWest/arrowWhite.png) no-repeat center",
            "background-size" : "5%"
        });
    }
}


/**
 *
 * @return 音频播放
 */
var oAudio = document.getElementById("board_audio");
oAudio.src = oAudio.getAttribute( "data-src" );
$("#audio_btn").on("tap", function () {
    if (oAudio.paused) {
        oAudio.play();
        $("#rotateIcon").addClass("rotate");
        $("#playYF").show();
    } else {
        oAudio.pause();
        $("#rotateIcon").removeClass("rotate");
        $("#playYF").hide();
    }
});

/**
 *
 * android机音乐不能播放的兼容
 */
document.addEventListener('WeixinJSBridgeReady', function () {
    WeixinJSBridge.invoke('getNetworkType', {}, function () {
        oAudio.play();
        oAudio.addEventListener('ended', function () {
            oAudio.setAttribute('src', oAudio.getAttribute( "data-src" ) );
            oAudio.play();
        }, false)
    });
}, false);


/**
 *
 * @return 旋转屏幕
 */
window.onorientationchange = orientationChange;
function orientationChange() {
    var width = window.innerWidth ;
    var height = window.innerHeight ;
    if( width > height ){
        alert( "当前处于横屏，为了更好的展示页面，请转为竖屏！");
    }
}

/**
 *
 * @return body触摸滑动事件
 */
var gTouCheck = false, pageNum = $(".page").length, currentPageNum = 1, startX, startY, go = function(){ /*gTouCheck = false;*/ };
$('body').bind("touchstart", function (e) {
    if(e.target.tagName.toUpperCase() !== "A" ){
        e.preventDefault();
    }
    e = e.changedTouches[0];
    onStart(e);
});
$('body').bind("touchmove", function (e) {
    e.preventDefault();
    onMove(e.changedTouches[0], e);
});
$('body').bind("touchend", function (e) {
    if(e.target.tagName.toUpperCase() !== "A" ){
        e.preventDefault();
    }
    onEnd(e.changedTouches[0]);
});

function onStart(e) {
    startX = e.pageX;
    startY = e.pageY;
}
function onMove(e, oe) {
    if( currentPageNum == 0 ) return;

    if( currentPageNum >= pageNum ){
        currentPageNum = pageNum;
    }

    console.group( "move" );
        console.log( "currentPageNum : " + currentPageNum );
    console.groupEnd();

    oe.preventDefault();
    var sensitive = 10, num = 0  ;
    newx = (e.pageX - startX);
    newy = (e.pageY - startY);

    console.log( "gTouCheck : " +  gTouCheck );
    if (gTouCheck == false) {

        if(newy > sensitive) {
            console.log( "向上滑动" );
            console.log( "currentPageNum : " + currentPageNum );
            if(  currentPageNum > 1 ) {
                gTouCheck = true;
                num = currentPageNum - 1;
                setTimeout(function(){gTouCheck = false; }, 1000 );
                showPage(num, go);
                currentPageNum--;
            }
            console.log( "num2 : " + num );

        }else if(newy < -sensitive) {
            console.log( "向下滑动" );
            console.log( "currentPageNum : " + currentPageNum );
            if( currentPageNum < pageNum ){
                gTouCheck = true;
                num = currentPageNum + 1;
                setTimeout(function(){gTouCheck = false; }, 1000 );
                showPage( num, go );
                currentPageNum ++;
            }
            console.log( "num2 : " + num );

        }
    }
}
function onEnd(e) {
}


/**
 * @return  向下箭头处理
 */
$("#arrow").bind("tap", function(e){

    if( currentPageNum < pageNum ){
        gTouCheck = true;
        var num = currentPageNum + 1;
        showPage( num, go );
        currentPageNum ++;
    }

});


//document.addEventListener('WeixinJSBridgeReady', function () {
//    WeixinJSBridge.invoke('getNetworkType', {}, function () {
//
//        //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
//        wx.onMenuShareTimeline({
//            title: '嘘！我就在你楼下…', // 分享标题
//            link: '', // 分享链接
//            imgUrl: '', // 分享图标
//            success: function () {
//                alert( "分享到朋友圈成功" );
//            },
//            cancel: function () {
//                // 用户取消分享后执行的回调函数
//                alert( "分享到朋友圈失败" );
//            }
//        });
//
//        //获取“分享给朋友”按钮点击状态及自定义分享内容接口
//        wx.onMenuShareAppMessage({
//            title: '世界那么大 我就在你楼下 听说大家对周边的美发店@#￥￥%……&*，没关系，老薛带着悟空来了，就在楼下！', // 分享标题
//            desc: '嘘！我就在你楼下', // 分享描述
//            link: '', // 分享链接
//            imgUrl: '', // 分享图标
//            type: 'link', // 分享类型,music、video或link，不填默认为link
//            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
//            success: function () {
//                // 用户确认分享后执行的回调函数
//                alert( "分享给朋友成功" );
//            },
//            cancel: function () {
//                // 用户取消分享后执行的回调函数
//                alert( "分享给朋友成功" );
//            }
//        });
//
//    });
//}, false);