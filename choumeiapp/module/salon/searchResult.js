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
                this.loadTag = {
                    end: false,
                    firstTime: true
                };
                this.view.resetImgH();
                this.action.salonListInit();
                commonUtils.goTop();
				commonUtils.addBack();
            },
            loadTag: {
                end: false,
                firstTime: true
            },
            getData: function(callback) {
                //shop list to:favoritesSalon;proList to:favoritesItem
                var data = {
                    "pageNum": ++page.data.page,
                    "pageSize": page.data.pageSize,
                    "district": page.data.district,
                    "zone":page.data.zone,
                    "long": mapUtil.addr.addrLong,
                    "lati": mapUtil.addr.addrLati,
                    "keyword": page.data.keyword
                };
                commonUtils.request({
                    url: apiConfig.newApi+"salon/nearby.html",
                    data: data,
                    successCallback: function(data){
                        if(data.code == 0){
                            callback(data);
                        }
                        else{
                            commonUtils.showTip(data.message);
                        }
                    }
                });
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
                    console.dir(data);
                    var listData = data.response.salons;
                    if (listData.length == 0) {
                        salonList.loadTag.end = true;				
                        if (salonList.loadTag.firstTime) {
                            $('#noResearchResult').show();
                            $('#salonList').hide();
                            //commonUtils.alert("哎呦，淘不到要求的宝贝哦<br />换下条件试试?");//no item
                        }
                      return -1;
                    } else {
                        salonList.loadTag.firstTime = false;
						  $('#noResearchResult').hide();
                            $('#salonList').show();
                    }
                    var htmlStr = [];
                    //shop
                    console.dir(listData);
                    //首页清空页面节点
                    if (page.data.page == 1) {
                        $("#salonList").empty();
                    }
                    $.each(listData, function(key, val) {
                        var tmpStr = "<li salonId=" + val.salonId + "><div class=\"sl-imgWrap\"><img  class=\"sl-img lazy\" src=\"../../images/default_salon.png\" data-original=\"" + val.img + "\" alt=\"臭美店铺\" /></div>" + "<div class=\"sl-desc\"><div class=\"clearfix\"><h1 class=\"sl-name text-overflow\">" + val.name + "</h1><span class=\"si-star\"><span class=\"sl-xing\"></span><span class=\"sl-stars\">"+val.stars+"</span></span><span class=\"sl-d-info\"><span class=\"sl-addr\">" + val.areaName + "</span><span class=\"sl-distance\">" + val.dist + "</span></span></div><ul class=\"sl-info\">" + "<li class=\"comment\"><span class=\"tip\">评价数&nbsp;&nbsp;</span><span class=\"num\">" + val.commentNum + "</span></li><li class=\"satisfyNum\"><span class=\"tip\">满意数&nbsp;&nbsp;</span><span class=\"num\">" + val.satisfy + "</span></li><li class=\"csi\"><span class=\"tip\">满意度&nbsp;&nbsp;</span><span class=\"num\">" + val.satisfaction + "</span></li></ul></div></li>";
                        htmlStr.push(tmpStr);
                    });
                    $("#salonList").append(htmlStr.join(""));
                    $("img.lazy").removeClass("lazy").lazyload({
                        effect: "fadeIn"
                    });
                } //end updateSalonList
            }, //end view
            action: {
                salonListInit: function() {
                    $(document).on("scroll", scrollSalonList);
                    function scrollSalonList() {
                        if ($("#salonList:hidden").length == 1) return;
                        var doc = $(document);
                        var winH = $(window).height();
                        if (doc.scrollTop() + winH >= doc.height()) {
                            salonList.getData(salonList.view.updateSalonList);
                        }
                        if (salonList.loadTag.end == true) {
                            doc.off("scroll", scrollSalonList);
                        }
                    }
                    var $salonList = $("#salonList");
                    $salonList.on("click", "li", function() {
                        window.location = "salonIndex.html?salonId=" + $(this).attr("salonId");
                    });
                    $salonList.empty();
                } //end salonList
            } //end action
        }
        // end salon list
        var $circle = $("#circle"),
            $district = $("#district"),
            $zone = $("#zone");
        var page = {
            data: {
                page:0,
                pageSize: 20,
                district: 0,
                zone:0,
                districtList: null,
                keyword: commonUtils.getQueryString("keyword")
            }, //end data
            init:function(){
                this.initHeader();
                this.initDistrictList();
				salonList.init();
            },
            initHeader: function() {
                //searchResultPage.data.keyword ==""?"":$("#header").html(searchResultPage.data.keyword);
                if (page.data.keyword) {
                    $("#h-itemName").text(page.data.keyword);
                    $("#sl-h-pos").on("click",function(){
                        var self = $(this);
                        self.toggleClass('active');
                        $circle.toggle();
                    });
                }
            },
            initDistrictList: function () {
                commonUtils.request({
                    url: apiConfig.newApi+"location/allArea.html",
                    data: {"type":0},
                    successCallback: function(data){
                        if(data.code == 0){
                            page.data.districtList = data.response;
                            page.setDistrict();
                            salonList.getData(salonList.view.updateSalonList);
                        }
                        else{
                            commonUtils.showTip(data.message);
                        }
                    }
                });
            },

            setDistrict:function (){
                var htmlStr = [];
                $.each(page.data.districtList,function(key,val){
                    htmlStr.push("<li district=\""+val.tId+"\">"+val.tName+"</li>");
                });
                $district.html(htmlStr.join(""));
                //默认取第一个全区
                var districtLi = $district.find('li:first');
                districtLi.addClass("active");
                page.data.district = districtLi.attr("district");
                page.setZoom();
                $district.on("click","li",function(){
                    page.data.district = $(this).attr("district");
                    page.setZoom();
                });
            },
            setZoom:function (){
                $district.find("li[district="+page.data.district+"]").addClass("active").siblings().removeClass('active');;
                var htmlStr = [],areaInfo = [];
                $.each(page.data.districtList,function(key,val){
                    if(page.data.district == val.tId){
                        areaInfo = val.areaInfo;
                    }
                });
                $.each(areaInfo,function(key,val){
                    htmlStr.push("<li zone=\""+val.areaId+"\">"+val.areaName+"</li>");
                });
                page.data.zone = $zone.html(htmlStr.join("")).find("li:first").addClass("active").attr("zone");

                $zone.off("click").on("click","li",function(){
                    var self = $(this);
                    self.addClass('active').siblings().removeClass('active');
                    page.data.zone = self.attr("zone");
                    $("#sl-h-posText").text($district.find("li[district="+page.data.district+"]").text());
                    $("#sl-h-pos").click();
					page.data.page=0;
					salonList.loadTag = {end:false,firstTime:true};					
                    salonList.getData(salonList.view.updateSalonList);
                });
            }
        }; //end searchResultPage
         var mapUtil = {
            addr: {
                addrLati: window.localStorage.getItem("addrLati") || geoLoc.addrLati,
                addrLong: window.localStorage.getItem("addrLong") || geoLoc.addrLong
            }
        };
        return page;
    });
