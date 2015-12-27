/**
 * Created by zhaoheng on 2015/8/6 14:21.
 * Last Modified by zhaoheng on 2015/8/6 14:21.
 */
/**
 * Created by zhaoheng on 2015/7/24 11:14.
 * Last Modified by zhaoheng on 2015/7/24 11:14.
 */
document.addEventListener('WeixinJSBridgeReady', function () {
    WeixinJSBridge.invoke('getNetworkType', {}, function () {
        var oAudio = document.getElementById("board_audio");
        oAudio.src = oAudio.getAttribute("data-src");
        oAudio.play();
        oAudio.addEventListener('ended', function () {
            oAudio.setAttribute('src', oAudio.getAttribute("data-src"));
            oAudio.play();
        }, false)
    });
}, false);

$(function () {

    var page = {
        init: function () {
            if( !this.IsPC() ){

                this.loadImage();
            }else{
                alert("请在手机端访问该页面");
                $("body").hide();
            }


            window.addEventListener( 'orientationchange', function() {
                setTimeout(function() {
                    var n = window.innerWidth, i = window.innerHeight;
                    n > i && alert("当前处于横屏，为了更好的展示页面，请转为竖屏！");
                }, 300);
            }, false );

        },

        audio: function(){
            //$("#audio_btn").show();
            var oAudio = document.getElementById("board_audio");
            oAudio.src = oAudio.getAttribute("data-src");
            oAudio.load();
            oAudio.play();
            $("#audio_btn").on("touchend", function () {
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

        },

        IsPC: function IsPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        loadImage: function () {

            /**
             *
             * @description img初始化加载
             */
            var imgPath = "images/";

            var sourceArr = ["0_背景.png","a.png","b.png"];
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
                var percent = Math.floor(curNum / total * 100);

                $("#loadingTips").text( percent + "%" );

                if (percent == 100) {
                    setTimeout(function () {
                        $("#loadingWrap").remove();
                        $(".swiper-container").show();
                        page.swiper();
                        page.audio();
                        $("#arrow").show();
                    }, 500);
                }
            });

        },

        swiper: function () {

            var mySwiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                speed: 300,
                loop: false,
                initialSlide: 0,
                onInit: function (swiper) {
                   $(".page").css("background", "none");
                }
            });

            mySwiper.on("onSlideChangeEnd", function (swiper) {
                var index = swiper.activeIndex + 1;
                $(".page").find(".opacity100").removeClass("opacity100");
                $(".page15 .bottom").removeClass("active");
                $(".page14 .b3").removeClass("animate14");
                switch (index) {
                    case 1:
                        $(".page1").find(".wrap-content").addClass('animated bounceInDown opacity100').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                            $(this).removeClass('animated bounceInDown');
                        });
                        break;
                    case 2:
                        $(".page2").find(".top").addClass('animated bounceIn opacity100').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                            $(this).removeClass('animated bounceIn');
                            $(".page2 .people").find(".opacity0").addClass("animate2").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                                $(this).removeClass('animate2');
                            });
                            setTimeout(function () {
                                $(".page2 .people").find(".opacity0").addClass("opacity100");
                            }, 460);
                        });
                        break;
                }

                if( mySwiper.isBeginning ){
                    $(".arrow").show();
                }else if( mySwiper.isEnd ){
                    $(".arrow").hide();
                }
            });

        }
    };

    page.init();

});
