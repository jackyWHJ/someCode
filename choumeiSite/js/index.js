/**
 * Created by jacky(王浩杰) on 14-8-13.
 * email:719810496@qq.com
 * Copyright (C) 2014 choumei.cn.
 */

var page3InteID = 0,page4InteID = 0,lastPage = 0,
    winHight = $(window).height(),nScrollHight = $(document).height();
$(document).ready(function() {
    var pageIndex = 1;
    if(winHight < 850){
        winHight = 850;
    }
    $(".pt-page").height(winHight);
    var $pages = $('.main');
    mainBindClick();
    $(".nav-li").bind("click",function(){
        var pageNo = $(this).attr("pageNo");
        $pages.hide();
        var $currentPage = $pages.eq(pageNo);
        $currentPage.css("left",$(window).width());
        $currentPage.show();
        $currentPage.animate({
            left:0  //页面从左到右实现滚动
        },500);
        if(pageNo == 0){
            mainBindClick();
        }else{
            $(".main").unbind("click");
        }
    });
    $(".nav-li  a").bind("click",function(){
        $(".nav-li  a").removeClass("active");
        $(this).addClass("active");
    });
    window.onscroll = function(){
        nScrollHight = $(document).height();var scrollTop = $(document).scrollTop();
        pageIndex = Math.floor((scrollTop-80)/winHight + 1);
        if(pageIndex != lastPage){
            //移除动画
            doAction(pageIndex)
            reDoAction(lastPage);
            lastPage = pageIndex;
        }
    };
    $(".android-download").on("click",function(e){
        e.stopPropagation();
    });
    page1Action();
    initPage();
    initMap();
    $("#govIcon").on("click",function(e){
        window.location = "https://cert.ebs.gov.cn/0ebb0d7a-19f5-434f-8094-173157cf8b14";
    });
});
/**
 * 初始化页面，隐藏图片并设置好初始位置
 * */
var initPage = function(){
    //page2图片位置
    page2RedoAction();
    page3RedoAction();
    page4RedoAction();
    page5RedoAction();
    page6RedoAction();
}
/**
 * 初始化地图
 * */
var initMap = function(){
    // 百度地图API功能
    var map = new BMap.Map("allmap");    // 创建Map实例
    var point = new BMap.Point(113.941869,22.546802);
    map.centerAndZoom(point, 18);  // 初始化地图,设置中心点坐标和地图级别
    map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
    map.setCurrentCity("深圳");          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    var marker = new BMap.Marker(point);  // 创建标注
    map.addOverlay(marker);               // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    map.panBy(490,250);
    var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
    var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
//    var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角
    map.addControl(top_left_control);
    map.addControl(top_left_navigation);
//    map.addControl(top_right_navigation);
};
var mainBindClick = function(){
    $(".main").unbind("click");
    $(".main").bind("click",function(){
        var scrollTop = $(document).scrollTop();
        pageIndex = Math.floor(scrollTop/winHight + 1);
        var scroll_offset = pageIndex*winHight + 80;
        if(scrollTop + winHight >= nScrollHight){
            scroll_offset = 0;
            lastPage = 0;
            setTimeout(initPage,1000);
        }
        $("html,body").animate({
            scrollTop:scroll_offset  //让body的scrollTop等于pos的top，就实现了滚动
        },500);
    });
};
/**
 * 执行动画
 * @param pageIndex 当前页面索引
 * */
var doAction = function(pageIndex){
//    var actionFunction = null;
    switch (pageIndex){
        case 1:
            
            break;
        case 2:
            page2Action();
            break;
        case 3:
            page3Action();
            break;
        case 4:
            page4Action();
            break;
        case 5:
            page5Action();
            break;
        case 6:
            page6Action();
            break;
        default :
            console.log("页面索引不存在"+pageIndex);
    }
//    actionFunction();
//    setTimeout(actionFunction,300);
}

/**
 * 执行撤销动画
 * @param pageIndex 当前页面索引
 * */
var reDoAction = function(pageIndex){

    switch (pageIndex){
        case 1:
            break;
        case 2:page2RedoAction();
            break;
        case 3:page3RedoAction();
            break;
        case 4:page4RedoAction();
            break;
        case 5:page5RedoAction();
            break;
        case 6:page6RedoAction();
            break;
        default :
            console.log("页面索引不存在"+pageIndex);
    }
}

/**
 * 页面1图片轮播
 * */
var page1Action = function(){
    var mySwiper = new Swiper('.swiper-container',{
       pagination: '.pagination',
       loop:true,
       paginationClickable: true,
       grabCursor: true,
       autoplay:2000
   });
   $(".swiper-container").on("click",function(event){
        event.stopPropagation?event.stopPropagation():event.cancelBubble();
        console.dir(event)
   }) 
}
/**
 * 页面2动画
 * */
var page2Action = function(){
    $(".page2-img-3").show();
    $(".page2-img-2").show();
    $(".page2-img-4").show();
    $(".page2-img-3").animate({
        bottom: 0
    },500);
    $(".page2-img-2").animate({
        left: "190px"
    },500);
    $(".page2-img-4").animate({
        right: "100px"
    },500);
    setTimeout(function(){
        $(".page2-img-5").show();
        $(".page2-img-6").show();
        $(".page2-img-7").show();
        $(".page2-img-6").animate({
            left: "85px",
            bottom: "180px"
        },500);
        $(".page2-img-7").animate({
            left:"110px",
            bottom: "45px"
        },500);
    },500);

}
/**
 * 页面3动画
 * */
