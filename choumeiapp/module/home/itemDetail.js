/**
 * Created by zhaoheng(赵恒) on 15-11-24.
 * Copyright (C) 2015 choumei.cn.
 */
define(["jquery", "commonUtils",'utils/module/tongdun', 'swiper', "jquery.lazyLoad" ], function( $, commonUtils, td, Swiper, ll ){

    //var itemDetailPage = (function(){
        var user = {},itemId = "",userId = "",salonId=0,addrLati="",addrLong="",
            itemCount= 1,price= 0,priceDis= 0,salonNormsId = 0,//价格规则
            $itemNum = $('#itemNum'),$joinCartElem =$('#joinCartElem');
        var specItemArr=[],specEnableArr = [],specSelectArr = [],rowObj = {};
        var init = function(){
            //调用页面判断
			commonUtils.addBack();
			commonUtils.addMenu();
            user =  JSON.parse(window.sessionStorage.getItem("user")||window.localStorage.getItem("user"));
            if(user){
                userId = user.userId;
            }
            itemId = commonUtils.getQueryString("itemId");
            addrLati = window.localStorage.getItem("addrLati")||geoLoc.addrLati;
            addrLong = window.localStorage.getItem("addrLong")||geoLoc.addrLong;
            commonUtils.checkGeoLoc();
            if(!itemId){
                commonUtils.alert("项目编号出错，请返回重新选择！");
                return;
            }
            getItemInfo();
            /**购买按钮监听*/
            $("#buyBtn1,#buyBtn2").bind("click",function(){
                if(!userId){
                    //记录登录之前页面
                    window.sessionStorage.setItem("location",window.location);
                    window.location = "../user/userLogin.html";
                    return;
                }
                if(specSelectArr.indexOf("no")>=0){
                    commonUtils.alert("请先选择规格");
                    return;
                }
                if(1 == $(this).attr("showTip") && 1 == $(this).attr("btnNo")){
                    adjustPagePosition();
                    $("#addCartBtn2").hide();
                    $("#buyBtn2").addClass("id-big-btn").css("display","inline-block");
                    $("#popPage").animate({top:0},500);
                    return;
                }
                submitOrder();
            });

            /**
             * 加入购物车点击监听
             * */
            $("#addCartBtn1,#addCartBtn2").bind("click",function(){
                if(!userId){
                    //记录登录之前页面
                    window.sessionStorage.setItem("location",window.location);
                    window.location = "../user/userLogin.html";
                    return;
                }
                if(specSelectArr.indexOf("no")>=0){
                    commonUtils.alert("请先选择规格");
                    return;
                }
                if(1 == $(this).attr("showTip") && 1 == $(this).attr("btnNo")){
                    adjustPagePosition();
                    $("#buyBtn2").hide();
                    $("#addCartBtn2").addClass("id-big-btn").css("display","inline-block");
                    $("#popPage").animate({top:0},500);
                    return;
                }
                addCart();
            });
        };

        /**
         * 获取项目信息
         * */
        var getItemInfo = function(){
            var data = {"userId":userId,
                "itemId":itemId,
                "addrLati":addrLati,
                "addrLong":addrLong
            };
            commonUtils.request({data:data,successCallback:function(data){
                if(data.code==0){
                    renderItemDetail(data.response);
                }
                else{
                    commonUtils.showTip(data.message);
                    console.log("获取商家信息失败！"+data.message);
                }
            },url:apiConfig.newApi+"salon/item-detail.html"});
        };
        /**
         * 渲染项目详情页
         * */
        var renderItemDetail = function(data){
            var item = data.item,salon = data.salon,format = data.format,current={},formatTypes='',norms='';
            //current = data.current,
            // format = data.format,normsStr = data.priceCate,priceList= data.priceList;
            if(format){
                formatTypes = data.format.formatTypes,norms= data.format.norms;
                var minPriceInit = 999999,normsKey = null;
                $.each(norms,function(key,val){
                    if(minPriceInit>val.price){
                        minPriceInit = val.price;
                        normsKey = key;
                    }
                });
                current ={
                    normsId:normsKey,
                    price:norms[normsKey].price,
                    priceOri:norms[normsKey].priceOri
                };
            }

            //是否特价项目处理
            if(item.itemType == 2 ){
                $("#saleBtn").show();
                $("#itemName").css("width","80%");
                var saleArr=[];
                if(item.saleRule.length>0){
                    var saleLen = item.saleRule.length;
                    saleArr.push('<ul class="cart-item-condition clearfix">');
                    for(var i =0; i < saleLen; i ++){
                        saleArr.push('<li>'+item.saleRule[i]+'</li>');
                    }
                    saleArr.push('</ul>');
                    $('#descType').append($(saleArr.join(""))).show();
                    $('#priceRule').addClass('pr-special');
                }
                var useLimit = item.useLimit;
                if(useLimit!=''){
                    $('#cartItemTips').text(useLimit).show();
                }
                $("#priceP").hide();
            }
            if(item.logo){
                //渲染图标
                $("#itemImg,#itemImg2").html('<img src="'+item.logo+'"/>');
            }
            //渲染项目名称
            $("#itemName").text(item.name);
            //微信分享
//        WechatShare({imgUrl:item.logo,shareTitle:item.itemname+"，会员价最低50元哦~不办卡就是会员哦",descContent:"美发不办卡，全城我最牛！没什么说的！就买这个项目了！买买买！"});
            //渲染价目
            if(format){
                //价格区间判断
                if(item.price == item.maxPrice){
                    $("#priceDis").text("￥"+item.price);
                }
                else{
                    $("#priceDis").text("￥"+item.price+"~"+item.maxPrice);
                }
                if(item.priceOri == item.maxPriceOri){
                    $("#price").text("￥"+item.priceOri);
                }else{
                    $("#price").text("￥"+item.priceOri+"~"+item.maxPriceOri);
                }
                price = current.price;
                priceDis = current.priceOri;
                $("#priceDis2").text("臭美价：￥"+price);
                $("#price2").text("原    价：￥"+priceDis);
                // if(priceList[current.salonItemFormatId] && priceList[current.salonItemFormatId].salonNormsId){
                //     salonNormsId = priceList[current.salonItemFormatId].salonNormsId;
                // }
                if(norms[current.normsId] && norms[current.normsId].normsId){
                    salonNormsId = norms[current.normsId].normsId;
                }
                $("#priceRule").show();

            }
            else{
                // $("#priceDis").text("￥"+item.priceOri);
                // $("#price").text("￥"+item.price);
                $("#priceDis").text("￥"+item.price);
                $("#price").text("￥"+item.priceOri);
                price = item.price;
                priceDis = item.priceOri;
            }
            //渲染人数
            if(item.saleNum){
                $("#itemMsg").text(item.saleNum+"人购买");
            }

            //项目是否下架
            var isDown =item.isDown;
            if(isDown==1){
                $('#buyBtn2,#buyBtn1').unbind("click").text('项目已下架').css('background-color','#cbcbcb');
                $("#addCartBtn1,#addCartBtn2").unbind("click").css('background-color','#cbcbcb');
            }
            //服务详情
            $("#serviceDesc").html(commonUtils.transferString(item.desc));
            //项目有效期
            var expTime = item.expTime;
            if(expTime!=''){
                $("#serviceDesc").append('<div class="id-item-time">项目使用有效期至：'+item.expTime+'<span></span></div>');
            }
            salonId = salon.salonId;
            //店铺渲染
            $("#shopBtn").attr("salonId",salon.salonId).on("click",function(){
                window.location = "../salon/salonIndex.html?salonId="+salonId;
            });
            if(salon.logo){$("#shopImg").attr("src",salon.logo);}
            $("#shopName").text(salon.name);
            $("#sl-stars").text(salon.stars);
            if(salon.commentNum){
                $("#evaluateNum").text(salon.commentNum);
            }
            var ICNum =data.item.commentNum
            if(ICNum){
                $("#evaluateNum2").text(ICNum);
            }
            $("#satisfaction").text(salon.satisfaction);
            $("#shopAddr p").text(salon.addr);
            $("#shopDist").html(salon.dist);
//        $("#tel").attr("href","tel:"+salon.tel);
            $("#shopAddr").attr("addrLati",salon.lati);
            $("#shopAddr").attr("addrLong",salon.lng);

            //收藏按钮

            if(item.collected == 1){
                $("#collectIcon").addClass("id-collected-btn");
                $("#collectBtn").attr("type","1");
            }else {
                $("#collectIcon").removeClass("id-collected-btn");
                $("#collectBtn").attr("type","2");
            }

            $("#shopAddr").on("click",function(){
                var toAddrlati = salon.lati;
                var toAddrlong = salon.lng;
                window.location = "http://api.map.baidu.com/marker?location=" + toAddrlati + "," + toAddrlong + "&title=" + salon.name + "&content=" + salon.addr + "&output=html&src=臭美"
            });
            addItemSelectListener();
            //是否有规格选择
            if(format){
                $("#buyBtn1").attr("showTip",1);
                $("#addCartBtn1").attr("showTip",1);
                initSpecPage(formatTypes,current);
                doItemSelect(norms);
                $("#priceRule").show();
            }
            //是否有评论
            if(data.comment){
                renderComment(data.comment,item);
            }
            //用户登录，请求购物车数量
            if(userId){
                getCartNum();
            }
            commonUtils.imgError();


            //increment service
            if(data.addedServices){
                var incrementServiceList = data.addedServices,addedServiceLen = incrementServiceList.length;
            }
            if(addedServiceLen>0){
                var addServiceArr=[];
                for(var i=0;i<addedServiceLen;i++){
                    addServiceArr.push('<li><img class="avatar" src="'+incrementServiceList[i].logo+'">');
                    addServiceArr.push('<div class="isb-text"><p>'+incrementServiceList[i].name+'</p>');
                    addServiceArr.push('<p class="isbt-description">'+incrementServiceList[i].detail+'</p></div></li>');
                }
                $('#incrementServiceList').append($(addServiceArr.join('')));
                $('#incrementServiceBox').show();
                commonUtils.imgError();
            }
            else{
                $('#incrementServiceBox').hide();
            }
        };

        /*start 项目详情 快剪模块*/
        var fullSwiperBox = function(data, option,imgIndex) {
            var htmlStr = [],swiperContaierWrap = $("#quickCut-swiper-containerWrap");
            var data = data;
            //console.dir(data);
            htmlStr.push("<div class=\"swiper-container full\" id=\"quickCut-swiper-container\"><div class=\"swiper-wrapper\">");
            for(var i = 0,len = data.length; i < len; i++){
                var val = data[i][imgIndex];
                htmlStr.push("<div class=\"swiper-slide\"><img  onerror=\"src='../../images/default_img.png'\" src=\""+val+"\" index = \"" + i);
                htmlStr.push("\" class=\"swiper-lazy\" /></div>");
            }
            htmlStr.push("</div><div class=\"swiper-pagination\"></div></div>")

            if(!$("body").find("#quickCut-swiper-containerWrap").html()){
                $("body").append(swiperContaierWrap);
            }
            swiperContaierWrap.html(htmlStr.join(""));
            swiperContaierWrap.show();
            var setting = {
                autoplay: false,
                pagination: '#quickCut-swiper-containerWrap .swiper-pagination',
                paginationClickable: true,
                // Disable preloading of all images
                preloadImages: true,
                // Enable lazy loading
                lazyLoading: false,
                lazyLoadingInPrevNext:true,
                initialSlide:0
            };
            $.extend(setting, option || {})
            var swiper = new Swiper('#quickCut-swiper-container', setting);
            swiperContaierWrap.on("click",function(){
                swiperContaierWrap.hide();
            });
            return swiper;
        };//end swiperbox

        var quickCut = function(data){
            if(data.length==0){
                return;
            }
            var $quickCut =$("#quickCut");
            var container = $("#quickCut").find(".swiper-wrapper");
            var html = [];
            $.each(data,function(key,val){
                html.push("<div class=\"swiper-slide\"><img onerror=\"src='../../images/default_img.png'\" src=\""+val.stylistImg+"\" /></div>");
            });
            container.html(html.join(""));
            $("head").append(style);
            var bigSwiper,swiperWrap = $("#quickCut-swiper-containerWrap");
            var swiper = new Swiper('#quickCutSwiper', {
                pagination: '#quickCut .swiper-pagination',
                slidesPerView: 3,
                paginationClickable: true,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                spaceBetween: '10%',
                lazyLoading:true,
                lazyLoadingInPrevNext:true
                //onclick事件在ios上触发了swiperContaierWrap的on click造成图片闪退
            });
            $("#quickCutSwiper .swiper-slide").on("click",function(){
                if(!bigSwiper){
                    bigSwiper = fullSwiperBox(data,null,"stylistImg");
                }
                bigSwiper.slideTo(swiper.clickedIndex,0);
                swiperWrap.show();
            });
            $quickCut.show();
        };

        /*end 项目详情 快剪模块*/

        /**
         * 初始化规格页面
         * */
        var initSpecPage = function(formatTypes,current){
            var specArr = [],rowArr =[];
            //初始化规格选项
            for(var i = 0,len = formatTypes.length; i < len; i++){
                rowArr =[];
                specArr.push('<div><p>'+formatTypes[i].name+'</p>');
                for(var j = 0,subLen = formatTypes[i].detail.length; j < subLen;j++){
                    specArr.push('<div id="specItem'+formatTypes[i].detail[j]["formatId"]+'" itemId="'+formatTypes[i].detail[j]["formatId"]+'" able="1" select="0" rowId="'+i+'" class="spec-btn">'+formatTypes[i].detail[j]["name"]+'</div>');
                    specItemArr.push(formatTypes[i].detail[j]["formatId"]);
                    rowArr.push(formatTypes[i].detail[j]["formatId"]);
                }
                rowObj[i] = rowArr;
                specArr.push('</div>');
            }
            $("#specDiv").html(specArr.join(""));
            //初始化选中规格
            if(current["normsId"]){
                specSelectArr = current["normsId"].split(",");
            }
            var format_name = [];
            for(var k = 0,kLen = specSelectArr.length;k < kLen; k ++){
                var $item = $("#specItem"+specSelectArr[k]);
                $item.addClass("spec-slected-btn");
                $item.attr("selected",1);
                format_name.push($item.text());
            }
            $("#itemName2").text(format_name.join("、"));
            //初始化选中数量
//        $("#orderItemCount").val(itemCount);
        }

        /**
         * 渲染评价
         * */
        var renderComment = function(data,item){
            var commentArr = [];
            commentArr.push('<div class="id-btn-div"><div class="id-evaluate-btn text-overflow" satisfyType="1">很满意('+item.verySatisfy+')</div>' +
                '<div class="id-evaluate-btn text-overflow" satisfyType="2">满意('+item.satisfy+')</div>' +
                '<div class="id-evaluate-btn text-overflow" satisfyType="3">不满意('+item.unsatisfy+')</div></div>');

//        var satisfactionListData =data.satisfactionList;
            var appraisalImgListData =[];
            if(data){
                commentArr.push('<div class="vc-cl-content"><div class="vc-cl-head">');
                if(data.img != ''){
                    commentArr.push('<img src="'+data.img+'" class="vc-cl-headImg">');
                }
                else{
                    commentArr.push('<img src="../../images/user/gerenziliao_touxiang@2x.png" class="vc-cl-headImg">');
                }
                commentArr.push('<span class="csi">'+data.satisfy+'</span><span class="vc-cl-tel">'+data.phone+'</span></div>');
                commentArr.push('<div class="vc-cl-comment"><p class="vc-cl-commentDesc">'+data.content+'</p>');
                commentArr.push('<ul class="vc-cl-imgList">');
                //imglist
                appraisalImgListData = data.commentImg;
                if(appraisalImgListData){
                    var appraisalImgListLen = appraisalImgListData.length;
                }
                if(appraisalImgListLen> 0){
                    for(var i =0;i<appraisalImgListLen; i++){
                        commentArr.push('<li><img src="'+appraisalImgListData[i].thumbimg+'" class="vc-cl-img"></li>');
                    }
                }
                commentArr.push('</ul></div><div id="swiper-containerWrap"></div>');
                commentArr.push('<p class="vc-cl-time">'+data.time.substr(0,10)+'</p>');
                if(data.reply){
                    commentArr.push('<p class="vc-cl-reply">'+data.reply+'</p>');
                }
                commentArr.push('</div>');
            }
            $("#evaluateContent").append(commentArr.join("")).show();
            var swiperContainer = $("#swiper-containerWrap");
            var swiper;
            swiperContainer.hide();
            $(".vc-cl-imgList").on("click","li",function(){
                if(!swiper){
                    swiper = commonUtils.showSwipeBox(appraisalImgListData,{pagination:"#swiper-containerWrap .swiper-pagination"})
                }
                swiper.slideTo($(this).index(),0);
                swiperContainer.show();
            });
            $('.vc-cl-imgList li').each(function(){
                var $this=$(this);
                $this.height($this.width());
            });
            addEvaluateBtnListener();
        };

        /**
         * 收藏/取消项目
         * */
        var doCollection = function(){
            var data = {to:"collectItem",type:"User",body:{"userId":userId,"itemId":itemId}};
            commonUtils.ajaxRequest({data:data,successCallback:doCollectCB,url:apiConfig.userApi});
        };

        /**
         * 收藏请求回调
         * */
        var doCollectCB = function(data){
            if(data.result){
                var type = data.data.main.isCollect;
                if(type==1){
                    $("#collectIcon").removeClass('id-collected-btn').addClass('cancel-scale');
                }
                else{
                    $("#collectIcon").removeClass('cancel-scale').addClass('do-scale id-collected-btn');
                }
                commonUtils.showTip(data.data.main.info);
            }
            else{
                commonUtils.showTip(data.msg);
                console.log("收藏/取消收藏失败！"+data.msg);
            }
        };
        /**
         * 请求购物车数量
         * */
        var getCartNum = function(){
            var data = {"userId":userId};
            commonUtils.request({data:data,successCallback:function(data){
                if(data.code == 0){
                    var nums = data.response.totalQuantity;
                    if(nums && nums !=null){
                        nums > 99?$("#itemNum").text("99+"):$("#itemNum").text(nums);
                    }
                }
                else{
                    commonUtils.showTip(data.message);
                }
            },url:apiConfig.newApi+"cart/quantity.html"});
        };

        /**
         * 调整页面位置尺寸
         * */
        var adjustPagePosition = function(){
            var winHeight = $(window).height();
            $("#popPage").css("top",winHeight+"px").show();
            var contentHeight = $("#specDiv").height();
            if(contentHeight+162 > winHeight){
                $("#specContent").css("height",(winHeight-162)+"px");
            }else{
                $("#specContent").css("height",(contentHeight+20)+"px");
                $("#specPage").css("top",(winHeight-162-contentHeight)+"px");
            }
        };

        /**
         * 处理规格选择
         * */
        var doItemSelect = function(norms){
            var selectArr = [];var tempArr1 = [],tempArr2 = [];
            for(var str in norms){
                selectArr.push(str);
            }
            $(".spec-btn").on("click",function(){
                //判断当前按钮的可否点击状态
                var able = $(this).attr("able");
                if(able == 0) return;
                //获取按钮的信息
                var rowId = $(this).attr("rowId");
                var itemId = $(this).attr("itemId");
                //当前为选择状态的要去掉选中状态并且改变选择数组的值
                if(1 == $(this).attr("select")){
                    $(this).attr("select",0);
                    specSelectArr[rowId] = "no"; //改变选择数组
                }
                else{
                    $(this).addClass("spec-slected-btn").attr("select",1);
                    specSelectArr[rowId] = itemId; //改变选择数组
                }
                //从上至下遍历找出不可点击的元素
                specEnableArr = [];
                tempArr2 = selectArr;//所有可选择组合
                for(var i = 0, len = specSelectArr.length; i < len; i++){
                    if(specSelectArr[i] == 0)continue;
                    if(i < len -1 ){
                        tempArr1 = [];
                        //找出包含当前选择规格的所有组合，之后再进一步筛选
                        for(var j = 0,temLen = tempArr2.length;j < temLen;j++){
                            if(tempArr2[j].indexOf(specSelectArr[i])>=0){
                                tempArr1.push(tempArr2[j]);//
                            }
                        }
                        //当组合数少于可选中状态时，筛选出不可选择的规格
                        if(tempArr1.length < rowObj[i+1].length){
                            var ableItemArr = [];
                            for(var k = 0,kLen = tempArr1.length;k < kLen;k++){
                                ableItemArr.push(tempArr1[k].split(",")[i+1]);
                            }
                            for(var m = 0,mLen = rowObj[i+1].length;m < mLen;m++){
                                if(ableItemArr.indexOf(rowObj[i+1][m]) < 0){
                                    specEnableArr.push(rowObj[i+1][m]);
                                }
                            }
                            break;
                        }else{
                            tempArr2 = tempArr1;
                            tempArr1 = [];
                        }
                    }
                }

                doItemRender();
                if(norms[specSelectArr.join(",")]){
                    price = norms[specSelectArr.join(",")].priceOri;
                    priceDis = norms[specSelectArr.join(",")].price;

                    var labelStr = '';
                    for(var i= 0,len = specSelectArr.length;i < len;i++){
                        labelStr += $("#specItem"+specSelectArr[i]).text() +"，";
                    }
                    $("#itemName2").text(labelStr.substr(0,labelStr.length-1));
                    $("#priceDis2").text("臭美价：￥"+priceDis*itemCount);
                    $("#price2").text("原    价：￥"+price*itemCount);
                    salonNormsId = norms[specSelectArr.join(",")].normsId;
                }
            });
        };

        /**
         * 渲染规格选择按钮
         * */
        var doItemRender = function(){
            var $specItem = "";
            //初始化所有按钮
            for(var i = 0,iLen = specItemArr.length;i < iLen;i++){
                $specItem = $("#specItem"+specItemArr[i]);
                $specItem.removeClass("spec-slected-btn").removeClass("spec-btn-enable").attr("able",1).attr("select",0);
            }
            //渲染选择按钮
            for(var i = 0,iLen = specSelectArr.length;i < iLen;i++){
                $specItem = $("#specItem"+specSelectArr[i]);
                $specItem.addClass("spec-slected-btn").attr("select",1);
            }
            //渲染选择按钮
            for(var i = 0,iLen = specEnableArr.length;i < iLen;i++){
                $specItem = $("#specItem"+specEnableArr[i]);
                $specItem.removeClass("spec-slected-btn").addClass("spec-btn-enable");
                //处理当前按钮是选择的状态
                if($specItem.attr("select") == 1){
                    specSelectArr[$specItem.attr("rowId")] = 0; //改变选择数组
                    $specItem.attr("select",0);
                }
                $specItem.attr("able",0);
            }
        };

        /**
         * 规格相关事件监听
         * */
        var addItemSelectListener = function(){
            $("#priceRule").on("click",function(){
                adjustPagePosition();
                $("#buyBtn2,#addCartBtn2").removeClass("id-big-btn").css("display","inline-block");
                $("#popPage").animate({top:0},500);
            });
            $("#specCloseBtn").on("click",function(){
                doSelectedRender();
                $("#buyBtn1").attr("showTip",0);
            });
            //收藏点击监听
            $("#collectBtn").on("click",function(){
                if(!userId){
                    //记录登录之前页面
                    window.sessionStorage.setItem("location",window.location);
                    window.location = "../user/userLogin.html";
                    return;
                }
                doCollection();
            });

            /*更多评论*/
            $("#evaTitle").on("click",function(){
                // window.location = "viewComment.html?id="+itemId+"&type=2&satisfyType="+0;
                window.location = "viewComment.html?itemId="+itemId+"&type=2&satisfyType="+0;
            });
            //更多分店点击监听
            $("#moreShop").on("click",function(){
                window.location = "../salon/branch.html?salonId=" + encodeURI(salonId)+"&addrLati="+addrLati+"&addrLong="+addrLong;
            });
            /*服务保障*/
            $("#serviceSureBtn").on("click",function(){
                window.location = "../activity/bet/bet.html";
            });
            /**购物车点击监听*/
            $("#cartBtn").on("click",function(){
                window.location = "../cart/cart.html";
            });
        };
        /**
         * 满意度评论按钮监听
         * */
        var addEvaluateBtnListener = function(){
            $(".id-evaluate-btn").on("click",function(){
                var satisfyType = $(this).attr("satisfyType");
                // window.location = "viewComment.html?id="+itemId+"&type=2&satisfyType="+satisfyType;
                window.location = "viewComment.html?itemId="+itemId+"&type=2&satisfyType="+satisfyType;
            });
        };
        /**
         * 选择规格后渲染*/
        var  doSelectedRender = function(){
            $("#priceDis").text("￥"+priceDis*itemCount);
            $("#price").text("￥"+price*itemCount);
            $("#popPage").animate({top:$(window).height()+"px"},500);
            var labelStr = '';
            for(var i= 0,len = specSelectArr.length;i < len;i++){
                labelStr += $("#specItem"+specSelectArr[i]).text() +"，";
            }
            (labelStr.length > 0)?(labelStr = labelStr.substr(0,labelStr.length-1)):labelStr="规格不限";
            $("#itemSelectLabel > span").text(labelStr);
        };
        /**
         * 添加购物车
         * */
        var addCart = function(){
            var data = {"userId":userId,"itemId":itemId,"normsId":salonNormsId};
            commonUtils.request({data:data,successCallback:function(data){
                $("#popPage").animate({top:$(window).height()+"px"},300);
                if(data.code == 0){
                    commonUtils.showTip("恭喜，已添加至购物车！");
                    doCartRender();
                }
                else{
                    commonUtils.showTip(data.message);
                }
            },url:apiConfig.newApi+"cart/add.html"});
        };

        /**
         * 提交订单
         * */
        var submitOrder = function(){
            var data = {"userId":userId,"itemId":itemId,"salonId":salonId,"normsId":salonNormsId};

            tongdun({url:"/order/instant/submit.html",data:{"userId":userId,"itemId":itemId,"salonId":salonId,"salonNormsId":salonNormsId}});

            commonUtils.request({data:data,successCallback:function(data){
                if(data.code == 0){
                    sessionStorage.setItem("bill-buynow",JSON.stringify(data.response));
                    window.location = "../cart/cartOrder.html?orderSn="+data.response.orderSn;
                }
                else{
                    commonUtils.alert(data.message);
                    console.log("提交订单信息失败！"+data.message);
                }
            },url:apiConfig.newApi+"order/place.html"});
        };

        /**
         * 渲染购物车项目数量
         * */
        var doCartRender = function(){
            var itemNum = $itemNum.text();
            //itemNum = Number(itemNum)+1;
            if(itemNum.indexOf("+") < 0)itemNum = Number(itemNum)+1;
            if(itemNum >= 99){
                $itemNum.text("99+");
            }
            else{
                $itemNum.text(itemNum);
            }
            $('#joinCartElem').addClass('join-cart-run');
            $itemNum.addClass('cart-tips-scale');

            $joinCartElem.on('webkitAnimationEnd animationEnd',function(){
                $joinCartElem.removeClass('join-cart-run');
            });
            $itemNum.on('webkitAnimationEnd animationEnd',function(){
                $itemNum.removeClass('cart-tips-scale');
            });
        };
        return{
            'init':init
        };
});
