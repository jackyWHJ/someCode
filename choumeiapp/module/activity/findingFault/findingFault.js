var love =(function(){
    var winH = $(window).height(),winW = $(window).width(),n=0;
    var $slide2Part = $('.slide2-part'),$slide3Part=$('.slide3-part'),
        $slide13Part1 =$('.slide13-part1'),$slide13Part2 =$('.slide13-part2'),$resultCover =$('#resultCover'),
        $closeResultBtn = $('#closeResultBtn'),$lock =$('#lock');
    var isClick =false;
	var init = function(){
        $('.download-btn').css('margin-top',winH*0.22);
        var redPacketW =0.77*winW,
            redPacketH=1.08*redPacketW;
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
                '../../../images/activity/findingFault/1.jpg','../../../images/activity/findingFault/1-1.png',
                '../../../images/activity/findingFault/2.jpg','../../../images/activity/findingFault/2-1.png',
                '../../../images/activity/findingFault/3.jpg','../../../images/activity/findingFault/3-1.png',
                '../../../images/activity/findingFault/4.jpg','../../../images/activity/findingFault/5.jpg',
                '../../../images/activity/findingFault/6.jpg','../../../images/activity/findingFault/7.jpg',
                '../../../images/activity/findingFault/8.jpg','../../../images/activity/findingFault/9.jpg',
                '../../../images/activity/findingFault/10.jpg','../../../images/activity/findingFault/11.jpg',
                '../../../images/activity/findingFault/12.jpg','../../../images/activity/findingFault/14.jpg',
                '../../../images/activity/findingFault/15.jpg'
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
                    default:
                       $("#swipeupTips").show();
                       $slide2Part.hide().removeClass('animated zoomInUp');
                       $slide3Part.hide().removeClass(' animated bounceInDown');
                       $slide13Part1.removeClass('animated fadeInLeftBig');
                       $slide13Part2.hide().removeClass('scale');
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