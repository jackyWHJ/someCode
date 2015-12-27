/**
 * Created by zhaoheng on 2015/12/4 14:45.
 * Last Modified by zhaoheng on 2015/12/4 14:45.
 */
define(['jquery', "commonUtils"], function ($, commonUtils) {

    var page = {
        init: function () {
            commonUtils.addBack();
            page.getData();
        },
        deanTemplate: function (data, status) {
            var html = '';

            $.map( data, function(object, index){

                html += '<div class="grid-block-item" data-artificerId="' + object.artificerId +
                        '" data-expertGrade="' + object.expertGrade + '"><img src="' + object.img +
                        '" alt=""/><div class="trails deep-pink-bg">' + ( status ? '明星院长' : '院长' ) +
                        '</div><div class="expert-name gray-big text-overflow">' + object.name +
                        '</div></div>';
            });

            return html;

        },
        getData: function () {

            commonUtils.request({
                url: apiConfig.newApi + "semipermanent/artificers.html",
                successCallback: function (data) {

                    var starDean = '', dean = '';

                    if( data.response.popArtificer.length ){
                        starDean = page.deanTemplate( data.response.popArtificer, true );
                    }

                    if( data.response.artificer.length ){
                        dean = page.deanTemplate( data.response.artificer, false );
                    }
                    //$(".exper-num-people").text( data.response.popArtificer.length + data.response.artificer.length );
                    $(".star-dean .grid-block").html( starDean );
                    $(".dean .grid-block").html( dean );

                    page.event();

                    commonUtils.addMenu();

                    setTimeout(function(){
                        $("#content").show();
                    }, 300);

                }
            });

        },
        event: function(){

            $(".go").on("click", function(){
                window.location = "semipermanent.html";
            });

            $(".grid-block-item").on( "click", function(e){

                window.location = "starItem.html?artificerId=" + $(this).attr( "data-artificerId" );

            });

        }
    };

    return {
        init: page.init
    }

});
