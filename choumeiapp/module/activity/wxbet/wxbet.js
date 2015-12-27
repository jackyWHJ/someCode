/**
 * 
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-07-07 13:55:09
 * @version $Id$
 */

$(function(){
    var page = {
        init:function(){
            page.data.loadData();
            page.view.init();
        },
        data:{
            loadData:function(){
                commonUtils.require({
                    fileList:[
                    "images/0_背景.png",
                    "images/0_背景2.png",
                    "images/music_1.png",
                    "images/music_2.png",
                    "images/music_off.png",
                    "images/1_a.png",
                    "images/1_b.png",
                    "images/1_c.png",
                    "images/2_a.png",
                    "images/2_b.png",
                    "images/2_c.png",
                    "images/3_a.png",
                    "images/3_b.png",
                    "images/3_c.png",
                    "images/4_a.png",
                    "images/4_b.png",
                    "images/4_c.png",
                    "images/5_a.png",
                    "images/5_b.png",
                    "images/5_c.png",
                    "images/6_a.png",
                    "images/6_b.png",
                    "images/7_a.png",
                    "images/7_b.png",
                    "images/7_c.png",
                    "images/8_a.png",
                    "images/8_b.png",
                    "images/10_b.png",
                    "images/10_d.png",
                    "images/10_e.png",
                    "images/10_g.png",
                    "images/10_h.png",
                    "images/11_a.png",
                    "images/11_b.png",
                    "images/arrow.png",
                    "images/分享.png"
                    ],
                    processor:function(percentage){
                        $('#loadingTips').text(parseInt(percentage*100)+'%');
                    },
                    onFinish:function(){
                       $("#loadingWrap").hide();
                       $("#arrow,#audio_btn").show();
                       //缓冲时间
                       setTimeout(function(){page.view.initSwiper()},300);
                    }
                })
            }
        },
        view:{
            swiper:null,
            init:function(){
                this.initMask();
                this.initBgSound();
            },
            initSwiper:function(){
                var mySwiper = new Swiper('#swiper-container',{
                    paginationClickable: true,
                    speed:300,
                    direction : 'vertical'
                });
                mySwiper.on("onSlideChangeEnd",function(swiper){
                        var index = swiper.activeIndex+1;
                        //$(".page .pageWrap").hide();
                        $("#arrow").show();
                        if(index==9){
                            index = 10;
                            $("#arrow").hide();
                        }
                        //swap page index
                        $(".page"+index).find(".pageWrap").show();
                });

                this.swiper = mySwiper;
                $(".page1 .pageWrap").show();
                //mySwiper.slideTo(8);
            },//end swiper
            initMask:function(){
                var maskWrap = $(".maskWrap");
                var mask = $(".mask");
                var shareWrap = $(".shareWrap");
                var qrWrap = $(".qrWrap");
                var qr = $(".qr");
                $("#share").on("click",function(){
                    maskWrap.show();
                    shareWrap.show();
                })
                $("#follow").on("click",function(){
                    /*maskWrap.show();
                    qrWrap.show();*/
                    //换成跳转链接
                    window.location = "../../salon/salonList.html";
                })
                mask.on("click",function(){
                    maskWrap.hide();
                    shareWrap.hide();
                    qrWrap.hide();
                });
            },
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
                var $play = $("#playMusic");   
                var timer = setInterval(function(){
                    $play.toggleClass('changeBg');
                }, 800)

                $play.on("click",function(){
                    var dataStatus = $(this).attr('status');
                    if(dataStatus=='play'){
                        audio[0].pause();
                        $play.addClass('pause');
                        $(this).attr('status','paused');
                    }else{
                        audio[0].play();
                        $play.removeClass('pause');
                        $(this).attr('status','play');
                    }
                })

               // audio[0].pause();
            }
        },
        action:{
            
        }
    }//end page
    page.init();
})