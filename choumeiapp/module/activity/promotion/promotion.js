/**
 * 
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-07-07 13:55:09
 * @version $Id$
 */

$(function(){
    $(".cloud").one("webkitAnimationEnd",function(){
        $(this).removeClass('bounceInLeft bounceInRight').addClass('animation2');
    })
    setTimeout(function(){
        $(".star").show();
    }, 2000)
    
    var page = {
        init:function(){
            page.data.loadData();
            page.view.init();
            page.action.init();
        },
        data:{
            loadData:function(){
                commonUtils.require({
                    fileList:[
                    "images/1_a.png",
                    "images/1_b.png",
                    "images/1_c.png",
                    "images/1_e.png",
                    "images/1_h.png",
                    "images/2_a.png",
                    "images/2_b.png",
                    "images/2_c.png",
                    "images/2_d.png",
                    "images/2_e.png",
                    "images/2_f.png",
                    "images/2_g.png",
                    "images/2_h.png",
                    "images/3_a.png",
                    "images/3_b.png",
                    "images/3_c.png",
                    "images/3_d.png",
                    "images/3_e.png",
                    "images/3_f.png",
                    "images/4_a.png",
                    "images/4_b.png",
                    "images/4_c.png",
                    "images/4_d.png",
                    "images/4_e.png",
                    "images/4_f.png",
                    "images/5_a.png",
                    "images/5_b.png",
                    "images/5_c.png",
                    "images/5_d.png",
                    "images/5_e.png",
                    "images/5_f.png",
                    "images/5_g.png",
                    "images/5_h.png",
                    "images/5_i.png",
                    "images/6_a.png",
                    "images/6_b.png",
                    "images/6_c.png",
                    "images/6_d.png",
                    "images/6_e.png",
                    "images/7_a.png",
                    "images/7_b.png",
                    "images/7_c.png",
                    "images/7_d.png",
                    "images/7_e.png",
                    "images/7_f.png",
                    "images/7_g.png",
                    "images/8_a.png",
                    "images/8_b.png",
                    "images/8_c.png",
                    "images/8_d.png",
                    "images/8_e.png",
                    "images/8_f.png",
                    "images/8_g.png",
                    "images/9_a.png",
                    "images/9_b.png",
                    "images/9_c.png",
                    "images/10_a.png",
                    "images/10_b.png",
                    "images/10_c.png",
                    "images/10_d.png",
                    "images/10_e.png",
                    "images/10_f.png",
                    "images/11_a.png",
                    "images/11_b.png",
                    "images/11_buton_wenzi.png",
                    "images/12_a.png",
                    "images/12_b.png",
                    "images/12_c.png",
                    "images/12_d.png",
                    "images/12_e.png",
                    "images/13_a.png",
                    "images/13_b.png",
                    "images/arrow.png",
                    ],
                    processor:function(percentage){
                        $('#loadingTips').text(parseInt(percentage*100)+'%');
                    },
                    onFinish:function(){
                       $("#loadingWrap").hide();
                       $("#arrow").show();
                       page.view.initSwiper();
                    }
                })
            },
            request: function(mobilephone, friendPhone,url,cb) {
                return commonUtils.ajaxRequest({
                    data: {
                        type: "Activity",
                        to: "addFriend",
                        body: {
                            friendPhone: friendPhone,
                            mobilephone: mobilephone,
                            activityUrl:url
                        }
                    },
                    url: apiConfig.userApi,
                    successCallback:cb
                })
            }
        },
        view:{
            swiper:null,
            init:function(){
                this.initPage4_tear();
                this.initPage12();
                $("#name").text(commonUtils.getQueryString("name"));
            },
            initPage4_tear:function(){
                var $e = $(".page4 .tear");
                $e.on("webkitAnimationEnd",function(){
                    $e.removeClass('fadeIn').addClass('translateY');
                })
            },
            initSwiper:function(){
                var mySwiper = new Swiper('#swiper-container',{
                    paginationClickable: true,
                    speed:300,
                    direction : 'vertical'
                });
                mySwiper.on("onSlideChangeEnd",function(swiper){
                        var index = swiper.activeIndex+1;
                        $(".page"+index).find(".pageWrap").show();
                        switch(index){
                            case 2:
                                setTimeout(function(){
                                    $(".page2 .man").show();
                                }, 2000);
                                break;
                            case 3:
                                setTimeout(function(){
                                    $(".page3 .man").show();
                                }, 1000);
                                setTimeout(function(){
                                    $(".page3 .head").show();
                                }, 2000);
                                break;
                            case 6:
                                setTimeout(function(){
                                    $(".page6 .light").css("visibility","visible");
                                }, 1000);
                                break;
                            case 7:
                                setTimeout(function(){
                                        var foot = $(".page7 .foot");
                                        var timer = foot.attr("timer");
                                        if(timer){
                                            return;
                                        }else{
                                            var timer = setInterval(function(){
                                                var src = foot.attr("src");
                                                foot.attr("timer",timer);
                                                console.dir(1)
                                                if(src.indexOf("c")!=-1){
                                                    foot.attr("src","images/7_b.png");
                                                }else{
                                                    foot.attr("src","images/7_c.png");
                                                }
                                            }, 500)
                                        }
                                        
                                    }, 1000);
                                break;
                            case 12:
                                $("#arrow").hide();
                                break;
                        }
                });
                this.swiper = mySwiper;
            },//end swiper
            initPage12:function(){
                var mask = $(".maskWrap");
                $("#share").on("click",function(){
                    mask.show().delay("4000").fadeOut("slow");
                })
                mask.on("click",function(){
                    $(this).hide();
                })
            }
        },
        action:{
            init:function(){
                this.initSubmit();
            },
            initSubmit: function() {
                var submitBtn = $("#submit");
                submitBtn.on("click", function() {
                    var val = $("#phone").val();
                    if (!/^1[34578]\d{9}$/.test(val)) {
                        alert("对不起哦，亲，要输入正确的11位手机号码才能支持朋友哦！");
                    } else {
                        var mobilephone = commonUtils.getQueryString("phone");
                        var  url = location.toString();
                        page.data.request(mobilephone,val,url,function(data){
                            if(data.result!=1){
                                alert("亲爱的，你已经成功支持朋友，不能重复支持哟，赶快下载臭美APP下单吧！");
                            }else{
                                alert("感谢兄弟姐们的捧场哟，赶快下载臭美APP去下单吧！")
                            }
                            page.view.swiper.slideTo(12);
                        });
                    }
                });
            }
        }
    }//end page
    page.init();
})