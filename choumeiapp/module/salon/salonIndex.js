/**
 *
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-04-10 13:42:21
 * @version $Id$
 */
define(["jquery", "commonUtils",'jquery.lazyLoad','swiper'],
    function($, commonUtils,lazyload,sp) {
        //swiper
        $(".swiper-container:not('.full'),.si-teamIntroWrap").height(137 / 345 * $("body").width());

        var salonIndex = {

            salonId:commonUtils.getQueryString("salonId"),
            init: function() {
				commonUtils.addBack();
				commonUtils.addMenu();
                salonIndex.data.load(function(data){
                    salonIndex.action.init(data);
                    salonIndex.view.init(data);
                });
				$("#back").on("click", function(e){
                window.location = "salonList.html";
				});
                $("img.lazy").removeClass("lazy").lazyload({
                    effect: "fadeIn"
                });
            }, //end init
            data: {
                data: null,
                load: function(callback) {
                    var user=window.sessionStorage.getItem("user") || window.localStorage.getItem("user"),
                        salonId = commonUtils.getQueryString("salonId"),
                        lati = window.localStorage.getItem("lati")||geoLoc.lati,
                        lng = window.localStorage.getItem("lng")||geoLoc.lng;
                    commonUtils.request({
                        url: apiConfig.newApi+"salon/salon-detail.html",
                        data: {
                            // id: commonUtils.getQueryString("salonId"),
                            userId:user?JSON.parse(user).userId:'',
                            salonId:salonId,
                            lati: lati,
                            lng:lng

                        },successCallback:function(data){
                            if(data.code==0){
                                callback(data);
                            }else{
                                commonUtils.showTip(data.message);
                            }
                        }});
                }
            }, //end data
            view: {
                init: function(data) {
                    if(data.code==0){
                        $("#si-salonName").text(data.response.salon.name);
                        $("#sl-stars").text(data.response.salon.stars);
                        data.response.salon.collected == 1 ? $("#collect").addClass("full") : "";
                        $("#si-addr").text(data.response.salon.addr);
                        $("#salon-phone").attr("href", "tel:" + data.response.salon.tel);
                        if(data.response.salon.branchNum > 0){
                            $("#si-branchNum").text(data.response.salon.branchNum);
                            $("#si-viewBranch").show();
                        }
                        if(data.response.salon.commentNum > 0){
                            $("#si-satifactionWrap").show();
                            $("#si-commentNum").text(data.response.salon.commentNum);
                            $("#si-satisfaction").text(data.response.salon.satisfaction);
                            $("#si-s-perfect").text(data.response.salon.verySatisfy);
                            $("#si-s-good").text(data.response.salon.satisfy);
                            $('#si-s-bad').text(data.response.salon.unsatisfy);
                        }
                        this.swiper.init(data);
                        this.collect(data);
                        this.itemList.init(data);
                    }
                    else{
                        //在收藏里面删除店铺时，进入该店铺的提示
                        commonUtils.showTip(data.message);
                    }
                },
                collect:function(){
                    var isCollect='';
                    $("#collect").click(function() {
                        var user = commonUtils.checkLogin();
                        var userId = user.userId;
                        var data = commonUtils.ajaxRequest({
                            data: {
                                type: "User",
                                to: "collectSalon",
                                body: {
                                    salonId: commonUtils.getQueryString("salonId"),
                                    userId:userId
                                }
                            },successCallback:function(data){
                                var returnData = data.data.main;
                                var info = returnData.info;
                                isCollect = returnData.isCollect;
                                if(isCollect==1){
                                    $('#collect').removeClass('full').addClass('cancel-scale');
                                }
                                else{
                                    $('#collect').removeClass('cancel-scale').addClass('do-scale full');
                                }
                                commonUtils.showTip(info);

                            },url:apiConfig.userApi});
                    });
                },//end collect
                swiper: {
                    data: null,
                    init: function(data) {
                        this.data = data.response.salon.img;
                        if(data.length==0){
                            data.push({
                                img:"../../images/default_salon.png",
                                thumbimg:"../../images/default_salon.png"
                            })
                        }
                        this.smallSwiper.init(data);
                    }, //end init
                    smallSwiper: {
                        init: function(data) {
                            var tmpStr = [],salonIndexSwiperData =data.response.salon.img,salonIndexSwiperLength = salonIndexSwiperData.length;
                            $.each(salonIndexSwiperData, function(key, val) {
                                tmpStr.push("<div class=\"swiper-slide\"><img data-src=\"");
                                tmpStr.push(val.thumbimg);
                                //tmpStr.push("<span class=\"si-star\"><span class=\"sl-stars\" id=\"sl-stars\">"+val.stars+"</span></span>");
                                tmpStr.push("\" index = \"" + key);
                                tmpStr.push("\" class=\"swiper-lazy\" onerror=\"src='../../images/default_salon.png'\" /></div>");
                            })
                            $("#smallSwiper").html(tmpStr.join(""));
                            var swiper=null;
                            if(salonIndexSwiperLength>1){
                                swiper = new Swiper('.swiper-container.small', {
                                    autoplay: "2000",
                                    speed: 700,
                                    pagination: '.swiper-container.small .swiper-pagination',
                                    paginationClickable: true,
                                    // Disable preloading of all images
                                    preloadImages: false,
                                    // Enable lazy loading
                                    lazyLoading: true,
                                    lazyLoadingInPrevNext:true,
                                    loop:false,
                                    autoplayDisableOnInteraction:false
                                });
                            }
                            else{
                                swiper = new Swiper('.swiper-container.small', {
                                    paginationClickable: true,
                                    preloadImages: false,
                                    lazyLoading: true,
                                    lazyLoadingInPrevNext:true,
                                    loop:false,
                                    autoplayDisableOnInteraction:false
                                });
                            }


                            $("#smallSwiper").one("click",".swiper-slide",function(){
                                $("#fullSwiper").parent().show();
                                salonIndex.view.swiper.fullSwiper.init(swiper.activeIndex);
                            });
                            $("#smallSwiper").on("click",".swiper-slide",function(){
                                $("#fullSwiper").parent().show();
                                var fullSwiper = salonIndex.view.swiper.fullSwiper.swiper;
                                //fullSwiper.slideTo(swiper.activeIndex)
                            });
                        }//end init
                    }, //end smallSwiper
                    fullSwiper: {
                        swiper:null,
                        init: function(initialSlide) {
                            var tmpStr = [],fullSwiper = $("#fullSwiper");
                            $.each(salonIndex.view.swiper.data, function(key, val) {
                                tmpStr.push("<div class=\"swiper-slide\"><img data-src=\"");
                                tmpStr.push(val.img);
                                tmpStr.push("\" index = \"" + key);
                                tmpStr.push("\" class=\"swiper-lazy\" onerror=\"this.src='./../images/default_salon.png'\" /></div>");
                            });
                            fullSwiper.html(tmpStr.join(""));
                            this.swiper = new Swiper('.swiper-container.full', {
                                autoplay: false,
                                pagination: '.swiper-container.full .swiper-pagination',
                                paginationClickable: true,
                                // Disable preloading of all images
                                preloadImages: false,
                                // Enable lazy loading
                                lazyLoading: true,
                                lazyLoadingInPrevNext:true,
                                loop:true
                                //initialSlide:initialSlide
                            });

                            fullSwiper.on("click",function(){
                                fullSwiper.parent().hide();
                            });

                        } //end init
                    } //end full swiper
                }, //end swiper
                itemList: {
                    init: function(data) {
                        var items = data.response.item;
                        var len = items.length;
                        var catalog = [];
                        var itemList = [];
                        //console.dir(items);
                        $.each(items, function(key, val) {
                            var showType = val.itemShowType;//1 普通 2 限时特价 3男士快剪
                            var type = val.type;
                            var list = val.list;
                            if(list.length==0){
                                return;
                            }
                            else if(showType == 2){
                                catalog.push("<li class=\"red-color special\">" + type + "</li>");
                            }else{
                                catalog.push("<li>" + type + "</li>");
                            }
                            itemList.push("<dl><dt>" + type + "(" + list.length + ")" + "</dt>");
                            $.each(list, function(key, val) {
                                var minPrice = val.price,priceOri = val.priceOri;
                                itemList.push("<dd itemId = \"" + val.itemId + "\" showType=\""+showType+"\"><h1 class=\"name text-overflow\">" + val.name + "</h1>");
                                itemList.push("<div class=\"price\"><div class=\"cmPrice\"><span class=\"label\">臭美价：</span><span class=\"text red-color\">￥");
                                itemList.push(minPrice+"</span></div>");
                                itemList.push("<div class=\"oriPrice\"><span class=\"label\">原&nbsp;&nbsp;价：</span><span class=\"text\">￥"+priceOri+"</span></div>");
                                if(showType == 1){
                                    //itemList.push("<div class=\"oriPrice\"><span class=\"label\">原&nbsp;&nbsp;价：</span><span class=\"text\">￥"+priceOri+"</span></div>");
                                    itemList.push("<div class=\"price\"><div class=\"cmPrice\"><span class=\"label\">原&nbsp;&nbsp;价：</span><span class=\"text red-color\">￥");
                                    itemList.push(priceOri+"</span></div>");
                                }
                                itemList.push("</div></dd>");
                            })
                            itemList.push("</dl>");
                        })
                        $("#si-itemCatalog").html(catalog.join(""));
                        $("#si-itemList").append(itemList.join(""));
                        var doc = $(document);
                        var titleArr = $("#si-itemList dt"),titleArrPos =[],itemIndex = -1,itemIndexLen = titleArr.length,
                            navArr = $("#si-itemCatalog li"),label = $("#si-itemLabel");

                        navArr.eq(0).addClass('active');
                        $.each(titleArr,function(key,val){
                            val = $(val);
                            titleArr[key]=val;
                            if(key==0){
                                titleArrPos.push(val.position().top-33);
                            }else{
                                titleArrPos.push(val.position().top-66);
                            }
//                     console.dir(val.position().top)
                        });
//                    console.dir(titleArrPos)
                        $("#si-itemCatalog").on("click","li",function(){
                            $(this).addClass("active").siblings().removeClass('active');
                            var index = $(this).index("#si-itemCatalog li");
                            if(index==0){
                                $("body").animate({scrollTop:titleArrPos[index]});
                            }else{
                                $("body").animate({scrollTop:titleArrPos[index]+33});
                            }
                        });
                        salonIndex.action.initViewItemDetail();
                        var itemContentTop=$("#si-itemCotent").position().top;
                        var itemCatalog=$("#si-itemCatalog");
                        var navHeight=$('.header').height();
                        //处理IPhone微信下长按滑动不触发scroll事件
                        if(commonUtils.isOpenInWechat&&navigator.userAgent.indexOf('iPhone')>-1){
                            doc.on('touchmove',function(){
                                doc.trigger('scroll');
                            })
                        }
                        doc.on("scroll",function(){
                            if(doc.scrollTop()>itemContentTop-navHeight){
                                itemCatalog.addClass('fixed');
                                label.addClass('fixed');
                            }else{
                                itemCatalog.removeClass('fixed');
                                label.removeClass('fixed');
                                itemIndex = -1;
                            }
                            //console.dir(doc.scrollTop()+","+titleArr[0].position().top);
                            var tmpIndex = -1;
                            for(tmpIndex;titleArrPos[tmpIndex+1]<doc.scrollTop()&&tmpIndex<itemIndexLen;tmpIndex++){
                            };//get the right itemIndex

                            //console.dir(tmpIndex)

                            if(tmpIndex>itemIndexLen||tmpIndex==itemIndex){
                                if(tmpIndex<0){
                                    label.hide();
                                }
                                return;
                            }else{
                                itemIndex = tmpIndex;
                                label.css("display","block");
                                label.text(titleArr[itemIndex].text());
                            }
                            navArr.eq(itemIndex).addClass("active").siblings().removeClass('active');
                        });
                    }
                } //end itemList
            }, //end view
            action: {
                init:function(data){
                    this.initJumpBaiDu(data);
                    this.initJoinComment(data);
                    this.initViewTeam(data);
                    this.initViewBranch();
                },
                initJumpBaiDu:function(data){
                    //var data = salonIndex.data.response;
                    $("#jonBaiDu").on("click",function(){
                        var toAddrlati = data.response.salon.lati;
                        var toAddrlong = data.response.salon.lng;
                        window.location = "http://api.map.baidu.com/marker?location=" + toAddrlati + "," + toAddrlong + "&title=" + $("#si-salonName").text() + "&content=" + $("#si-addr").text() + "&output=html&src=臭美"
                    });
                },//
                initJoinComment:function(data){
                    $("#si-satifactionWrap").on("click",function(){
                        //location= "../home/viewComment.html?type=1&id="+commonUtils.getQueryString("salonId");
                        location= "../home/viewComment.html?type=1&salonId="+commonUtils.getQueryString("salonId");
                    })
                },
                initViewTeam: function(data) {
                    if(data.code==0){
                        var teamImg = data.response.salon.teamImg;
                        var team = $("#si-teamWrap");
                        if (teamImg&&teamImg!='') {
                            $("#si-teamImg").attr("src",teamImg[0].thumbimg);
                            team.show();
                        }
                    };
                    team.on("click",function(){
                        location = "team.html?salonId="+salonIndex.salonId;
                    });
                },//end team
                initViewBranch:function(){
                    $("#si-viewBranch").on("click",function(){
                        location = "branch.html?salonId="+salonIndex.salonId;
                    });
                },
                initViewItemDetail:function(){
                    $("#si-itemList dd").on("click",function(){
                        var showType = $(this).attr("showType");
                        if(showType==2){
                            location= "../home/limitedTimeItemDetail.html?itemId="+$(this).attr("itemId");
                        }else{
                            location = "../home/itemDetail.html?itemId="+$(this).attr("itemId");
                        }
                    });
                }
            } //end action
        }; //end salonIndex
        return {
            init:salonIndex.init
        }
    });