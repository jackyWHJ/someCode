/**
 * 
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-06-16 16:17:35
 * @version $Id$
 */

$(function(){
    var page = {
        init:function(){
            this.view.init();
            this.data.init();
        },//end init
        data:{
            init:function(){
                this.loadData();
            },
            loadData:function(){
                commonUtils.loaderImg({
                    data:[
                        "images/hr/1.jpg",
                        "images/hr/1-1.png",
                        "images/hr/2.jpg",
                        "images/hr/2-1.png",
                        "images/hr/2-2.png",
                        "images/hr/2-3.png",
                        "images/hr/2-4.png",
                        "images/hr/3.jpg",
                        "images/hr/3-1.png",
                        "images/hr/4.jpg",
                        "images/hr/4-1.png",
                        "images/hr/5.jpg",
                        "images/hr/5-1.png",
                        "images/hr/5-2.png",
                        "images/hr/5-3.png",
                        "images/hr/5-4.png",
                        "images/hr/6.jpg",
                        "images/hr/6-1.png",
                        "images/hr/7.jpg",
                        "images/hr/7-1.png",
                        "images/hr/8.jpg",
                        "images/hr/8-1.png",
                        "images/hr/9.jpg",
                        "images/hr/9-1.png",
                        "images/hr/10.jpg",
                        "images/hr/10-1.png",
                        "images/hr/11.jpg",
                        "images/hr/11-1.png",
                        "images/hr/11.jpg",
                        "images/hr/12-1.png",
                        "images/hr/13.jpg"
                    ],
                    onProgress:function(percent){
                        $('#loadingTips').text(parseInt(percent*100)+'%');
                    },
                    onFinish:function(){
                        $("#swiper-container,#audio_btn,#arrow").show();
                        $("#loadingBox").remove();
                        page.view.initSwiper();
                    }
                })
            }
        },//end data
        view:{
            init:function(){
                this.initBgSound();
            },//end init
            initFirstPage:function(){
                $(".page1").addClass('animated');
                $("#img1-1").addClass('animated zoomIn')
            },
            initSwiper:function(){
                this.initFirstPage();
                var mySwiper = new Swiper('#swiper-container',{
                    paginationClickable: true,
                    speed:300,
                    direction : 'vertical',
                    loop:true
                });
                mySwiper.on("onSlideChangeEnd",function(swiper){
                        var index = swiper.activeIndex;
                        $(".page"+index).find(".animation").removeClass('animation').addClass('animated');
                        
                })
            },//end swiper
            initBgSound:function () {
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
            }
        }
    };//end page
    page.init();
})