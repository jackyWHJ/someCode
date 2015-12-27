/**
 * Created by zhaoheng on 2015/12/2 16:36.
 * Last Modified by zhaoheng on 2015/12/2 16:36.
 */
define(['jquery','commonUtils', 'module/makeup/makeup.min'], function($, commonUtils, makeUp){

    var page = {
        init: function(){

            page.render();

        },
        render: function( id ){

            makeUp.makeUpCenter();

            makeUp.call();

            makeUp.title();

            commonUtils.addMenu();

            page.event();

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

        }
    }


    return {
        init: page.init
    };

})