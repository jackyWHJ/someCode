/**
 * Created by zhaoheng on 2015/12/2 16:36.
 * Last Modified by zhaoheng on 2015/12/2 16:36.
 */
define(['jquery', 'commonUtils', 'module/makeup/makeup.min'], function ($, commonUtils, makeUp) {

    var page = {
        init: function (id) {

            page.render(id);

        },
        template: function (data) {

            var head = '', serviceNumber = '', personalIntroduction = '', centerIntroduction = '', expertintroduction = '', serviceintroduction = '', qualification = '';

            head = '<div class="head-people-liked gray-big"><span class="pink" id="praise">' + data.likeNum +
                '</span><span><img class="' + (data.liked == 0 ? "like" : "liked") +
                '" src="' + ( data.liked == 0 ? '../../images/makeup/zhuanjia_heart_icon_normal.png' : '../../images/makeup/zhuanjia_heart_icon_pressed.png' ) +
                '"></span></div><div class="left-icon"></div><div class="star-wrap"><div><span class="star-name gray-big">' + data.name +
                '</span><span class="star-qualifications">' + data.position +
                '</span></div><div class="star-say-decription grayer">' + makeUp.replaceToNewline( data.signature ) + '</div></div>';

            serviceNumber = '<span class="gray">服务人数</span><span id="service-number-people" class="pink">' + data.serviceTimes + '</span>人';

            personalIntroduction = '<div><span class=" gray nationality-country">国籍</span><span class="nationality-name gray-big">' + data.nation +
                '<img src="' + data.nationImg +
                '"></span></div><div class="experience"><span class="gray">从业经验</span><p class="gray-big">' + makeUp.replaceToNewline( data.experience ) +
                '</p></div>';

            $.map( data.attachments, function(object, key){

                qualification += '<div class="qualification"><span class="gray">' + object.title + '</span><p class="gray-big">' + makeUp.replaceToNewline( object.content ) + '</p></div>'

            });

            $(".head-img").css("background-image", "url(" + data.img + ")").append(head);

            $(".service-number").append(serviceNumber);

            $(".nationality").append( personalIntroduction + qualification );

            $("#phone-num").text( data.beautyPhoneFormat );


        },
        render: function (id) {

            commonUtils.request({
                url: apiConfig.newApi + 'semipermanent/artificer-info.html',
                data: {
                    artificerId: id
                },
                successCallback: function (data) {

                    page.template(data.response);

                    page.event();

                    makeUp.makeUpCenter();

                    makeUp.call();

                    makeUp.title();

                    setTimeout(function(){
                        $("#content").show();
                    }, 300);

                }
            });

        },
        event: function () {

            $(".like").on("click", function (e) {

                if( commonUtils.checkLogin() ){

                    commonUtils.request({
                        url: apiConfig.newApi + 'user/like-semipermanent-artificer.html',
                        data: {
                            artificerId: commonUtils.getQueryString("artificerId")
                        },
                        successCallback: function (data) {
                            $(".like").attr("src", "../../images/makeup/zhuanjia_heart_icon_pressed.png").unbind("click").removeClass("like").addClass("liked");
                            $("#praise").text( parseInt( $("#praise").text() ) + 1 );
                        }
                    })

                }

            });

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