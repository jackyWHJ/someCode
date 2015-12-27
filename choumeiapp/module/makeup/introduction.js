/**
 * Created by zhaoheng on 2015/12/3 14:51.
 * Last Modified by zhaoheng on 2015/12/3 14:51.
 */
define(['jquery', 'swiper', 'commonUtils', 'module/makeup/makeup.min'], function ($, Swiper, commonUtils, makeUp) {

    var page = {
        init: function ( id ) {

            page.render( id );

        },
        swiper: function(){

            $("#swiper-list-introduction-container").height($(window).height() - $(".header").height() - $(".list-item-introduction-title-wrap").height() - 20);

            var swiper_list_introduction = new Swiper('.swiper-list-introduction', {
                direction: 'horizontal',
                onInit: function () {
                },
                onSlideChangeStart: function (swiper) {
                    $(".list-item-introduction-title-wrap .grid-block-item").removeClass("active");
                    if (swiper.activeIndex == 0) {
                        $(".list-item-introduction-title-wrap .grid-block-item")[0].className = "grid-block-item active";
                    } else if (swiper.activeIndex == 1) {
                        $(".list-item-introduction-title-wrap .grid-block-item")[1].className = "grid-block-item active";
                    } else if (swiper.activeIndex == 2) {
                        $(".list-item-introduction-title-wrap .grid-block-item")[2].className = "grid-block-item active";
                    }
                }
            });

            $( $(".list-item-introduction-title-wrap .grid-block-item").get(0) ).on( "click", function(e){
                swiper_list_introduction.slideTo( 0 );
            });

            $( $(".list-item-introduction-title-wrap .grid-block-item").get(1) ).on( "click", function(e){
                swiper_list_introduction.slideTo( 1 );
            });

            $( $(".list-item-introduction-title-wrap .grid-block-item").get(2) ).on( "click", function(e){
                swiper_list_introduction.slideTo( 2 );
            });

        },
        template: function( data ){

            $("#process").text( data.beautyProcedureName );

            document.title = data.name;
            $(".header .title").text( data.name );

            var title = "";
            $.map(data.introductions, function(object, key){

                var img = '';
                $.map( object.imgs, function(val, key){
                    img += '<img src="' + val + '">';
                });

                title += img + '<h2 class="pink">' + object.title +
                         '</h2><p class="gray">' + makeUp.replaceToNewline( object.content ) + '</p>';

            });

            if( data.profile.length ){

                var profile = '<table><tr><td colspan="2">产品档案</td></tr>';
                $.map( data.profile, function(object, key){

                    profile += '<tr><td>'+ object[0] + '</td><td>'+ makeUp.replaceToNewline( object[1] ) +'</td></tr>';

                });

                profile +=  '</table>';

            }


            $(".one .product").append( title + profile );

            makeUp.makeUpCenter();

            var product = "";
            $.map(data.bookingProcedure, function(object, key){

                var img = '';
                $.map( object.imgs, function(val, key){
                    img += '<img src="' + val + '">';
                });

                product += img +  '<h2 class="pink">' + object.title +  '</h2><div>' +
                    '<p class="gray">' + makeUp.replaceToNewline( object.content ) + '</p></div>';

            });
            $(".two").append( '<div class="product">' + product + '</div>' );

            var beautyProcedure = "";
            $.map(data.beautyProcedure, function(object, key){

                var img = '';
                $.map( object.imgs, function(val, key){
                    img += '<img src="' + val + '">';
                });

                beautyProcedure += '<li>' + img + '<span>' + ( key + 1 ) + '</span><h2>' + object.title + '</h2>' + makeUp.replaceToNewline( object.content ) + '</li>';

            });
            $(".three ul").append( beautyProcedure );

            $("#phone-num").text( data.beautyPhoneFormat );

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

                    setTimeout(function(){

                        page.swiper();
                        page.event();

                    }, 500);

                    makeUp.appointment();
                    makeUp.call();
                    makeUp.title();
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

            $("#toTop").on("click", function(e){
                $('.swiper-slide').animate({ scrollTop: 0 }, 200, function(){ $("#toTop").hide() });
                return false;
            });

            $(".swiper-slide").scroll(function(e){

                var nScrollTop = e.currentTarget.scrollTop;

                if( nScrollTop > 200 ){
                    $("#toTop").show();
                }else{
                    $("#toTop").hide();
                }
            });

        }
    }


    return {
        init: page.init
    };

});