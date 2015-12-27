/**
 * Created by jacky(王浩杰) on 15-4-9.
 * email:719810496@qq.com
 * Copyright (C) 2014 choumei.cn.
 */
define(["jquery", "commonUtils", 'utils/module/tongdun'], function($,commonUtils,td) {
    var userId = "",
        user = {}, itemPriceArr = {}, cartItemIds = "";
    var init = function() {
        user = JSON.parse(window.sessionStorage.getItem("user") || window.localStorage.getItem("user"));
        if (user) {
            userId = user.userId;
        }
        if (userId) {
            getCartList();
            $("#loginOrShop").hide();
            // $("#loginOrShop").text("去逛逛").on("click",function(){
            //     window.location = "../salon/salonList.html";
            // }); 
        } else {
            $("#cartContent,#cartFooter").hide();
            $("#noItemContent").show();
            $("#loginOrShop").text("去登录").on("click", function() {
                //记录登录之前页面
                window.sessionStorage.setItem("location", window.location);
                window.location = "../user/userLogin.html";
                return;
            });
        }
    };  
    /**
     * 获取购物车列表
     * */
    var getCartList = function() {
        var data = {
            "userId": userId
        };
        var noItem = function() {
            $("#cartContent,#cartFooter").hide();
            $("#noItemContent").show();
        }
        commonUtils.request({
            data: data,
            successCallback: function(data) {
                if (data.code == 0) {
                    data = data.response;
                    console.dir(data);
                    if (data.salons.length > 0) {
                        renderCartList(data.salons);
                    } else {
                        noItem();
                    }
                } else {
                    commonUtils.showTip(data.message);
                    noItem();
                }
            },
            url: apiConfig.newApi + "cart/list.html"
        });
    };
    /**
     * 渲染购物车列表
     * */
    var renderCartList = function(data) {
        if (!data) {
            return;
        }
        var cartArr = [],
            cartList = data,
            itemList = [];
        for (var i = 0; i < data.length; i++) {
            itemList = cartList[i].items;
            var itemLen = itemList.length;
            cartArr.push('<div class="shop-item-div" id="salon' + cartList[i].salonId + '"><div class="shop-item-p">' + '<div id="salonSelector' + cartList[i].salonId + '" class="salonSelector select-icon" flag="off" salonId="' + cartList[i].salonId + '"></div>');
            cartArr.push('<div class="shop-name text-overflow">' + cartList[i].salonName + '</div></div>');
            for (var j = 0; j < itemLen; j++) {
                itemPriceArr[itemList[j].cartItemId] = itemList[j].discountPrice;
                cartArr.push('<div class="shop-item-p cart-item-info" deleteStatus="hidden" id="item' + itemList[j].cartItemId + '"><div class="itemSelector select-icon" ' + 'flag="off" cartItemId="' + itemList[j].cartItemId + '" itemId="' + itemList[j].itemId + '" salonId="' + cartList[i].salonId + '"></div>');
                cartArr.push('<div class="item-content"><div><div class="item-name text-overflow">' + itemList[j].itemName + '</div>');
                cartArr.push('<span class="price-span">￥' + itemList[j].discountPrice + '</span></div>');
                cartArr.push('<div class="rule-content">' + (itemList[j].normsDescription ? itemList[j].normsDescription : "规格：不限；") + '</div>');
                cartArr.push('<div class="number-input"><span class="cart-sprite-img sub-btn" cartItemId="' + itemList[j].cartItemId + '" itemId="' + itemList[j].itemId + '" salonId="' + cartList[i].salonId + '"></span>' + '<span class="number-label" id="itemLabel' + itemList[j].cartItemId + '">' + itemList[j].quantity + '</span>' + '<span class="cart-sprite-img add-btn" cartItemId="' + itemList[j].cartItemId + '" itemId="' + itemList[j].itemId + '" salonId="' + cartList[i].salonId + '"></span></div></div>');
                cartArr.push('<a href="javascript:void(0)" cartItemId="' + itemList[j].cartItemId + '" class="sip-delete"></a></div>');
                //是否特价项目处理
                //if(itemList[j].saleRule && itemList[j].saleRule > 0){
                if (itemList[j].buyLimits && itemList[j].buyLimits.length > 0) {
                    var len = itemList[j].buyLimits.length;
                    cartArr.push('<div class="cart-item-condition"><ul class="clearfix" style="border-top: 0;margin-left:15px">');
                    for (var k = 0; k < len; k++) {
                        cartArr.push('<li>' + itemList[j].buyLimits[k] + '</li>');
                    }
                    cartArr.push('</ul></div>');
                }
                if (itemList[j].useLimit) {
                    cartArr.push('<p class="cart-item-tips">' + itemList[j].useLimit + '</p>');
                }
            }
            cartArr.push('<div class="shop-total"><div class="item-count">共<span id="numSpan' + cartList[i].salonId + '">' + cartList[i].totalQuantity + '</span>个项目</div>' + '<div class="money-total">小计：<span id="priceSpan' + cartList[i].salonId + '" class="price-span">￥' + cartList[i].totalAmount + '</span></div></div></div>');
        }
        $("#cartContent").html(cartArr.join(''));
        addListener();
        addEditListener();
    };
    /**
     * 选择器、数字加减控件，结算按钮监听
     * */
    var addListener = function() {
        /**店铺选择器点击监听*/
        $(".salonSelector").on("click", function(event) {
            event.stopPropagation();
            if ($(this).attr("flag") == "on") {
                $(this).attr("flag", "off").removeClass("selected-icon");
                changeSubSelector($(this).attr("salonId"), "off");
            } else {
                $(this).attr("flag", "on").addClass("selected-icon");
                changeSubSelector($(this).attr("salonId"), "on");
            }
            if (checkAllSalon()) {
                $("#allSelector").attr("flag", "on").addClass("selected-icon");
            }
            setTotalMoney();
        });
        /**项目选择器点击监听*/
        $(".itemSelector").on("click", function(event) {
            event.stopPropagation();
            if ($(this).attr("flag") == "on") {
                $(this).attr("flag", "off").removeClass("selected-icon");
            } else {
                $(this).attr("flag", "on").addClass("selected-icon");
            }
            if (checkSalonSelector($(this).attr("salonId"))) {
                $("#salonSelector" + $(this).attr("salonId")).attr("flag", "on").addClass("selected-icon");
            } else {
                $("#salonSelector" + $(this).attr("salonId")).attr("flag", "off").removeClass("selected-icon");
            }
            setTotalMoney();
        });
        /**数量减少点击监听*/
        $(".sub-btn").on("click", function(event) {
            event.stopPropagation();
            var salonId = $(this).attr("salonId"),
                itemId = $(this).attr("itemId"),
                cartItemId = $(this).attr("cartItemId"),
                num = Number($("#itemLabel" + cartItemId).text());
            num--;
            if (num > 0) {
                doPriceNumRender(salonId, itemId, cartItemId, num, 2);
                upNum(cartItemId, -1);
            }
        });
        /**数量增加点击监听*/
        $(".add-btn").on("click", function(event) {
            event.stopPropagation();
            var salonId = $(this).attr("salonId"),
                itemId = $(this).attr("itemId"),
                cartItemId = $(this).attr("cartItemId"),
                num = Number($("#itemLabel" + cartItemId).text());
            num++;
            if (num < 11) {
                doPriceNumRender(salonId, itemId, cartItemId, num, 1);
                upNum(cartItemId, 1);
            }
        });
        //全选点击监听
        $("#allSelector").on("click", function() {
            if ($(this).attr("flag") == "on") {
                $(this).attr("flag", "off").removeClass("selected-icon");
                $(".salonSelector").attr("flag", "off").removeClass("selected-icon");
                $(".itemSelector").attr("flag", "off").removeClass("selected-icon");
            } else {
                $(this).attr("flag", "on").addClass("selected-icon");
                $(".salonSelector").attr("flag", "on").addClass("selected-icon");
                $(".itemSelector").attr("flag", "on").addClass("selected-icon");
            }
            setTotalMoney();
        });
        /**结算按钮*/
        $("#submitCartBtn").on("click", function() {
            if (!checkItemSelector()) {
                commonUtils.showTip("请至少选择一个项目！");
                return;
            }
            submitOrder();
        });
        // $('.cart-item-info').on('click',function(){
        //     var deleteStatus = $(this).attr('deleteStatus');
        //     if(deleteStatus=='hidden'){
        //         $(this).removeClass('pull-right').addClass('pull-left');
        //         setTimeout(function(){
        //             $(this).find('.sip-delete').removeClass('pull-right').addClass('pull-left');
        //         },300);
        //         $(this).attr('deleteStatus','show');
        //     }else{
        //         $(this).removeClass('pull-left').addClass('pull-right');
        //         setTimeout(function(){
        //             $(this).find('.sip-delete').removeClass('pull-left').addClass('pull-right');
        //         },300);
        //         $(this).attr('deleteStatus','hidden');
        //     }
        // });
        // $('.sip-delete').on('click',function(event){
        //     event.stopPropagation();
        //     var $this = $(this);
        //     var cartItemId = $this.attr("cartItemId");
        //     commonUtils.confirm('确定要删除这个项目吗?',function(boo){
        //         if(boo){
        //             //delete action
        //             doDelete(cartItemId);
        //         }
        //         else{
        //             $this.parent().removeClass('pull-left').addClass('pull-right');
        //             $this.parent().attr('deleteStatus','hidden');
        //         }
        //     });
        // });
    };
    /**
     * 添加编辑点击监听
     * */
    var addEditListener = function() {
        $("#editBtn").on("click", function() {
            $("#editBtn,#submitDiv").hide();
            $("#completeBtn,#deleteDiv").show();
        });
        $("#completeBtn").on("click", function() {
            $("#completeBtn,#deleteDiv").hide();
            $("#editBtn,#submitDiv").show();
        });
        $("#deleteBtn").on("click", function() {
            if (!checkItemSelector()) {
                commonUtils.showTip("请至少选择一个项目！");
                return;
            }
            commonUtils.confirm('确定要删除这个项目吗?', function(boo) {
                if (boo) {
                    doDelete();
                } else {
                    $("#completeBtn,#deleteDiv").hide();
                    $("#editBtn,#submitDiv").show();
                    $('.select-icon').attr("flag", 'off').removeClass("selected-icon");
                }
            });
        });
    };
    /**
     * 更新购物车数量
     * @param
     * */
    var upNum = function(cartItemId, quantity) {
        var data = {
            "userId": userId,
            "cartItemId": cartItemId,
            quantity: quantity
        };
        commonUtils.request({
            data: data,
            successCallback: function(data) {
                if (data.code != 0) {
                    commonUtils.alert(data.message);
                }
            },
            url: apiConfig.newApi + "cart/plus.html",
            showLoading: false
        });
    }
    /**
     * 结算
     * */
    var submitOrder = function() {
        var data = {
            "userId": userId,
            "cartItemIds": cartItemIds
        };
        tongdun({
            url: "order/shopcart/submit.html",
            data: {
                "cartItemIds": cartItemIds
            }
        });
        commonUtils.request({
            data: data,
            successCallback: function(data) {
                if (data.code == 0) {
                    sessionStorage.setItem("bill-cart", JSON.stringify(data.response));
                    window.location = "cartOrder.html?shopcartsn=" + data.response.shopcartSn;
                } else {
                    commonUtils.showTip(data.message);
                }
            },
            url: apiConfig.newApi + "cart/place.html"
        });
    }
    /**
     * 渲染购物车价格和数量
     * */
    var doPriceNumRender = function(salonId, itemId, cartItemId, num, tp) {
        var priceVal = $("#priceSpan" + salonId).text();
        priceVal = priceVal.substr(1, priceVal.length - 1);
        $("#itemLabel" + cartItemId).text(num);
        if (tp == 1) {
            $("#numSpan" + salonId).text(Number($("#numSpan" + salonId).text()) + 1);
            $("#priceSpan" + salonId).text("￥" + (Number(priceVal) + Number(itemPriceArr[cartItemId])));
        } else {
            $("#numSpan" + salonId).text(Number($("#numSpan" + salonId).text()) - 1);
            $("#priceSpan" + salonId).text("￥" + (Number(priceVal) - Number(itemPriceArr[cartItemId])));
        }
        setTotalMoney();
    }
    /**
     * 删除
     * */
    //var doDelete = function(cartItemId){
    var doDelete = function() {
        var data = {
            "userId": userId,
            "cartItemIds": cartItemIds
        };
        commonUtils.request({
            data: data,
            successCallback: function(data) {
                if (data.code == 0) {
                    window.location.reload();
                } else {
                    commonUtils.showTip(data.message);
                }
            },
            url: apiConfig.newApi + "cart/delete.html"
        });
    }
    /**
     * 改变店铺下面项目的选中状态
     * */
    var changeSubSelector = function(salonId, status) {
        $(".itemSelector").each(function() {
            if ($(this).attr("salonId") == salonId) {
                if (status == "on") {
                    $(this).attr("flag", status).addClass("selected-icon");
                } else {
                    $(this).attr("flag", status).removeClass("selected-icon");
                }
            }
        });
    };
    /**
     * 计算总共金额
     * */
    var setTotalMoney = function() {
        cartItemIds = [];
        var sum = 0,
            salonId = "",
            itemId = "",
            num = 1,
            flag = "on";
        $(".itemSelector").each(function() {
            var $this = $(this);
            if ($this.attr("flag") == "on") {
                salonId = $this.attr("salonId");
                itemId = $this.attr("itemId");
                cartItemIds.push($this.attr("cartItemId"));
                num = $("#itemLabel" + $this.attr("cartItemId")).text();
                sum += Number(num) * itemPriceArr[$this.attr("cartItemId")];
            } else {
                flag = "off"
            }
        });
        $("#totalMoney").text("￥" + sum);
        if (flag == "off") {
            $("#allSelector").attr("flag", "off").removeClass("selected-icon");
        } else {
            $("#allSelector").attr("flag", "on").addClass("selected-icon");
        }
    };
    /**
     * 检测是否全部选择
     * */
    var checkAllSalon = function() {
        var boo = true;
        $(".salonSelector").each(function() {
            if ($(this).attr("flag") == "off") {
                boo = false;
                return boo;
            }
        });
        return boo;
    };
    /**
     * 检测店铺选择器是否需要选中
     * */
    var checkSalonSelector = function(salonId) {
        var boo = true;
        $(".itemSelector").each(function() {
            if ($(this).attr("flag") == "off" && $(this).attr("salonId") == salonId) {
                boo = false;
                return boo;
            }
        });
        return boo;
    };
    /**
     * 检测项目选择器是否有选中
     * */
    var checkItemSelector = function() {
        var boo = false;
        $(".itemSelector").each(function() {
            if ($(this).attr("flag") == "on") {
                boo = true;
                return boo;
            }
        }); 
        return boo;
    };  
    return {
        'init': init
    }
})
