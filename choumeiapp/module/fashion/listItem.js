/**
 * Created by zhaoheng on 2015/12/2 16:36.
 * Last Modified by zhaoheng on 2015/12/2 16:36.
 */
define(['jquery','commonUtils', 'swiper', 'module/fashion/fashion.min'], function($, commonUtils, Swiper, fashion){

    var page = {
        init: function( id ){

            commonUtils.addMenu();

            page.render( id );

        },
        template: function( data ){

            document.title = data.name;
            $(".header .title").text( data.name );
            $(".introduction h3 span").text( data.name );


            $(".head-people-liked .pink").text( data.bookingNum + "人" );

            //$(".introduction h3 i").text( data.position );

            $("#description").html( fashion.replaceToNewline( data.desc ) );


            if( data.norms.length > 0 ){

                var norms = '';
                $.map( data.norms, function(object, key){

                    norms += '<section class="grid-block slimming" data-normId="' + object.normId + '"><section class="grid-block-item"><img src="' + object.img +
                             '"><span class="gray-big slimming-descrption">' + object.norm +
                             '</span></section><section class="line"></section><section class="grid-block-item two">' +
                             '<div class="slimming-price-wrap"><div class="slimming-price"><span class="gray-big">臭美会员价：' +
                             '</span><span class="pink ">￥<i id="choumei-slimming-waist-price">'+ object.price + '</i></span>' +
                             '</div><div class="text-right"><span class="gray">原价：</span><span>￥<i id="slimming-waist-price">' + object.priceOri + '</i></span></div></div></section></section>';
                });

                $("#norms").append( norms );
                $(".price").hide();

            }else{

                $("#choumei-price").text( data.price );

                $("#choumei-price-origin span").text( data.priceOri )

            }

            $("#fashion-equipmentSlogan span").text( data.equipmentSlogan );

            try{

                $(".needle-shop").attr({
                    "data-bannerId" : data.banner.bannerId
                });

                $(".needle-shop").append(
                    '<img src="' + data.equipmentCover + '">'
                );

            }catch(e){

            }

            var bannerImage = '';
            $.map( data.imgs, function( val, key){
                bannerImage += '<div class="swiper-slide" style="background-image:url(' + val + ')"></div>';
            });
            $("#swiper-container .swiper-wrapper").append( bannerImage );

            setTimeout(function(){
                page.swiper();
            }, 400);


            var notices = '';
            $.map( data.notices, function(object, key){
                notices += '<div class="grid-block-item"><div class="title">' + object.title +
                    '：</div><div class="title-description">' + fashion.replaceToNewline( object.content ) +
                    '</div></div>';
            })
            $(".appointment").append( notices );

            //电话号码
            $("#phone-num").text( data.beautyPhoneFormat );
            $("#choumei-call-price").text( data.bookingPrice );

        },
        swiper: function(){
            var swiper_list_head = new Swiper('.swiper-list-head', {
                pagination: '.swiper-pagination', // 如果需要分页器
                onInit: function () {
                    fashion.imgResize({
                        imgdiv:$('#swiper-container'),
                        imgwidth:$(window).width(),
                        biliw:375,
                        bilih:200
                    });
                }
            });
            return swiper_list_head;
        },
        render: function( id ){

            commonUtils.request({
                url: apiConfig.newApi + 'beauty/item-info.html',
                data :{
                    itemId: id
                },
                successCallback: function( data ){

                    if( data.response ){
                        page.template( data.response )
                    }

                    page.event();

                    fashion.call();

                    fashion.title();

                    fashion.appointment();

                    fashion.map();

                    fashion.share( data.response.share );

                    setTimeout(function(){
                        $("#content").show();
                    }, 300);

                }
            });

        },
        event: function(){

            $("#toTop").on("click", function(e){
                $('body,html').animate({ scrollTop: 0 }, 200, function(){ $("#toTop").hide() });
                return false;
            });

            $(document).scroll(function(){
                if( $(window).scrollTop() > 200 ){
                    $("#toTop").show();
                }else{
                    $("#toTop").hide();
                }
            });

            $(".expert").on("click", function(e){
                location = "expert.html"
            });

            $(".product-details").on("click", function(e){
                location = "../makeup/introduction.html?itemId=" + commonUtils.getQueryString("itemId");
            });

            $(".learn-makeup-center").on("click", function(e){
                location = "../makeup/mCenter.html"
            });

            $(".equipment").on("click", function(e){
                window.location = "equipment.html?itemId=" + commonUtils.getQueryString("itemId");
            })


        }
    }


    return {
        init: page.init
    };

})