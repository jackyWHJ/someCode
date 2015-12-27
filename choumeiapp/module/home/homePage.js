define(["jquery", "commonUtils", 'swiper', "jquery.lazyLoad" ],
    function( $, commonUtils, Swiper, ll ){
        var $swiperWrapper =$('#swiperWrapper'),$circle = $("#circle");
        var init = function(){
            areaSelect();
            mapUtil.setPosition();
            getPageData();
            addPageListener();
        };
        /**
         * 获取页面数据，有3个接口
         * */
        var getPageData = function(){
            getBannerList();
            getSMPdata();
            getFFAdata();
        };

        var mapUtil = {
            addr: {
                addrLati: window.localStorage.getItem("addrLati") || geoLoc.addrLati,
                addrLong: window.localStorage.getItem("addrLong") || geoLoc.addrLong
            },
            addrCom: null,
            setPosition: function () {
                if (window.navigator.geolocation) {
                    commonUtils.showLoading();
                    window.navigator.geolocation.getCurrentPosition(function (position) {
                        // 获取到当前位置经纬度  本例中是chrome浏览器取到的是google地图中的经纬度
                        var addrLong = position.coords.longitude,
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
                                setCity(mapUtil.addrCom);
                            });
                            commonUtils.hideLoading();
                        });
                    }, function (err) {
                        commonUtils.alert("我们为您准备了更好的推荐服务，请允许微信访问地理位置信息\n您可以在“设置”中允许微信访问位置信息。");
                        setCity({city:"深圳"});
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


        // 设置当前城市
        var setCity =function(addComp){
            var city = addComp.city;
//            var location = addComp.district;
            $('#abCurrentCity').find('span').text(city);
            $('#homeCity').text(city);
            if(city != window.localStorage.getItem('city')){
                window.localStorage.setItem('city',city);
            }
        };


        var areaSelect = function(){
            $("#sl-h-pos").on("click",function(){
                var self = $(this);
                self.toggleClass('active');
                $circle.toggle();
            });
        };

        //图片高度重置
        var imgResize = function(obj){
            var imgdiv = obj.imgdiv;
            var imgwidth=obj.imgwidth;
            var biliw = obj.biliw;
            var bilih = obj.bilih;
            var imgheight = bilih*imgwidth/biliw;
            obj.imgdiv.height(imgheight);
        };

        var addPageListener = function(){
            $("#itemList,#salonList").find('li').on("click",function(){
                var url = $(this).attr("data-url");
                window.location = url;
            })
        };

        //获取首页banner界面列表
        var getBannerList = function(){
            commonUtils.request({
                url: apiConfig.newApi+"promotion/banners.html",
                data: {},
                successCallback: function(data){
                    if(data.code == 0){
                        renderBannerList(data.response)
                    }
                    else{
                        commonUtils.showTip(data.message);
                    }
                }
            });
        },
        //渲染banner活动界面详情列表
        renderBannerList = function(data){
            if(!data){
                return;
            }
            var bannerImgArr = [],
                posters=data.posters,
                FFABanner=data.FFABanner,
                SPMBanner=data.SPMBanner,
                expertBanner=data.expertBanner;
            //处理顶部banner
            $swiperWrapper.html('');
            for(var i = 0,len = posters.length;i < len;i++){
                bannerImgArr.push('<div class="swiper-slide" bannerId="'+posters[i].bannerId+'" eventType="'+posters[i].eventType+'" url=\''+posters[i].url+'\' style="background:url('+posters[i].img+') no-repeat center center;background-size: cover;"></div>')
            }
            $(bannerImgArr.join('')).appendTo($swiperWrapper);
            imgResize({
                imgdiv:$('#activityBanner'),
                imgwidth:$(window).width(),
                biliw:375,
                bilih:200
            });
            var swiper = new Swiper('#activityBanner', {
                autoplay: "4000",
                speed: 1000,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                preloadImages: true,
                lazyLoading: true,
                lazyLoadingInPrevNext:true,
                loop:true
            });

            //处理半永久
            $("#SPMImg").attr("src",SPMBanner.img).attr("eventType",SPMBanner.eventType).attr("url",SPMBanner.url).on("click",function(){
                window.location = "../makeup/semipermanent.html";
            });
            $("#expertImg").attr("src",expertBanner.img).attr("eventType",expertBanner.eventType).attr("url",expertBanner.url).on("click",function(){
                window.location = "../makeup/expert.html";
            });;
            //处理快时尚
            $("#FFAImg").attr("src",FFABanner.img).attr("eventType",FFABanner.eventType).attr("url",FFABanner.url).on("click",function(){
                window.location = "../fashion/index.html";
            });;

            //添加图片点击监听
            addBannerListener();
        },
        //添加跳到banner详情页面的监听
        addBannerListener = function(){
            var bannerUrl='',eventType='';
            $swiperWrapper.find('.swiper-slide').on('click',imgClickAction);
//            $(".smp-img").on('click',imgClickAction);
            function imgClickAction(e){
                bannerUrl = $(this).attr('url');
                /*FFA 快时尚项目详情页 itemId 项目的id
                 SPM 半永久项目详情页  itemId 项目的id
                 salon 店铺主页 salonId 店铺的id
                 artificers 专家列表*/
                eventType = $(this).attr('eventType');
                /*跳转类型
                 0 无动作
                 1 URL
                 2 应用内跳转*/
                if(eventType==1){
                    window.location = bannerUrl;
                }
                else if(eventType==2){
                    bannerUrl =JSON.parse(bannerUrl);
                    var url='';
                    switch(bannerUrl.type){
                        case 'FFA': url = "../fashion/listItem.html?itemId="+bannerUrl.itemId;
                            break;
                        case 'SPM': url = "../makeup/listItem.html?itemId="+bannerUrl.itemId;
                            break;
                        case 'salon': url = "../salon/salonIndex.html?salonId="+bannerUrl.salonId;
                            break;
                        case 'artificers': url = "../makeup/expert.html";
                            break;
                        default:
                            commonUtils.showTip("事件类型有错！");break;
                    }
                    window.location = url;
                }
            };
        };

        var getSMPdata = function(){
            commonUtils.request({
                url: apiConfig.newApi+"semipermanent/items.html",
                data: {},
                successCallback: function(data){
                    if(data.code == 0){
                        renderSMP(data.response)
                    }
                    else{
                        commonUtils.showTip(data.message);
                    }
                }
            });
        },
            getFFAdata = function(){
                commonUtils.request({
                    url: apiConfig.newApi+"fast-fasion/index.html",
                    data: {},
                    successCallback: function(data){
                        if(data.code == 0){
                            renderFFA(data.response)
                        }
                        else{
                            commonUtils.showTip(data.message);
                        }
                    }
                });
            },
            renderSMP = function(data){
                if(!data){
                    return;
                }
                var $smpItemList = $("#smpItemList"),$smpItemLi = $smpItemList.find('li'),
                    $smpItemDetail = $('.smp-item-detail'),
                    popArtificer = data.popArtificer;
                //处理顶部banner
                $smpItemList.hide();
                for(var i = 0,len = popArtificer.length;i < len;i++){
                    $smpItemLi.eq(i).html('<img src="' + popArtificer[i].icon + '">');
                    $smpItemDetail.eq(i).find(".smp-item-title").text(popArtificer[i].name).attr("itemId",popArtificer[i].itemId);
                    $smpItemDetail.eq(i).find(".smp-item-desc").text(popArtificer[i].desc);
                }
                $smpItemList.show();
                $smpItemLi.on("click",function(){
                    $smpItemLi.removeClass("active");
                    var num = $(this).addClass("active").attr("data-num");
                    $smpItemDetail.hide().eq(num).show();
                });
                $(".smp-item-title").on("click",function(){
                    window.location = "../makeup/listItem.html?itemId="+$(this).attr("itemId");
                });
            },
            renderFFA = function(data){
                if(!data){
                    return;
                }
                var itemArr = [],$FFAList=$("#FFAList"),colorArr = ["#fb5d8a","#31e0c9","#fba057","#fb5d8a","#31e0c9","#fba057"];
                //处理顶部banner
                $FFAList.html('');
                for(var i = 0,len = data.items.length;i < len;i++){
                    if(!data.items[i].icon){
                        data.items[i].icon = "../../images/default_store_img.png";
                    }
                    itemArr.push('<div class="fast-item-title" itemId="'+data.items[i].itemId+'" style="background: url('+data.items[i].icon+') no-repeat 4.5% center;background-size: 50px 50px;"><p class="text-overflow" style="color: '+colorArr[i]+'">'+data.items[i].name+'</p><p class="text-overflow" >'+data.items[i].desc+'</p></div>')
                }
                $FFAList.html(itemArr.join(''));
                $(".fast-item-title").on("click",function(){
                    window.location = "../fashion/listItem.html?itemId="+$(this).attr("itemId");
                });
            };

        return{
            'init':init
        }
    });


