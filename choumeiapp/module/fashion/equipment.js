/**
 * Created by zhaoheng on 2015/12/2 16:36.
 * Last Modified by zhaoheng on 2015/12/2 16:36.
 */
define(['jquery','commonUtils', 'module/fashion/fashion.min'], function($, commonUtils, fashion){

    var page = {
        init: function( id ){

            page.render( id );

        },
        render: function( id ){

            fashion.equipmentCenter( id );

            fashion.title();

            commonUtils.addMenu();

        },
        event: function(){

        }
    }

    return {
        init: page.init
    };

})