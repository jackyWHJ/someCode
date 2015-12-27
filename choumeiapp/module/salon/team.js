/**
 * 
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-04-14 16:40:22
 * @version $Id$
 */
define(["jquery", "commonUtils",'jquery.lazyLoad'],
    function($, commonUtils,lazyload) {
        var page = {
            init:function(){
				commonUtils.addBack();
				commonUtils.addMenu();
                this.action.init();
            },
            data: {
                tag:{end:false},
                addrLati:window.localStorage.getItem("addrLati")||geoLoc.addrLati,
                addrLong: window.localStorage.getItem("addrLong")||geoLoc.addrLong,
                load: function(callback) {
                    var params =  {
                        url:apiConfig.newApi+'stylist/list.html',
                        data:{
                            lati:page.data.addrLati,
                            long:page.data.addrLong,
                            sort:1,
                            salonId: commonUtils.getQueryString("salonId")
                        },
                        successCallback:function(data){
                            if (data.code == 0){
                                var data = data.response;
                                if(data && data.length == 0){
                                    page.data.tag.end = true;
                                }
                                callback(data);
                            }
                            else{
                                commonUtils.alert(data.message);
                                return;
                            }
                        }
                    };
                    commonUtils.request(params);
                }
            }, //end data
            view:{
                resetImg:function(){
                    var rate = 279/328;//height/width
                    var imgW = $("body").width()*0.9*0.47;
                    $("#imgHResetStyle").remove();
                    $("<style id='imgHResetStyle'> .sl-s-imgWrap{height:" + imgW*rate + "px } </style>").appendTo($("head"));
                },
                updateList:function(data){
                    var tmpStr = [];
                    $.each(data,function(key,val){
                        tmpStr.push('<li stylistId='+val.stylistId+'>');
                        tmpStr.push('<div class="sl-stylist"><div class="sl-s-imgWrap">');
                        tmpStr.push('<img class="sl-s-img lazy" src="../../images/default_img.png"  data-original ='+val.img+'></div>');
                        tmpStr.push('<div class="sl-s-info"><h1 class="sl-s-name text-overflow">'+val.name+'</h1>');
                        tmpStr.push('<div class="sl-s-subInfo"><span class="sl-s-rank">'+val.grade+'</span>');
                        tmpStr.push('<p class="sl-salonname text-overflow">'+val.salonname+'</p>');
                        tmpStr.push('<p class="sl-address"><i></i><span class="sla-name text-overflow">'+val.areaName+'</span><span class="sla-distance text-overflow">'+val.distance+'</span></p>');
                        tmpStr.push('</div></div></div></li>');
                    });
                    $("#stylistList").append(tmpStr.join(""));
                    $("img.lazy").removeClass("lazy").lazyload({effect:"fadeIn"});
                }
            },//end view
            action:{
                init: function(){
                    page.data.load(page.view.updateList);
                    this.initList();
                },
                initList:function(){
                    var doc = $(document);
                    var winH = $(window).height();
                    function scrollItemList(){
                        if (doc.scrollTop() + winH >= doc.height()) {
                            //no pagination
                            // page.data.load(page.view.updateList);
                        }
                    }
                    doc.on("scroll", scrollItemList);

                    $("#stylistList").on("click","li",function(){
                        location = "stylist.html?stylistId="+$(this).attr("stylistId");
                    })
                }
            }//end action
        };//end stylistList

        return page
    });
