/**
 * Created by zhaoheng on 2015/12/2 16:36.
 * Last Modified by zhaoheng on 2015/12/2 16:36.
 */
define(['jquery','commonUtils', 'swiper', 'module/makeup/makeup.min'], function($, commonUtils, Swiper, makeUp){

    var page = {
        init: function( id ){

            page.render( id );

        },
        template: function( data ){

            document.title = data.name;
            $(".header .title").text( data.name );
            $(".introduction h3 span").text( data.name );


            $(".head-people-liked .pink").text( data.bookingNum + "人" );

            $(".introduction h3 i").text( data.position );

            $("#choumei-price").text( data.price );

            $("#choumei-price-origin span").text( data.priceOri );

            $("#description").html( makeUp.replaceToNewline( data.desc ) );

            try{

                $(".needle-shop").attr({
                    "data-bannerId" : data.banner.bannerId
                }).append(
                   '<img src="' + data.banner.img + '">'
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
            }, 500 );

            var notices = '';
            $.map( data.notices, function(object, key){
                notices += '<div class="grid-block-item"><div class="title">' + object.title +
                '：</div><div class="title-description">' + makeUp.replaceToNewline( object.content ) +
                '</div></div>';
            })
            $(".appointment").append( notices );

            $("#phone-num").text( data.beautyPhoneFormat );
            $("#choumei-call-price").text( data.bookingPrice );

        },
        swiper: function(){
            var swiper_list_head = new Swiper('#swiper-container', {
                pagination: '.swiper-pagination', // 如果需要分页器
                onInit: function () {
                    makeUp.imgResize({
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
                        page.template( data.response );
                        //makeUp.share( data.response.share );
                    }

                    page.event();

                    makeUp.call();

                    makeUp.title();

                    makeUp.appointment();

                    commonUtils.addMenu();

                    makeUp.map();

                    makeUp.share( data.response.share );

                    setTimeout(function(){
                        $("#content").show();
                    }, 300);


                }
            });

        },
        event: function(){

            //$("#toTop").on("click", function(e){
            //    $('body,html').animate({ scrollTop: 0 }, 200, function(){ $("#toTop").hide() });
            //    return false;
            //});
            //
            //$(document).scroll(function(){
            //    if( $(window).scrollTop() > 200 ){
            //        $("#toTop").show();
            //    }else{
            //        $("#toTop").hide();
            //    }
            //});

            $(".expert").on("click", function(e){
                location = "expert.html"
            });

            $(".product-details").on("click", function(e){
                location = "introduction.html?itemId=" + commonUtils.getQueryString("itemId");
            });

            $(".learn-makeup-center").on("click", function(e){
                location = "mCenter.html"
            });

        }
    }


    return {
        init: page.init
    };

})