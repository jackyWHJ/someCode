/**
 *
 * @authors ted.wei
 * @date    2015-09-15 16:25:56
 * @version rebuild 1.0
 * @desc  沙龙分店页面，获取页面数据
 */
define(["jquery", "commonUtils",'jquery.lazyLoad'],
    function($, commonUtils,lazyload) {
        var addrLati="",addrLong="";
        var doc = $(document),
            win = $(window),
            salonListEle = $("#salonList"),
            pageSize=10,salonId = 0,
            pageNum = 0;
			
        var salonList = {
			
            init: function() {
				//输入监听
				commonUtils.addBack();
				commonUtils.addMenu();
                salonId= commonUtils.getQueryString("salonId");
                addrLati = window.localStorage.getItem("addrLati")||geoLoc.addrLati;
                addrLong = window.localStorage.getItem("addrLong")||geoLoc.addrLong;
				 
                salonList.view.initImgH();
                salonList.action.salonListInit();
				  
            },
            loadTag: {
                end: false
            },
            data: {
                listData: {
                    load: function(callback) {
                        commonUtils.request({
                            url: apiConfig.newApi+"salon/branch.html",
                            data:{
                                "pageNum":++pageNum,
                                "pageSize": pageSize,
                                "salonId": salonId,
                                "lati":addrLati,
                                "long":addrLong
                            },
                            successCallback: function(data){
                                if(data.code==0){
                                    callback(data);
                                }else{
                                    commonUtils.showTip(data.message);
                                }
                            }
                        });
                    }
                }
            }, //end data
            view: {
                // 初始化图片高度 并为window resize 绑定 图片高度重置事件
                initImgH: function() {
                    var imgOriW = 690;
                    var imgOriH = 280;
                    var rate = 0.9 / (imgOriW / imgOriH);

                    function resetImgH() {
                        var imgH = win.width() * rate;
                        imgH = imgH > 280 ? 280 : imgH;
                        $("#imgHResetStyle").remove();
                        $("<style id='imgHResetStyle'> .sl-imgWrap{height:" + imgH + "px } </style>").appendTo($("head"));
                    }
                    resetImgH();
                    win.on("resize", resetImgH);
                },
                // 更新沙龙列表
                // 假如数据第二次获取后，data.data.main.lenght 为零 则取消滚动加载绑定
                updateSalonList: function(data) {
                    if (data.code!=0) {
                        commonUtils.alert(data.message);
                    }
                    var listData = data.response.salons;
                    if (listData.length == 0) {
                        salonList.loadTag.end = true;
                        return;
                    }
                    var htmlStr = [];
                    $.each(listData, function(key, val) {
                        var tmpStr = "<li salonId=" + val.salonId + "><a href='salonIndex.html?salonId=" + val.salonId + "'><div class=\"sl-imgWrap\"><img  class=\"sl-img lazy\" src=\"../../images/default_salon.png\" data-original=\"" + val.img + "\" alt=\"臭美店铺\" /></div>" + "<div class=\"sl-desc\"><div class=\"clearfix\"><h1 class=\"sl-name text-overflow\">" + (val.name).substr(0,7) + "</h1><span class=\"si-star\"><span class=\"sl-xing\" id=\"sl-xing\"></span><span class=\"sl-stars\" id=\"sl-stars\">"+val.stars+"</span></span><span class=\"sl-d-info\"><span class=\"sl-addr\">" + val.areaName + "</span><span class=\"sl-distance\">" + val.dist + "</span></span></div><ul class=\"sl-info\">" + "<li class=\"comment\"><span class=\"tip\">评价数&nbsp;&nbsp;</span><span class=\"num\">" + val.commentNum + "</span></li><li class=\"satisfyNum\"><span class=\"tip\">满意数&nbsp;&nbsp;</span><span class=\"num\">" + val.satisfy + "</span></li><li class=\"csi\"><span class=\"tip\">满意度&nbsp;&nbsp;</span><span class=\"num\">" + val.satisfaction + "</span></li></ul></div></a></li>";
                        htmlStr.push(tmpStr);
                    });
                    salonListEle.append(htmlStr.join(""));
                    $("img.lazy").removeClass("lazy").lazyload({
                        effect: "fadeIn"
                    });
                } //end updateSalonList
            }, //end view
            action: {
                salonListInit: function() {
                    doc.on("scroll", scrollSalonList)
                    this.loadList();
                }, //end salonList
                loadList: function() {
                    salonList.data.listData.load(salonList.view.updateSalonList);
                }
            } //end action
        };
        function scrollSalonList() {
            if ($("#salonList:hidden").length == 1) {
                return;
            }
            var winH = win.height();
            if (doc.scrollTop() + winH >= doc.height()) {
                salonList.action.loadList();
            }
            if (salonList.loadTag.end == true) {
                doc.off("scroll", scrollSalonList);
            }
        }
        // end salon list

        return {
            'init': salonList.init
        }
    });
