var love =(function(){
	var init = function(){
        preloadImg();
        board_sound();
        //微信分享
	}
    var board_sound = function () {
        var board_audio = $('#board_audio');
        var data_url = board_audio.attr('data_src');
        board_audio.attr('src', data_url);
        document.addEventListener('WeixinJSBridgeReady', function () {
            WeixinJSBridge.invoke('getNetworkType', {}, function () {
                board_audio[0].play();
                board_audio.on('ended', function () {
                    board_audio.attr('src', data_url);
                    board_audio[0].play();
                }, false)
            });
        }, false);
        var $palyYF = $("#playYF"),$rotateIcon = $("#rotateIcon");
        $("#audio_btn").on("click",function(){
            if (board_audio[0].paused) {
                board_audio[0].play();
                $palyYF.show();
                $rotateIcon.addClass("rotate");
            }else if(board_audio[0].play) {
                board_audio[0].pause();
                $palyYF.hide();
                $rotateIcon.removeClass("rotate");
            }
        });
    };

    var preloadImg = function(){
        commonUtils.loaderImg({
            data:[
                '../../../images/activity/520love/1.jpg',
                '../../../images/activity/520love/2.jpg',
                '../../../images/activity/520love/3.jpg',
                '../../../images/activity/520love/4.jpg',
                '../../../images/activity/520love/5.jpg',
                '../../../images/activity/520love/6.jpg',
                '../../../images/activity/520love/7.jpg',
                '../../../images/activity/520love/scanno.png'
            ],
            onProgress:function(percent){
                $('#loadingTips').text(parseInt(percent*100)+'%');
            },
            onFinish:function(){
                setTimeout(function(){
                    $('#loadingBox').hide();
//                    $("#swiperContainer").width($(window).width());
                    $("#swiperContainer").height($(window).height());
                    $('#swiperContainer').show();
                    swiperShow();
                },500); 
            }
        })
    }
    var swiperShow = function(){
        var mySwiper = new Swiper('.swiper-container',{
            paginationClickable: true,
            speed:300,
            direction : 'vertical',
//            effect : 'cube',
            effect : 'coverflow',
            coverflow: {
                rotate: 30,
                stretch: 40,
                depth: 300,
                modifier: 2,
                slideShadows : true
            },
            onSlideChangeStart:function(){
                var activeIndex = mySwiper.activeIndex;
                if(activeIndex == 7){
                    $("#swipeupTips").hide();
                }
                else{
                    $("#swipeupTips").show();
                }
            }
        });
    }

	return {
		'Init':init
	}

})();
love.Init();