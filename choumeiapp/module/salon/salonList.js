/**
 *
 * @authors Your Name (you@example.org)
 * @date    2015-04-09 16:25:56
 * @version $Id$
 */

define(["jquery", "commonUtils",'jquery.lazyLoad','swiper'],
    function($, commonUtils,lazyload,sp) {
        var salonList = {
            init: function() {
                this.loadTag = {end:false,firstTime:true};
                this.view.resetImgH();
                this.action.salonListInit();
                commonUtils.goTop();
				commonUtils.addBack();
            },
            loadTag: {end:false,firstTime:true},
            data: {
                type:1,//1 最近，2推荐 3.等级
                keyword:"",//搜索关键字
                "listData": {
                    "page": 0,
                    "pageSize":20,
                    "load": function(callback) {
                        var data ={
                            district:salonListPage.data.circle[0]||0,
                            zone:salonListPage.data.circle[1]||0,
                            long:mapUtil.addr.addrLong,
                            lati:mapUtil.addr.addrLati
                        }
                        var url = apiConfig.newApi;
                        if(salonList.data.type ==1){
							url+='salon/praise.html';	     
                        }else if(salonList.data.type ==2){
							url+='salon/nearby.html';
                            data.keyword = "";
                            data.pageNum = ++this.page;
                            data.pageSize = this.pageSize;	 
						}else  if(salonList.data.type ==3){                          
							url+='salon/star.html';	
							data.pageNum = ++this.page;
                            data.pageSize = this.pageSize;							
                        }
						commonUtils.request({
							data:data,
							successCallback:callback,
							url:url
						});                        
                        console.log(data);
                    }
                }
            }, //end data
            view: {
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
                    //console.dir(data);
                    console.log(data);
                    if(data.code==0){
                        var listData = data.response,salonData = listData.salons;
                        if(salonData.length==0){
                            salonList.loadTag.end = true;
                            if(salonList.loadTag.firstTime){
                                $('#noResearchResult').show();
                                $('#salonList').hide();
                            }
                            return -1;
                        }
                        else{
                            salonList.loadTag.firstTime = false;
                        }

                        var htmlStr = [];
                        $.each(salonData,function(key,val){
                            var tmpStr = "<li salonId=" + val.salonId + "><div class=\"sl-imgWrap\"><img  class=\"sl-img lazy\" src=\"../../images/default_salon.png\" data-original=\"" + val.img + "\" alt=\"臭美店铺\" /></div>" + "<div class=\"sl-desc\"><div class=\"clearfix\"><h1 class=\"sl-name text-overflow\">" + val.name + "</h1><span class=\"si-star\"><span class=\"sl-xing\"></span><span class=\"sl-stars\">"+val.stars+"</span></span><span class=\"sl-d-info\"><span class=\"sl-addr\">"+val.areaName+"</span><span class=\"sl-distance\">"+val.dist+"</span></span></div><ul class=\"sl-info\">" + "<li class=\"comment\"><span class=\"tip\">评价数&nbsp;&nbsp;</span><span class=\"num\">" + val.commentNum + "</span></li><li class=\"satisfyNum\"><span class=\"tip\">满意数&nbsp;&nbsp;</span><span class=\"num\">" +val.satisfy+"</span></li><li class=\"csi\"><span class=\"tip\">满意度&nbsp;&nbsp;</span><span class=\"num\">" + val.satisfaction + "</span></li></ul></div></li>";
                            htmlStr.push(tmpStr);
                        })
                        $("#salonList").append(htmlStr.join(""));
                        $("img.lazy").removeClass("lazy").lazyload({effect:"fadeIn"});
                    }
                }//end updateSalonList
            }, //end view
            action: {
                salonListInit: function() {
                    if(salonList.data.type){
                        $(document).on("scroll", scrollSalonList);
                    }
                    function scrollSalonList() {
                        if ($("#salonList:hidden").length == 1) return;
                        var doc = $(document);
                        var winH = $(window).height();
                        if (doc.scrollTop() + winH >= doc.height()) {
                            if(salonList.data.type){
                                salonList.action.loadList();
                            }
                        }
                        if (salonList.loadTag.end == true) {
                            doc.off("scroll", scrollSalonList);
                        }
                    }
                    var $salonList = $("#salonList");
                    $salonList.on("click", "li", function() {
                        location = "salonIndex.html?salonId=" + $(this).attr("salonId");
                    })
                    $salonList.empty();
                    this.loadList();
                },  //end salonList
                loadList: function(reset) {
                    if(reset){
                        $("#salonList").empty().show();
                        $('#noResearchResult').hide();
                        salonList.loadTag = {end:false,firstTime:true};
                        salonList.data.listData.page = 0;
                    }
                    salonList.data.listData.load(salonList.view.updateSalonList);
                    // salonList.view.updateSalonList(data);
                }
            } //end action
        }
        // end salon list

        var salonListPage = {
            init:function(){
                this.initSalonType();
                salonList.init();
                salonListPage.data.loadCircleList(salonListPage.circle.init);
            },
            data:{
                circle:[],//the current cirlce Info
                circleList:null,//the circleList data
                keyword:window.sessionStorage.getItem("keywords"),
                loadCircleList:function(callback){
                    var data = {
                        type: 0
                    };
                    commonUtils.request({
                        url:apiConfig.newApi+"location/allArea.html",
                        data:data,
                        successCallback:function(data){
                            salonListPage.data.circleList = data.response;
                            callback(data);
                        }
                    });
                }//end loadDistrictList
            },//end data
            initSalonType:function(){
                $("#sl-h-tab li").on("click",function(){
                    $(this).addClass('active').siblings().removeClass('active');
                    salonList.data.type = $(this).index()+1;
                    salonList.action.loadList(true);
                })
                var salonType = commonUtils.getQueryString("salonType");
                if(salonType){
                    salonList.data.type = salonType;
                    $("#sl-h-tab li").eq(salonType-1).addClass("active").siblings().removeClass('active');

                }
            },
            circle:{
                init:function(){
                    var $circle = $("#circle");
                    var $district = $circle.find(".district");
                    var currentDistrict = "";
                    var $zone = $circle.find(".zone");
                    var circleList = null;
                    var selectedCircle = [];
                    var tmpCircle = [];
                    var htmlStr = [];

                    circleList = salonListPage.data.circleList;
                    $("#sl-h-pos").on("click",function(){
                        var self = $(this);
                        self.toggleClass('active');
                        $circle.toggle();
                        $district.find("li[district="+selectedCircle[0]+"]").click();
                    })


                    //console.dir(circleList)

                    $.each(circleList,function(key,val){
                        htmlStr.push("<li district=\""+val.tId+"\">"+val.tName+"</li>");
                    })

                    $district.html(htmlStr.join(""));
                    $district.on("click","li",function(){
                        setDistrict($(this).attr("district"));
                    });
                    $zone.on("click","li",function(){
                        var self = $(this);
                        selectedCircle=[tmpCircle[0],self.attr("zone")];
                        salonListPage.data.circle=selectedCircle;
                        self.addClass('active').siblings().removeClass('active');
                        salonList.action.loadList(true);
                        $("#sl-h-posText").text(currentDistrict);
                        $("#sl-h-pos").click();
                    });
                    function setDistrict(district){
                        var htmlStr = [];
                        $.each(circleList,function(key,val){
                            if(district == val.tId||district==val.tName){
                                $.each(val.areaInfo,function(key,val){
                                    htmlStr.push("<li zone=\""+val.areaId+"\">"+val.areaName+"</li>");
                                })
                                $zone.html(htmlStr.join(""));
                                var selectedZone = $zone.find("li[zone="+selectedCircle[1]+"]");
                                if(selectedZone.length>0){
                                    selectedZone.addClass('active');
                                }else{
                                    $zone.find("li:first").addClass("active");
                                }
                                tmpCircle = [val.tId];
                                currentDistrict = val.tName;
                                $district.find("li[district="+val.tId+"]").addClass('active').siblings().removeClass('active');
                                return false;
                            }
                        })
                    }
                    //默认选附近，第一个
                    setDistrict(0);
                    salonList.action.loadList(true);
                    return;

                }
            }
        }//end salonListPage

        var mapUtil = {
            addr: {
                addrLati: window.localStorage.getItem("addrLati") || geoLoc.addrLati,
                addrLong: window.localStorage.getItem("addrLong") || geoLoc.addrLong
            },
            addrCom: null,
            init: function () {
                this.setPosition();
            },
            setPosition: function () {
                if (window.navigator.geolocation) {
                    commonUtils.showLoading();
                    window.navigator.geolocation.getCurrentPosition(function (position) {
                        // 获取到当前位置经纬度  本例中是chrome浏览器取到的是google地图中的经纬度
                        var addrLong = position.coords.longitude;
                        var addrLati = position.coords.latitude;
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
                                salonListPage.init();
                            });
                            commonUtils.hideLoading();
                        });
                    }, function (err) {
                        commonUtils.alert("我们为您准备了更好的推荐服务，请允许微信访问地理位置信息\n您可以在“设置”中允许微信访问位置信息。");
                        salonListPage.init();

                    }, {
                        enableHighAccuracy: true,
                        timeout: 7000
                    });
                } else {
                    commonUtils.alert("浏览器不支持html5来获取地理位置信息");
                }
            }
        };
        var init = function(){
            mapUtil.init();
        };
        return {
            init:init
        }
    });