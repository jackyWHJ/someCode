/**
 * @authors zhao.heng
 * @date    2015-11-24
 */
define(["jquery", "commonUtils", "jquery.lazyLoad" ], function( $, commonUtils ){

    var mapUtil = {
        addr: {
            addrLati: window.localStorage.getItem("addrLati") || geoLoc.addrLati,
            addrLong: window.localStorage.getItem("addrLong") || geoLoc.addrLong
        },
        addrCom: null,
        init: function () {
            mapUtil.setPosition();
        },
        setPosition: function () {
            if (window.navigator.geolocation) {
                commonUtils.showLoading();
                window.navigator.geolocation.getCurrentPosition(function (position) {
                    // 获取到当前位置经纬度  本例中是chrome浏览器取到的是google地图中的经纬度
                    addrLong = position.coords.longitude;
                    addrLati = position.coords.latitude;
                    var point = new BMap.Point(addrLong, addrLati);
                    //原始坐标转换成百度坐标
                    BMap.Convertor.translate(point, 0, function (point) {
                        window.localStorage.setItem("addrLong", point.lng);
                        window.localStorage.setItem("addrLati", point.lat);
                        mapUtil.addr.addrLong = point.lng;
                        mapUtil.addr.addrLati = point.lat;
                        var geoc = new BMap.Geocoder();
                        geoc.getLocation(point, function (rs) {
                            mapUtil.addrCom = rs.addressComponents;
                            page.init();
                        });
                        commonUtils.hideLoading();
                    });
                }, function (err) {
                    commonUtils.alert("我们为您准备了更好的推荐服务，请允许微信访问地理位置信息\n您可以在“设置”中允许微信访问位置信息。");
                    page.init();
                    commonUtils.hideLoading();
                }, {
                    enableHighAccuracy: true,
                    timeout: 5000
                });
            } else {
                commonUtils.alert("浏览器不支持html5来获取地理位置信息");
            }
        }
    };


    var $circle = $("#circle"),
        $district = $("#district"),
        $zone = $("#zone");
    var page = {
        init: function () {
			// $("#back").on("click", function(e){
            // window.location = "myPage.html";
			// });
            page.data.requestData.type = commonUtils.getQueryString("itemType") || "";
            this.view.init();
            this.action.init();
        },//end init
        loadTag: {end: false, firstTime: true},
        itemTypeMap: {
            type_1: {name: "洗剪吹", img: "../../images/home/xianmuliebiao_xijiaochui_icon@2x.png"},
            type_2: {name: "烫发", img: "../../images/home/xianmuliebiao_tangfa_icon@2x.png"},
            type_3: {name: "染发", img: "../../images/home/xianmuliebiao_ranfa_icon@2x.png"},
            type_4: {name: "护发", img: "../../images/home/xianmuliebiao_hufa_icon@2x.png"},
            type_5: {name: "套餐", img: "../../images/home/xianmuliebiao_taocan_icon@2x.png"},
            type_7: {name: "洗吹", img: "../../images/home/xianmuliebiao_xichui_icon@2x.png"},
            type_8: {name: "15分钟快剪", img: "../../images/home/xiangmu_shijian@2x.png"}
        },
        data: {
            districtList: null,
            priceList: null,
            requestData: {
                "pageNum": 1,
                "pageSize": 10,
                "district": 0,
                "zone": 0,
                "lati": mapUtil.addr.addrLati,
                "long": mapUtil.addr.addrLong,
                //"addrLati":"4.9E-324",
                //"addrLong":"4.9E-324",
                "priceTag": 0,
                "itemType": 1,//page.type == 2 ? 2 : 1,//特价与否
                "type": 1//项目类型

            },//end listData
            listData:{}
        }, //end data
        view: {
            init: function () {
                this.initItemType();
                this.initDistrictList();
                this.initPosNav();
            },
            initPosNav: function () {
                $("#sl-h-pos").on("click",function(){
                    var self = $(this);
                    self.toggleClass('active');
                    $circle.toggle();
                });
            },
            initItemType: function () {
                var item = page.itemTypeMap["type_" + page.data.requestData.type];
                if (item) {
                    $("#h-itemImg").attr("src", item.img);
                    $("#h-itemName").html(item.name);
                    $("#header").show();
                }
                if (page.data.requestData.type == 8) {
                    $("#priceList,#ilAddress,#header").remove();
                    $("body").addClass('quickcutListPage');
                    this.initQuickCutBanner();
                }else{
                    $("#il-banner").remove();
                }
            },

            initDistrictList: function () {
                commonUtils.request({
                    url: apiConfig.newApi+"location/allArea.html",
                    data: {"type":0},
                    successCallback: function(data){
                        if(data.code == 0){
                            page.data.districtList = data.response;
                            page.view.initPriceList();
                            page.view.setDistrict();
                        }
                        else{
                            commonUtils.showTip(data.message);
                        }
                    }
                });
            },
            initPriceList: function () {
                var $price = $("#priceList");
                var htmlStr = [];
                commonUtils.ajaxRequest({
                    url: apiConfig.shopApi,
                    data: {
                        type: "Item",
                        to: "priceRange",
                        body: {
                            type: page.data.requestData.type
                        }
                    },
                    successCallback: function( result ){
                        var data = page.data.priceList = result.data.main;
                        $.each(data.priceRange, function (key, val) {
                            htmlStr.push("<li rangeId = \"" + val.rangeId + "\">" + val.rangeTitle + "</li>");
                        })
                        //去掉闲时特价
                        /*if (data.timeSale) {
                            htmlStr.push("<li class=\"special\" typeItem = \"" + data.timeSale.itemType + "\">" + data.timeSale.title + "</li>")
                        }*/
                        //special

                        $price.html(htmlStr.join(""));
                        $("#priceList").on("click", "li", function () {
                            //去掉闲时特价
                           /* if ($(this).hasClass("special")) {
                                location = 'limitedTimeItem.html'+ location.search;
                                return;
                            }*/
                            page.data.requestData.priceTag = $(this).attr("rangeId");
                            $(this).addClass("active").siblings().removeClass("active");
                            //去掉闲时特价
                           /* if ($(this).attr('typeItem') == 2) {
                                //特价
                                page.type = 2;
                            } else {
                                page.type = 1;
                            }*/
                            page.action.loadList(true);
                        });
                        page.action.loadList(true);
                    }
                });
                //console.dir(page.data.priceList);
            },
            setDistrict:function (){
                var htmlStr = [],district = null;
                if(mapUtil.addrCom){//有效获取位置时
                    district =mapUtil.addrCom.district;
                }
                $.each(page.data.districtList,function(key,val){
                    htmlStr.push("<li district=\""+val.tId+"\">"+val.tName+"</li>");
                    if(district && district == val.tName){
                        page.data.requestData.district = val.tId;
                    }
                });
                $district.html(htmlStr.join(""));
                if(!district){
                    //获取不到位置并无sessionStorage缓存时
                    var districtLi = $district.find('li:first');
                    districtLi.addClass("active");
                    page.data.requestData.district = districtLi.attr("district");
                }
                page.view.setZoom();
                $district.on("click","li",function(){
                    page.data.requestData.district = $(this).attr("district");
                    page.view.setZoom();
                });
            },
            setZoom:function (){
                $district.find("li[district="+page.data.requestData.district+"]").addClass("active").siblings().removeClass('active');;
                var htmlStr = [],areaInfo = [];
                $.each(page.data.districtList,function(key,val){
                    if(page.data.requestData.district == val.tId){
                        areaInfo = val.areaInfo;
                    }
                });
                $.each(areaInfo,function(key,val){
                    htmlStr.push("<li zone=\""+val.areaId+"\">"+val.areaName+"</li>");
                });
                page.data.requestData.zone = $zone.html(htmlStr.join("")).find("li:first").addClass("active").attr("zone");

                $zone.off("click").on("click","li",function(){
                    var self = $(this);
                    self.addClass('active').siblings().removeClass('active');
                    page.data.requestData.zone = self.attr("zone");
                    $("#sl-h-posText").text($district.find("li[district="+page.data.requestData.district+"]").text());
                    $("#sl-h-pos").click();
                    page.action.loadList(true);
                });
            },
            /*@type reset empty the html
             *
             */
            updateItemList: function (reset) {
                var listData = page.data.listData;
                var $noItemList = $('#noItemList'),
                    $itemList = $('#itemList');
                if (reset) {
                    page.loadTag.firstTime = true;
                    page.loadTag.end = false;
                    $itemList.empty();
                } else {
                    page.loadTag.firstTime = false;
                }
                if (listData.length == 0) {
                    page.loadTag.end = true;
                    if (page.loadTag.firstTime) {
                        $noItemList.show();
                        $itemList.hide();
                    }
                    return -1;
                } else {
                    $itemList.show();
                    $noItemList.hide();
                    //page.loadTag.firstTime = false;
                    var htmlStr = [], list = $("#itemList");
                    //shop
                    $.each(listData, function (key, val) {
                        var tmpStr;
                        if(page.itemType!=8){
                         tmpStr= "<li itemId=" + val.itemId + "><img src=\"../../images/default_img.png\" data-original=" + val.itemLogo.thumb + " alt=\"臭美项目\" class=\"il-img lazy\" /><div class=\"il-info\"><h1 class=\"il-name\">" + val.itemName + "</h1><div class=\"il-price\"><span class=\"il-pCM text-overflow\">臭美价：<span class=\"red-color\">￥" + val.price + "</span></span>" + (page.type == 2 ? "" : "<span class=\"il-pOri\">原价：￥" + val.priceOri + "</span>") + "</div><div class=\"il-shop\"><span class=\"il-shopName\">" + val.salonName + "</span><span class=\"il-shopPos\"><span class=\"il-spName\">" + val.area + "</span><span class=\"il-spDis\">" + val.dist + "</span></span></div></div></li>";
                        }else{
                            tmpStr = "<li itemId=" + val.itemId + "><img src=\"../../images/default_img.png\" data-original=" + val.itemLogo.thumb + " alt=\"臭美项目\" class=\"il-img lazy\" /><div class=\"il-info\"><h1 class=\"il-name\">" + val.itemName + "</h1><div class=\"il-shop\"><span class=\"il-shopName\">" + val.salonName + "</span></div><div class=\"bottomCon\"><span class=\"il-shopPos\"><span class=\"il-spName\">" + val.area + "</span><span class=\"il-spDis\">" + val.dist + "</span></span></div><div class=\"il-price\"><span class=\"il-pCM\">臭美价<span class=\"unit\">￥</span><span class=\"price\">"+val.price+"</span></span><br><span class=\"il-pOri\">原价<span class=\"price\">"+ val.priceOri +"</span></span></div></li>";
                        }
                        htmlStr.push(tmpStr);
                    });
                    list.append(htmlStr.join(""));
                    page.data.requestData.pageNum ++ ;
                }
                list.off("click").on("click", "li", function () {
                    location = "../home/itemDetail.html?itemId=" + $(this).attr("itemId");
                });
                $("img.lazy").removeClass("lazy").lazyload({effect: "fadeIn"});
            },//end updateItemList
            initQuickCutBanner: function () {
                var $banner = $("#il-banner");
                var banner = "../../images/home/kuaijian_banner_bg@2x.png";
                $banner.append("<img src=\"../../images/home/kuaijian_banner_bg@2x.png\" alt=\"banner\" data-original=" + banner + " />");
                $banner.show();
                $banner.find("img").lazyload({effect: "fadeIn"});
            }
        },//end view
        action: {
            init: function () {
                $(document).on("scroll", scrollItemList);
                function scrollItemList() {
                    if ( !page.loadTag.end ) {
                        if ($("#itemList:hidden").length == 1) return;
                        var doc = $(document);
                        var winH = $(window).height();
                        if (doc.scrollTop() + winH >= doc.height()) {
                            page.action.loadList();
                        }
                    }
                };
            },
            /*@type reset empty the html
             *@itemType 1:normal 2:sepcila price  
             */
            loadList: function (reset) {
                if (reset) {
                    page.data.requestData.pageNum = 1;
                }
                commonUtils.request({
                    url: apiConfig.newApi+"salon/item-list.html",
                    data: page.data.requestData,
                    successCallback: function(data){
                        if(data.code == 0){
                            page.data.listData = data.response;
                            page.view.updateItemList(reset);
                        }
                    }
                });
            }
        }
    };//end page

    return {
        init: mapUtil.init
    }

})