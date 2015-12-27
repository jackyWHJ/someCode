/**
 *
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-04-22 14:19:46
 * @version $Id$
 */

define(["jquery", "commonUtils",'swiper'],
    function($, commonUtils,sp) {
        var userId,
            stylistId,
            likeNum,
            salonImgs,
            worksPage = {
                pageNum: 0,
                pageSize: 5
            },
            win = $(window),
            winH = win.height(),
            doc = $(document),
            addrLati = window.localStorage.getItem("addrLati")||geoLoc.addrLati,
            addrLong = window.localStorage.getItem("addrLong")||geoLoc.addrLong;

        var initPage = function(){
            userId = (JSON.parse(window.sessionStorage.getItem('user') || window.localStorage.getItem('user')) || {}).userId;
            stylistId = commonUtils.getQueryString("stylistId");
            getStylistData();
            getWorksData();
            addPageListener();
        }
        var getStylistData = function(){
            commonUtils.request({
                data:{
                    lati:addrLati,
                    long:addrLong,
                    stylistId:stylistId
                },
                url:apiConfig.newApi+"/stylist/homepage.html",
                successCallback:getStylistDataCallback
            })
        }
        var getStylistDataCallback = function(data){
            if(data.code == 0){
                data = data.response;
                stylistInfoRender(data.stylist);
                salonRender(data.salon);

            }else{
                commonUtils.alert(data.message);
            }
        }
        /**
         * 页面点击监听，评论
         * */
        var addPageListener = function(){
            $("#viewComment").on("click",function(){
                window.location = "../home/viewComment.html?stylistId="+stylistId;
            });

        };

        // 发型师基础数据的渲染
        var stylistInfoRender = function(data) {
            $('#stylist-name').text(data.name);
            $('#stylist-signature').text(data.signature);
            $('#stylist-rank').text(data.job);
            $('#stylist-follower').text(data.likenum);
            $('#stylist-desc').text(data.desc);
            $('#stylist-satisfaction').text(data.satisfaction);
            $('#stylist-appointedNum').text(data.appointedNum);
            $('#avatar').attr('src', data.img);
            likeNum = parseInt(data.likenum);
            initFollow(data.collected);
        };
        var salonRender = function(data){
            $('#salon-name').text(data.name);
            $('#salon-area').text(data.area);
            $('#salon-dist').text(data.dist);
            $('#salon-addr').text(data.addr);
            salonImgs = data.imgs;
            $("#salon-gallery").on("click",function(){
                gallerySwiperRender(salonImgs,0);
            })
            $("#jonBaiDu").on("click",function(){
                var toAddrlati = data.lati;
                var toAddrlong = data.lng;
                window.location = "http://api.map.baidu.com/marker?location=" + toAddrlati + "," + toAddrlong + "&title=" + data.name + "&content=" + data.area + "&output=html&src=臭美";
            });
        };

        //初始化是否喜欢状态 并绑定follow 事件
        var $follow = $("#stylist-follow");
        var initFollow = function(isCollect) {

            isCollect = Number(isCollect);
            if (isCollect === 1) {
                $follow.addClass('actived');
            }
            // 为follow绑定事件
            $follow.on('click', function() {
                requestFollow(changeFollowStatus);
            });
        };

        // 根据返回的数据 重新渲染follow界面状态和数据 并弹出提示
        var changeFollowStatus = function(data) {
            var mainData = data.data.main,
                isCollect = Number(mainData.isCollect),
                info = mainData.info;

            if (isCollect === 1) {
                likeNum = likeNum - 1;
                $follow.removeClass('actived').addClass('cancel-scale');
            } else {
                likeNum = likeNum + 1;
                $follow.removeClass('cancel-scale').addClass('do-scale actived');
            }
            $('#stylist-follower').text(likeNum);
            commonUtils.showTip(info);
        };

        // 请求是否已经follow
        var requestFollow = function(callback) {
            commonUtils.checkLogin();
            var params = {
                data: {
                    type: 'Stylist',
                    to: 'appraisal',
                    body: {
                        userId: userId,
                        stylistId: stylistId
                    }
                },
                url: apiConfig.shopApi,
                successCallback: callback
            };
            commonUtils.ajaxRequest(params);
        };



        //作品集相关
        var getWorksData = function(){
            commonUtils.request({
                data:{
                    pageSize:worksPage.pageSize,
                    pageNum:++worksPage.pageNum,
                    stylistId:stylistId
                },
                url:apiConfig.newApi+"stylist/works.html",
                successCallback:function(data){
                    if(data.code == 0){
                        updateWorksList(data);
                    }
                    else{
                        commonUtils.showTip(data.message);
                    }
                }
            })
        };

        // 绑定拉到界面底部加载作品集的事件
        // @parma data array
        var scrollItemList = function() {
            if (doc.scrollTop() + winH >= doc.height()) {
                getWorksData();
            }
        };


        // 根据更新 加载渲染作品集
        var updateWorksList = function(data) {
            var tmpStr = [];
            var works = data.response;
            if (works.length === 0) {
                doc.off('scroll', scrollItemList);
                return;
            }
            $.each(works, function(key, val) {
                tmpStr.push("<div class='cell-gallery' id="+val.workId+">");
                tmpStr.push("<p class='contents'>"+val.desc+"</p>");
                tmpStr.push("<div class='gallery'>");
                if(val.images.length > 1){
                    $.each(val.images,function(key,val){
                        tmpStr.push("<div class='photo fl stylist-img' style=\"background: url(" + val.thumb.url + ") no-repeat center;background-size: cover;\" bigImgSrc= "+val.image.url+"></div>");
                    });
                }
                else{
                    tmpStr.push("<div class='photo-large fl stylist-img' bigImgSrc= "+val.images[0].url+" ><img src='../../images/default_img.png'  data-original=" + val.images[0].url + " bigImgSrc= "+val.images[0].url+"  class='item lazy' alt='造型师作品' /></div>");
                }
                tmpStr.push("<div class='clean'</div></div><p class='date light-grey'>"+val.time+"</p></div></div></div>");
                tmpStr.push("<div class='light-line'></div>");
                $('#stylist-works').append(tmpStr.join(''));
            });
            var imgH = $(".photo").width();
            $(".photo").css("height",imgH);
            var imgLargeW = $('photo-large').width();
            $('photo-large').height(imgLargeW);
            if(worksPage.pageNum == 1){
                doc.on('scroll', scrollItemList);
                if(works.length > 0){
                    $("#noWorks").hide();
                }
            }
            bindGallerySwiperEvent();
        };


        var bindGallerySwiperEvent = function() {
            $('.gallery').off('click').on('click', '.stylist-img',function() {
                var images = $(this).parent('.gallery').find('.stylist-img');
                var data = [];
                for (var i = 0, len = images.length; i < len; i++) {
                    var tmp = {
                        img: $(images[i]).attr("bigImgSrc")
                    }
                    data.push(tmp);
                };
                var index = $(this).index();
                gallerySwiperRender(data, index);
            });
        };
//        bindGallerySwiperEvent();

        // 渲染大图浏览
        var gallerySwiperRender = function(data, index) {
            var tmpStr = [],
                newSwiper;
            newSwiper = commonUtils.showSwipeBox(data, {
                initialSlide: index
            });
        };
        return {
            init:initPage
        }
    });
