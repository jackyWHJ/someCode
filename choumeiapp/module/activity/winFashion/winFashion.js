var love =(function(){
    var winH = $(window).height(),winW = $(window).width(),n=0;
    var $slide2Part = $('.slide2-part'),$slide3Part=$('.slide3-part'),
        $slide12Part1 =$('.slide12-part1'),$slide12Part2 =$('.slide12-part2'),$resultCover =$('#resultCover'),
        $closeResultBtn = $('#closeResultBtn'),$lock =$('#lock');
    var isClick =false;
	var init = function(){
        $('.download-btn').css('margin-top',winH*0.22);
        $('.tel-btn').css('margin-top',winH*0.74);
        var redPacketW =0.44*winW,
            redPacketH=2.25*redPacketW;
        $('#redPacket').css({
            'width':redPacketW,
            'height':redPacketH
        });
        preloadImg();
        bgSound();
        orientationChange();
	}
    var orientationChange = function(){
        var need_watch = !('onorientationchange' in window);//需要通过resize来检查横竖屏
        if (!need_watch) {
            window.addEventListener("orientationchange", function () {
                if (window.orientation != 0) {
                    $lock.show();
                } else {
                    $lock.hide();
                }
            }, false);
            if (window.orientation != 0) {
                $lock.show();
            }
        }
    }
    var bgSound = function () {
        var audio = $('#audio');
        var data_url = audio.attr('data_src');
        audio.attr('src', data_url);
        document.addEventListener('WeixinJSBridgeReady', function () {
            WeixinJSBridge.invoke('getNetworkType', {}, function () {
                audio[0].play();
                audio.on('ended', function () {
                    audio.attr('src', data_url);
                    audio[0].play();
                }, false);
            });
        }, false);
        var $palyYF = $("#playYF"),$rotateIcon = $("#rotateIcon");
        $("#audio_btn").on("click",function(){
            var dataStatus = $(this).attr('status');
            if(dataStatus=='play'){
                audio[0].pause();
                $palyYF.hide();
                $rotateIcon.removeClass("rotate");
                $(this).attr('status','paused');
            }else{
                audio[0].play();
                $palyYF.show();
                $rotateIcon.addClass("rotate");
                $(this).attr('status','play');
            }
        });
    };
    var preloadImg = function(){
        commonUtils.loaderImg({
            data:[
                '../../../images/activity/winFashion/1.jpg','../../../images/activity/winFashion/1-1.png',
                '../../../images/activity/winFashion/2.jpg','../../../images/activity/winFashion/2-1.png',
                '../../../images/activity/winFashion/3.jpg','../../../images/activity/winFashion/3-1.png',
                '../../../images/activity/winFashion/4.jpg','../../../images/activity/winFashion/5.jpg',
                '../../../images/activity/winFashion/6.jpg','../../../images/activity/winFashion/7.jpg',
                '../../../images/activity/winFashion/8.jpg','../../../images/activity/winFashion/9.jpg',
                '../../../images/activity/winFashion/10.jpg','../../../images/activity/winFashion/11.jpg',
                '../../../images/activity/winFashion/12-1.png','../../../images/activity/winFashion/12-2.png',
                '../../../images/activity/winFashion/12-3.png','../../../images/activity/winFashion/12-4.png',
                '../../../images/activity/winFashion/12-5.png','../../../images/activity/winFashion/12-6.png',
                '../../../images/activity/winFashion/13.jpg','../../../images/activity/winFashion/14.jpg'
            ],
            onProgress:function(percent){
                $('#loadingTips').text(parseInt(percent*100)+'%');
            },
            onFinish:function(){
                setTimeout(function(){
                    $('#loadingBox').hide();
                    $("#swiperContainer").height($(window).height());
                    $('#swiperContainer').show();
                    swiperShow();
                },500); 
            }
        })
    }
    var swiperShow = function(){
        var mySwiper = new Swiper('.swiper-container',{
            speed:300,
            direction : 'vertical',
            coverflow: {
                rotate: 20,
                stretch: 40,
                depth: 300,
                modifier: 2,
                slideShadows :true
            },
            noSwiping : true,
            noSwipingClass :'stop-swiping',
            onSlideChangeStart:function(){
                var activeIndex = mySwiper.activeIndex;
                switch(activeIndex){
                    case 1:
                        $slide2Part.show().addClass('animated zoomInUp');
                        $slide3Part.hide().removeClass(' animated bounceInDown');
                    break;
                    case 2:
                        $slide3Part.show().addClass(' animated bounceInDown');
                        $slide2Part.hide().removeClass('animated zoomInUp');
                    break;
                    case 11:
                        $("#swipeupTips").hide();
                        $slide12Part1.addClass('animated fadeInLeftBig');
                        $slide12Part1.on('webkitAnimationEnd animationend',function(){
                            $slide12Part2.show().addClass('scale');
                        });
                        $slide12Part2.on('webkitAnimationEnd animationend',function(){
                            $('#redPacket').on('click',function(){
                                $resultCover.show().addClass('scale');
                                $('#scbrb1').show().addClass('scale');
                                $('#redPacket').find('span').removeClass('scale-flicker');
                                isClick = true;
                            });
                            $resultCover.on('click',function(){
                                n++;
                                switch(n){
                                    case 1:
                                        $('#scbrb2').show().addClass('scale').siblings('div').hide();
                                        $closeResultBtn.removeClass('opacity');
                                    break;
                                    case 2:
                                        $('#scbrb3').show().addClass('scale').siblings('div').hide();
                                        $('.slide-12').removeClass('stop-swiping');
                                    break;
                                    default:
                                    break;
                                }
                            });
                        });
                        if(isClick==true){
                            $slide12Part1.removeClass('animated fadeInLeftBig');
                            $slide12Part2.show().removeClass('scale');
                        }
                    break;
                    default:
                       $("#swipeupTips").show();
                       $slide2Part.hide().removeClass('animated zoomInUp');
                       $slide3Part.hide().removeClass(' animated bounceInDown');
                       $slide12Part1.removeClass('animated fadeInLeftBig');
                       $slide12Part2.hide().removeClass('scale');
                    break;
                }
            }
        });
    }
	return {
		'Init':init
	}
})();
love.Init();