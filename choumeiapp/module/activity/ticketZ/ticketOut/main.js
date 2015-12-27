$(function () {

    var page = {
        name: '',
        mobilephone: '',
        init: function () {
            page.pageLoad();
            page.view.init();
        },
        pageLoad: function () {

            /**
             *
             * @description img初始化加载
             */
            var imgPath = "../../../../images/activity/ticketZOut/";

            var sourceArr = ["1.png", "1_01.png", "1_03.png", "1_04.png", "1_04_1.png", "1_05.png", "2.png",
                "2_01.png", "2_02.png", "2_03.png", "3.png", "3_01.png", "3_02.png", "3_03.png", "4.png", "4_01.png",
                "4_02.png", "4_03.png", "4_04.png", "4_05.png", "5.png", "5_01.png", "5_02.png", "5_03.png", "5_04.png",
                "5_05.png", "5_06.png", "6.png", "6_02.png", "6_03.png", "6_04.png", "6_05.png", "7.png", "7_01.png", "7_02.png"
                , "7_03.png", "7_04.png", "7_05.png", "8.png"
            ];
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
                //console.log( "当前加载  " + Math.floor(percent) + "%" );

                $(".loadingTips").text(percent + "%");

                function isNull( variable ){
                    if( variable === null && typeof variable === "object" ){
                        return true;
                    }
                    return false;
                }

                if (percent == 100) {

                    page.name = decodeURIComponent( commonUtils.getQueryString("name") );

                    if( isNull( page.name ) ){
                        page.name = '';
                    }
                    page.mobilephone = decodeURIComponent( commonUtils.getQueryString("mobilephone") );

                    if( isNull( page.mobilephone ) ){
                        page.mobilephone = '';
                    }

                    $("#name").text( page.name );

                    $("#submit").on("click", function (e) {

                        var partten = /^1[3,5,8,7]\d{9}$/;

                        if (partten.test($("#tel").val())) {

                            $.ajax({
                                    url: apiConfig.userApi,
                                    method: "POST",
                                    data: {
                                        code: JSON.stringify({
                                            to: 'addFriend',
                                            type: 'Activity',
                                            body: {
                                                'mobilephone': page.mobilephone,
                                                'friendPhone': $("#tel").val(),
                                                'activityUrl': window.location.href,
                                                'activityId': 2
                                            }
                                        })
                                    },
                                    success: function (data) {
                                        data = $.parseJSON(data);
                                        if (data.result == 1) {
                                            alert("感谢兄弟姐们的捧场哟，赶快下载臭美APP去下单吧！");
                                        } else {
                                            alert("对不起，您的号码已经被提交!");
                                        }

                                        //slideTo 6
                                        page.view.swiper.slideNext();
                                        $(".page7").find(".title").css("opacity", "1").addClass('animated fadeInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {

                                            $(".page7").find(".hand").css("opacity", "1").addClass('animated fadeIn');
                                            $(".page7").find(".download").css("opacity", "1").addClass('animated fadeIn');
                                            $(".page7").find(".logo").css("opacity", "1").addClass('animated bounceIn');

                                            setTimeout(function () {
                                                $(".page7").find(".hand").removeClass('animated fadeIn').addClass('shake');
                                            }, 600);

                                            setTimeout(function () {
                                                $(".page7").find(".down").css("opacity", "1").addClass('animated fadeIn');
                                            }, 1000);

                                        });
                                        // end slidTo
                                    }

                                    ,
                                    error: function (xhr, status) {
                                        $("#loadingDiv").hide();
                                        var message = "数据请求失败，请稍后再试!";
                                        if (status === "parseerror") message = "响应数据格式异常!";
                                        if (status === "timeout")    message = "请求超时，请稍后再试!";
                                        if (status === "offline")    message = "网络异常，请稍后再试!";
                                        alert(message);
                                    }
                                }
                            )
                            ;


                        }
                        else {
                            alert("对不起哦，亲，要输入正确的11位手机号码才能支持朋友哦！");
                        }

                        $(".swiper-wrapper").css({
                            'transform': 'translate3d(0px, -' + $(window).height() * 5 + 'px, 0px)',
                            '-webkit-transform': 'translate3d(0px, -' +   $(window).height() * 5 + 'px, 0px)'
                        });

                        $(window).scroll(0);

                    });


                    $("#tel").on("blur",function(){
                        $(".swiper-wrapper").css({
                                'transform': 'translate3d(0px, -' + $(window).height() * 5 + 'px, 0px)',
                        '-webkit-transform': 'translate3d(0px, -' +   $(window).height() * 5 + 'px, 0px)'
                        });
                        $(window).scroll(0);
                    })

                    setTimeout(function () {
                        $('#loadingWrap').remove();
                        page.view.initSwiper();
                        $(".swiper-container, #arrow").show();
                    }, 600);


                }
            });
        },
        view: {
            swiper: null,
            init:function(){
                var mask = $(".maskWrap");
                $("#mask").on("click",function(){
                    mask.show();
                })
                mask.on("click",function(){
                    $(this).hide();
                })
            },
            initSwiper: function () {
                var mySwiper = new Swiper('#swiper-container', {
                    speed: 300,
                    direction: 'vertical'
                });
                mySwiper.on("onSlideChangeEnd", function (swiper) {
                    var index = swiper.activeIndex + 1;
                    $(".page" + index).find(".pageWrap").show();
                    switch (index) {
                        case 2:
                            $(".page2").find(".moon2").css({
                                '-webkit-animation': 'alp 0.5s linear forwards',
                                'animation': 'alp 0.5s linear forwards'
                            }).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
                                $(".page2").find(".word").css({
                                    '-webkit-animation': 'down 1s ease 1s forwards',
                                    'animation': 'down 1s ease 1s forwards'
                                });
                            });
                            $(".page2").find(".yue-wrap").css({
                                '-webkit-animation': 'toLeft 8.5s linear forwards',
                                'animation': 'toLeft 8.5s linear forwards'
                            });
                            $(".page2").find(".xin").addClass('animated fadeIn');
                            break;
                        case 3:
                            $(".page3").find(".she").css("opacity", "1").addClass('animated slideInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
                                $(".page3").find(".zyl").css("opacity", "1").addClass('animated bounceIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
                                    $(".page3").find(".time").css("opacity", "1").addClass('animated fadeIn');
                                });
                            });
                            break;
                        case 4:
                            $(".page4").find(".hand1").css("opacity", "1").addClass('animated fadeInRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
                                $(".page4").find(".hand3").css("opacity", "1").addClass('animated fadeInRight');
                                $(".page4").find(".hand2").css("opacity", "1").addClass('animated fadeInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {

                                    $(".page4").find(".reason1").css("opacity", "1").addClass('animated fadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
                                        $(".page4").find(".reason2").css("opacity", "1").addClass('animated fadeIn');
                                    });

                                });
                            });
                            break;
                        case 5:
                            $(".page5").find(".people").css("opacity", "1").addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
                                $(".page5").find(".title").css("opacity", "1").addClass('animated zoomIn');

                                setTimeout(function () {
                                    $(".page5").find(".people-arround").css("opacity", "1").addClass('animated fadeIn');
                                }, 500);

                                $(".page5").find(".title1").css("opacity", "1").addClass('animated fadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {

                                    $(".page5").find(".title2").css("opacity", "1").addClass('animated slideInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {

                                        $(".page5").find(".bg").css("opacity", "1").addClass('animated zoomIn');

                                    });

                                });

                            });
                            break;
                        case 6:
                            $(".page6").find(".people").css("opacity", "1").addClass('animated fadeInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {

                                $(".page6").find(".bg").css("opacity", "1").addClass('animated fadeInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {

                                    $(".page6").find(".people-arround").css("opacity", "1").addClass('animated fadeInRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {

                                        $(".page6").find(".send").css("opacity", "1").addClass('animated fadeInDown');

                                    })
                                });

                            });
                            break;
                        case 7:
                            $(".page7").find(".title").css("opacity", "1").addClass('animated fadeInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {

                                $(".page7").find(".hand").css("opacity", "1").addClass('animated fadeIn');
                                $(".page7").find(".download").css("opacity", "1").addClass('animated fadeIn');
                                $(".page7").find(".logo").css("opacity", "1").addClass('animated bounceIn');

                                setTimeout(function () {
                                    $(".page7").find(".hand").removeClass('animated fadeIn').addClass('shake');
                                }, 600);

                                setTimeout(function () {
                                    $(".page7").find(".down").css("opacity", "1").addClass('animated fadeIn');
                                }, 1000);

                            });

                            break;
                    }

                })
                ;
                this.swiper = mySwiper;
                //mySwiper.slideTo(6)
            },//end swiper
        },
    }//end page
    page.init();

})