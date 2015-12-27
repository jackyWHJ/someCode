/**
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-04-07 11:01:39
 * @version $Id$
 */
define(["jquery", "commonUtils",'jquery.lazyLoad'],function($, utils,lazyload) {
        var  addr={addrLati:window.localStorage.getItem("addrLati")||geoLoc.addrLati,addrLong:window.localStorage.getItem("addrLong")||geoLoc.addrLong};
        //nav
        var tabItems = $(".tabItem");
        var navTabs = $("#nav .navTab");
        utils.addBack();
        utils.addMenu();
        $("#nav").on("click", ".navTab", function() {
            $(this).addClass("active").siblings().removeClass("active");
            tabItems.hide();
            tabItems.eq($(this).index(navTabs)).show();
        });
        var collectPage = {
            user:JSON.parse(window.sessionStorage.getItem("user") || window.localStorage.getItem("user")),
            loadTag: {
                salonList: {firstTime:true,end:false},
                itemList: {firstTime:true,end:false}
            },
            init: function() {
                utils.checkLogin();
                this.view.init();
                this.action.init();

            }, //end init
            data: {
                listData: {              
                    page:{salonPage:0,itemPage:0} ,
                    "load": function(type) {
                        //shop list to:favoritesSalon;proList to:favoritesItem 
                        var data = {
                            type: "User"
                        };
                        if (type =="salonList") {
                            //data["to"] = "favoritesSalon";                           
                            utils.request({
                            url: apiConfig.newApi+"user/salon-collection.html",
                            data:{
                                 userId:collectPage.user.userId,
                                 pageNum:++this.page.salonPage,
                                 pageSize:6,
                                 lati:addr.addrLati,
                                 long:addr.addrLong
                            },successCallback:function(data){
                                if(data.code==0){
                                    collectPage.view.updateSalonList(data.response);
                                }else{
                                    utils.showTip(data.message);
                                }   
                            }});                     
                        } else {
                            data["to"] = "favoritesItem";
                            data.body={
                                addrLong:addr.addrLong,
                                addrLati:addr.addrLati,
                                userId:collectPage.user.userId,
                                page:++this.page.itemPage,
                                pageSize:10
                            }
                            utils.ajaxRequest({data: data,successCallback: collectPage.view.updateItemList,url: apiConfig.userApi});
                            //return commonUtils.ajaxRequest({url:apiConfig.userApi,data:data});
                        }
                    }
                }
            }, //end data
            view: {
                "init": function() {
                    this.resetImgH();
                },
                resetImgH: function() {
                    var imgOriW = 690;
                    var imgOriH = 280;
                    var rate = 0.9 / (imgOriW / imgOriH);

                    function resetImgH() {
                        var imgH = $(window).width() * rate;
                        imgH > 280 ? imgH = 280 : "";
                        $("#imgHResetStyle").remove();
                        $("<style id='imgHResetStyle'> .sl-imgWrap{height:" + imgH + "px } </style>").appendTo($("head"));
                    }
                    resetImgH();
                    $(window).on("resize", resetImgH);
                },
                updateSalonList: function(data) {
                    var listData = data.salons;
                    if(collectPage.loadTag.salonList.firstTime){
                        //var other = data.response;
                        $("#salonNum").text(data.salonNum);
                        $("#itemNum").text(data.itemNum);
                    }
                    if (listData.length == 0) {
                        collectPage.loadTag.salonList.end = true;
                        if(collectPage.loadTag.salonList.firstTime){
                            $("#salonList").next().show();
                            $('#salonNum').text(0);
                        }
                        return -1;
                    }else{
                        collectPage.loadTag.salonList.firstTime = false;
                    }
                    var htmlStr = [];
                    $.each(listData, function(key, val) {
                        var tmpStr = "<li salonId=" + val.salonId + "><div class=\"sl-imgWrap\"><img  class=\"sl-img lazy\" src=\"../../images/default_salon.png\" data-original=\"" + val.img + "\" alt=\"臭美店铺\" /></div>" + "<div class=\"sl-desc\"><div class=\"clearfix\"><h1 class=\"sl-name text-overflow\">" + val.name + "</h1><span class=\"si-star\"><span class=\"sl-xing\" id=\"sl-xing\"></span><span class=\"sl-stars\" id=\"sl-stars\">"+val.stars+"</span></span><span class=\"sl-addr text-overflow\">"+val.areaName+"&nbsp;|&nbsp;"+val.dist+"</span> </div><ul class=\"sl-info\">" + "<li class=\"comment\"><span class=\"tip\">评价&nbsp;&nbsp;</span><span class=\"num\">" + val.commentNum + "</span></li><li class=\"satisfyNum\"><span class=\"tip\">满意数&nbsp;&nbsp;</span><span class=\"num\">" +val.satisfy+"</span></li><li class=\"csi\"><span class=\"tip\">满意度&nbsp;&nbsp;</span><span class=\"num\">" + val.satisfaction + "</span></li></ul></div>";
                        htmlStr.push(tmpStr);
                    })
                    $("#salonList").append(htmlStr.join(""));
                    $("img.lazy").removeClass("lazy").lazyload({effect:"fadeIn"});
                    //collectPage.action.itemListInit();
                },
                updateItemList: function(data) {
                    if(data.result){
                        var listData = data.data.main;
                        //$("#itemNum").text(data.data.other.itemNum);
                        if (listData.length == 0) {
                            collectPage.loadTag.itemList.end = true;
                            if(collectPage.loadTag.itemList.firstTime){
                                $("#itemList").next().show();
                            }
                            return -1;
                        }else{
                            collectPage.loadTag.itemList.firstTime = false;
                        }
                        var htmlStr = [];
                        //shop 
                        console.dir(listData);
                        $.each(listData, function(key, val) {
                            //itemType
                            var avatarImg ='';
                            var tmpStr="<li itemId=" + val.itemId + " addrLati=" + val.addrLati + " addrLong=" + val.addrLong + ">";
                            avatarImg = (val.itemShowType ==3)? val.stylistImg :val.img;
                            tmpStr+="<img src=\"../../images/default_img.png\" data-original=" + avatarImg + " alt=\"臭美项目\" class=\"il-img lazy\" />";
                            tmpStr+="<div class=\"il-info\"><h1 class=\"il-name\">" + val.itemName + "</h1>";
                            tmpStr+="<div class=\"il-price\"><span class=\"il-pCM text-overflow\">臭美价：<span class=\"red-color\">￥" + val.minPrice + "</span></span>";
                            if((val.itemType==1)&&(val.itemShowType!=2)){
                                tmpStr+="<span class=\"il-pOri\">原价：￥" + val.minPriceOri + "</span>";
                            }
                            tmpStr+="</div><div class=\"il-shop\"><span class=\"il-shopName\">" + val.salonName + "</span><span class=\"il-shopPos\"><span class=\"il-spName\">" + val.areaName + "</span><span class=\"il-spDis\">" + val.dist + "</span></span></div></div></li>";
                            htmlStr.push(tmpStr);
                        });
                        $("#itemList").append(htmlStr.join(""));
                        $("img.lazy").removeClass("lazy").lazyload({effect:"fadeIn"});
                    }               
                }
            }, //end view
            "action": {
                init: function() {
                    this.salonListInit();
                    $(".navTab:eq(1)").one("click",function(){
                        collectPage.action.itemListInit();
                    });
                }, //end init
                salonListInit: function() {
                    $(document).on("scroll", scrollSalonList)
                    function scrollSalonList() {
                        if ($("#salonList:hidden").length == 1) return;
                        var doc = $(document);
                        var winH = $(window).height();
                        if (doc.scrollTop() + winH >= doc.height()) {
                           // collectPage.action.loadList("salonList");
                            collectPage.data.listData.load('salonList');
                        }
                        if (collectPage.loadTag.salonList.end == true) {
                            doc.off("scroll", scrollSalonList);
                        }
                    }
                    $("#salonList").on("click", "li", function() {
                        location = "../salon/salonIndex.html?salonId=" + $(this).attr("salonId");
                    })
                    collectPage.data.listData.load('salonList');
                    //this.loadList("salonList");
                }, //end salonList
                itemListInit: function() {
                    $(document).on("scroll", scrollItemList)
                    function scrollItemList() {
                        //console.log("load itemList")
                        if ($("#itemList:hidden").length == 1) return;
                        var doc = $(document);
                        var winH = $(window).height();
                        if (doc.scrollTop() + winH >= doc.height()) {
                           // collectPage.action.loadList("itemList");
                           collectPage.data.listData.load('itemList');
                        }
                        if (collectPage.loadTag.itemList.end == true) {
                            doc.off("scroll", scrollItemList);
                        }
                    };
                    $("#itemList").on("click", "li", function() {
                        location = "../home/itemDetail.html?itemId=" + $(this).attr("itemId");
                    })
                    collectPage.data.listData.load('itemList');
                   // this.loadList("itemList");
                }
                 
            } //end action
        }
        collectPage.init();
    }
)