var page3Action = function(){
    $(".page3-img-4").show();
    $(".page3-img-6").show();
    clearInterval(page3InteID);
    clearInterval(page4InteID);
    page3InteID = setInterval(function(){
        $(".scissor-div").toggleClass("scissor-animations");
    },500);
    $(".page3-img-4").animate({
        left: "130px"
    },500);
    $(".page3-img-6").animate({
        right: "150px"
    },500);
}
/**
 * 页面4动画
 * */
var page4Action = function(){
    $(".page4-img-2").animate({
        bottom: "30px"
    },500);
    $(".page4-img-2").animate({
        bottom: "80px"
    },500);
    clearInterval(page3InteID);
    clearInterval(page4InteID);
    page4InteID = setInterval(function(){
        $(".page4-img-2").animate({
            bottom: "30px"
        },500);
        $(".page4-img-2").animate({
            bottom: "80px"
        },500);
    },1000);
}
/**
 * 页面5动画
 * */
var page5Action = function(){
    $(".page5-img-2").show();
    $(".page5-img-4").show();
    $(".page5-img-2").animate({
        right: "200px"
    },500);
    $(".page5-img-4").animate({
        left: "240px"
    },500);
}
/**
 * 页面6动画
 * */
var page6Action = function(){
    $(".page6-img-2").show();
    $(".page6-img-4").show();
    $(".page6-img-3").show();
    $(".page6-img-2").animate({
        left: "30px"
    },500);
    $(".page6-img-4").animate({
        right: 0
    },500);
    $(".page6-img-3").animate({
        bottom: 0
    },1000);
}


/**
 * 页面2撤销动画
 * */
var page2RedoAction = function(){
    /*$(".page2-img-2").animate({
        left:"-680px"
    },1000);
    $(".page2-img-3").animate({
        bottom:"-385px"
    },1000);
    $(".page2-img-4").animate({
        right:"-600px"
    },1000);
    setTimeout(function(){
        $(".page2-img-2").hide();
        $(".page2-img-3").hide();
        $(".page2-img-4").hide();
    },1000);
    $(".page2-img-5").hide();
    $(".page2-img-5").css({
        left:"110px",
        bottom: "300px"
    });
    $(".page2-img-6").hide();
    $(".page2-img-6").css({
        left:"110px",
        bottom: "300px"
    });
    $(".page2-img-7").hide();
    $(".page2-img-7").css({
        left:"110px",
        bottom: "300px"
    });*/
    //page2图片位置
    $(".page2-img-2").hide();
    $(".page2-img-2").css({
        left:"-680px"
    });
    $(".page2-img-3").hide();
    $(".page2-img-3").css({
        bottom:"-385px"
    });
    $(".page2-img-4").hide();
    $(".page2-img-4").css({
        right:"-600px"
    });
    $(".page2-img-5").hide();
    $(".page2-img-5").css({
        left:"110px",
        bottom: "300px"
    });
    $(".page2-img-6").hide();
    $(".page2-img-6").css({
        left:"110px",
        bottom: "300px"
    });
    $(".page2-img-7").hide();
    $(".page2-img-7").css({
        left:"110px",
        bottom: "300px"
    });
}
/**
 * 页面3撤销动画
 * */
var page3RedoAction = function(){
    /*$(".page3-img-4").animate({
        left:"-600px"
    },1000);
    $(".page3-img-6").animate({
        right:"-600px"
    },1000);
    setTimeout(function(){
        $(".page3-img-4").hide();
        $(".page3-img-6").hide();
    },1000);*/
    //page3图片位置
    $(".page3-img-4").hide();
    $(".page3-img-4").css({
        left:"-600px"
    });
    $(".page3-img-6").hide();
    $(".page3-img-6").css({
        right:"-600px"
    });
}
/**
 * 页面4撤销动画
 * */
var page4RedoAction = function(){

}
/**
 * 页面5撤销动画
 * */
var page5RedoAction = function(){
   /* $(".page5-img-4").animate({
        left:"-600px"
    },1000);
    $(".page5-img-2").animate({
        right:"-600px"
    },1000);
    setTimeout(function(){
        $(".page5-img-4").hide();
        $(".page5-img-2").hide();
    },1000);*/
    //page5图片位置
    $(".page5-img-4").hide();
    $(".page5-img-4").css({
        left:"-600px"
    });
    $(".page5-img-2").hide();
    $(".page5-img-2").css({
        right:"-600px"
    });
}
/**
 * 页面6撤销动画
 * */
var page6RedoAction = function(){
    $(".page6-img-2").animate({
        left:"-600px"
    },500);
    $(".page6-img-3").animate({
        bottom:"-657px"
    },500);
    $(".page6-img-4").animate({
        right:"-600px"
    },500);
    setTimeout(function(){
        $(".page6-img-2").hide();
        $(".page6-img-3").hide();
        $(".page6-img-4").hide();
    },500);
    //page6图片位置
    /*$(".page6-img-2").hide();
    $(".page6-img-2").css({
        left:"-600px"
    });
    $(".page6-img-3").hide();
    $(".page6-img-3").css({
        bottom:"-657px"
    });
    $(".page6-img-4").hide();
    $(".page6-img-4").css({
        right:"-600px"
    });*/
}