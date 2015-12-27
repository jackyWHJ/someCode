var bet =(function(){
	var init = function(){
        preloadImg();
        //微信分享
	}

    var preloadImg = function(){
        commonUtils.loaderImg({
            data:[
                '../../../images/activity/bet/1.jpg',
                '../../../images/activity/bet/2.jpg',
                '../../../images/activity/bet/3.jpg',
                '../../../images/activity/bet/4.jpg',
                '../../../images/activity/bet/5.jpg',
                '../../../images/activity/bet/6.jpg',
                '../../../images/activity/bet/7.jpg',
                '../../../images/activity/bet/arrow.png'
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
                if(activeIndex == 6){
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
bet.Init();