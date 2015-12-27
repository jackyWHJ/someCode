/**
 * Created by zhaoheng on 2015/12/2 11:17.
 * Last Modified by zhaoheng on 2015/12/2 11:17.
 */
define(['jquery', "commonUtils", "module/fashion/fashion.min"], function( $, commonUtils, fashion ){

    var page = {
        init: function(){
            page.render();
        },
        htmlTemplate: function( data ){
            var html = '';

            $.map( data, function( object, index ){
                html += '<li class="clearfix" data-itemId="' + object.itemId +
                        '"><img src="'+ object.icon + '">' +
                        '<div><h3 class="text-overflow">' + object.name +
                        '</h3><span class="text-overflow">' + fashion.replaceToNewline( object.desc ) +
                        '</span><aside><span class="num">' + object.bookingNum +
                        '</span>人已预约</aside></div></li>';
            });

            return html;
        },
        render: function(){
            commonUtils.request({
                url: apiConfig.newApi + 'fast-fasion/index.html',
                successCallback: function( data ){
                    if( data.response.items.length ){

                        $(".list ul").html(  page.htmlTemplate( data.response.items ) );

                        page.event();

                        commonUtils.addMenu();

                        fashion.title();

                    }

                    if( data.response.banner ){

                        if( data.response.banner.eventType == 1 ){
                            $(".head-img").css("background-image", "url(" + data.response.banner.img + ")" )
                                .append( "<a href='" + data.response.banner.url + "'></a>" );
                        }else if( data.response.banner.eventType == 0 ){
                            $(".head-img").css("background-image", "url(" + data.response.banner.img + ")" );
                        }else if( data.response.banner.eventType == 2 ){
                            var bannerUrl = $.parseJSON( data.response.banner.url );
                            /*FFA 快时尚项目详情页 itemId 项目的id
                             SPM 半永久项目详情页  itemId 项目的id
                             salon 店铺主页 salonId 店铺的id
                             artificers 专家列表*/
                            switch( bannerUrl.type ){
                                case 'FFA': url = "../fashion/listItem.html?itemId="+bannerUrl.itemId;
                                    break;
                                case 'SPM': url = "../makeup/listItem.html?itemId="+bannerUrl.itemId;
                                    break;
                                case 'salon': url = "../salon/salonIndex.html?salonId="+bannerUrl.itemId;
                                    break;
                                case 'artificers': url = "../makeup/expert.html";
                                    break;
                                default:
                                    commonUtils.showTip("事件类型有错！");
                                    break;
                            };
                            $(".head-img").css("background-image", "url(" + data.response.banner.img + ")" )
                                .append( "<a href='" + data.response.banner.url + "'></a>" );
                        }

                        fashion.imgResize({
                            imgdiv:$(".head-img"),
                            imgwidth:$(window).width(),
                            biliw:375,
                            bilih:200
                        });

                    }

                    setTimeout(function(){
                        $("#content").show();
                    }, 300);

                }
            });
        },
        event: function(){
            $(".list li").on("click", function(e){
                var id = $(this).attr( "data-itemId" );
                window.location = 'listItem.html?itemId=' + id;
            })
        }
    }

    return {
        init: page.init
    }

})