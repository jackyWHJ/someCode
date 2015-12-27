/**
 * Created by zhaoheng on 2015/12/4 13:59.
 * Last Modified by zhaoheng on 2015/12/4 13:59.
 */
define(['jquery', "commonUtils"], function ($, commonUtils) {

    var page = {
        init: function () {
            commonUtils.addBack();
            page.render();
        },
        deanTemplate: function (data) {
            var html = "";

            $.map( data, function( object, key ){
                html += '<li data-itemId=' + object.itemId + '><img src="' + object.icon +
                    '"><div class="il-info"><h4 class="il-name gray-big">' + object.name +
                    '</h4><div class="il-member"><span class="il-member-price text-overflow gray-big">臭美会员价：<span class="pink">￥' + object.price  +
                    '</span></span> </div><div class="il-old"><span class="il-old-price gray">原价：<span>￥' + object.priceOri +
                    '</span></span></div><div class="right-icon"></div></div></li>'
            });

            return html;

        },
        render: function () {
            commonUtils.request({
                url: apiConfig.newApi + 'semipermanent/items.html',
                successCallback: function (data) {

                    var starDeanTemplate = '',  deanTemplate = '';

                    if( data.response.popArtificer.length ){
                        starDeanTemplate = page.deanTemplate( data.response.popArtificer );
                    }

                    if( data.response.artificer.length ){
                        deanTemplate = page.deanTemplate( data.response.artificer );
                    }

                    if( data.response.banner ){

                        if( data.response.banner.eventType == 1 ){
                            $(".semipermanent-banner").css("background-image", "url(" + data.response.banner.img + ")" )
                                .append( "<a href='" + data.response.banner.url + "'></a>" );
                        }else if( data.response.banner.eventType == 0 ){
                            $(".semipermanent-banner").css("background-image", "url(" + data.response.banner.img + ")" );
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
                                case 'artificers': url = "expert.html";
                                    break;
                                default:
                                    commonUtils.showTip("事件类型有错！");
                                    break;
                            };
                            $(".semipermanent-banner").css("background-image", "url(" + data.response.banner.img + ")" )
                                .append( "<a href='" + data.response.banner.url + "'></a>" );
                        }
                    }

                    $(".star-dean ul").html( starDeanTemplate );
                    $(".dean ul").html( deanTemplate );

                    page.event();

                    commonUtils.addMenu();

                    setTimeout(function(){
                        $("#content").show();
                    }, 300);

                }
            })
        },
        event: function(){

            $(".project li").on("click", function(e){

                window.location = "listItem.html?itemId=" + $(this).attr( "data-itemId" );

            });

        }
    }

    return {
        init: page.init
    }

});