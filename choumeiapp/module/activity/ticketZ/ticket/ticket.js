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
            page.action.init();
        },
        data:{
            loadData:function(){
                commonUtils.require({
                    fileList:[
                    "images/0.png",
                    "images/1_a.png",
                    "images/1_b.png",
                    "images/1_c.png",
                    "images/2_a.png",
                    "images/2_b.png",
                    "images/2_c.png",
                    "images/2_d.png",
                    "images/3_a.png",
                    "images/3_b.png",
                    "images/4_a.png",
                    "images/4_b.png",
                    "images/4_c.png",
                    "images/4_d.png",
                    "images/4_e.png",
                    "images/5_a.png",
                    "images/5_b.png",
                    "images/5_c.png",
                    "images/5_d.png",
                    "images/5_e.png",
                    "images/6_a.png",
                    "images/6_b.png",
                    "images/6_c.png",
                    "images/6_d.png",
                    "images/7_a.png",
                    "images/7_b.png",
                    "images/7_c.png",
                    "images/7_d.png",
                    "images/7_e.png",
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
                    "images/9_d.png",
                    "images/10_a.png",
                    "images/10_b.png",
                    "images/arrow.png"
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
            request: function(userName, mobilephone,url) {
                return commonUtils.ajaxRequest({
                    data: {
                        type: "Activity",
                        to: "addUser",
                        body: {
                            userName: userName,
                            mobilephone: mobilephone,
                            activityUrl:url,
                            activityId:2
                        }
                    },
                    url: apiConfig.userApi
                })
            }
        },
        view:{
            swiper:null,
            init:function(){
            },
            initSwiper:function(){
                var mySwiper = new Swiper('#swiper-container',{
                    paginationClickable: true,
                    speed:300,
                    direction : 'vertical'
                });
                mySwiper.on("onSlideChangeEnd",function(swiper){
                        var index = swiper.activeIndex+1;
                        //swap page index
                        if(index == 9){
                            index = 10;
                        }else if(index ==10){
                            index =9;
                        }
                        $(".page .pageWrap").hide();
                        $(".img5_c").removeClass("pointTo");
                        $("#arrow").show();
                        $(".page"+index).find(".pageWrap").show();
                        switch(index){
                            case 5:
                                $(".page5 .img5_c").show();
                                $(".page5 .img5_c").one("webkitAnimationEnd",function(){
                                    $(this).addClass('pointTo');
                                });
                                break;
                            case 6:
                                $(".page6 .img5_c").show();
                                $(".page6 .img5_c").one("webkitAnimationEnd",function(){
                                    $(this).addClass('pointTo');
                                });
                                break;
                            case 9:
                                $("#arrow").hide();
                                break;
                        }
                });

                this.swiper = mySwiper;
                $(".page1").find(".pageWrap").show();
                $(".img8_f").on("click",function(){
                    mySwiper.slideNext();
                })

                //mySwiper.slideTo(6);
            },//end swiper
        },
        action:{
            init:function(){
                this.initSubmit();
            },
            initSubmit: function() {
                var submitBtn = $("#submit");
                submitBtn.on("click", function() {
                    var mobilephone = $("#phone").val();
                    var name = $("#name").val();
                    if (!name) {
                        alert("对不起，亲，请您输入您的姓名");
                    } else if (!/^1[34578]\d{9}$/.test(mobilephone)) {
                        alert("对不起哦，亲，要输入正确的11位手机号码哦");
                    } else {

                        var  url = location.toString().substring().replace("ticket/","ticketOut/").replace("ticket.html","index.html")+"?name="+name+"&mobilephone="+mobilephone;
                        var data = page.data.request(name, mobilephone,url);
                        if(data.data.main.code==1010){
                            alert("已为您生成专属的求帮忙链接，赶快转发到朋友圈！");
                        }
                        location = data.data.main.activityUrl;
                    }
                });
            }
        }
    }//end page
    page.init();
})