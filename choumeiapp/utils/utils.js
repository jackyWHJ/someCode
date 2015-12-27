/**
 * Created by whj on 15-11-23.
 */
/**
 * 项目通用工具集，非纯原生，有些地方的调用需要用到jquery以及某些插件
 * */
define(["jquery"], function($) {
    var requestCount = 1,
        requestTime = new Date().getTime(),
        cache = {
            user: JSON.parse(window.sessionStorage.getItem("user") || window.localStorage.getItem("user")) || {},
            accessToken: window.localStorage.getItem("accessToken") || "",
            refreshToken: window.localStorage.getItem("refreshToken") || ""
        }, //cache data
        /**
         * 解析url，获取后带参数
         * */
        getQueryString = function(name) {
            var queryStr = window.location.hash || window.location.search;
            var paramsStr = queryStr.substring(1);
            if (paramsStr) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = paramsStr.match(reg);
                if (r != null) return decodeURI(r[2]);
                return null;
            }
            return null;
        },
        getHashStr = function() {
            return window.location.hash.split("?")[0] || "";
        },
        /**
         * module 统一暴露接口为init
         *document.ready 后运行 module.init
         */
        library = function(module) {
            $(function() {
                if (module.init) {
                    module.init();
                }
            });
            return module;
        },
        /**
         * 消息提示框
         * */
        showTip = function(content) {
            var $showTip = $("#showTip");
            var $body = $('body');
            if ($showTip.html()) {
                $showTip.find("div").html(content);
                $showTip.show();
            } else {
                $body.append('<div class="tip-show" id="showTip"><div>' + content + '</div></div>');
                $showTip = $("#showTip");
            }
            setTimeout(function() {
                $showTip.hide();
            }, 2000);
        },
        /**
         * loading框显示
         * */
        showLoading = function() {
            var $loadingDiv = $("#loadingDiv");
            var loadImgUrl = location.toString().substring(0, location.toString().indexOf("module/")) + "/css/images/ajaxloader.gif";
            if ($loadingDiv.length === 0) {
                var $body = $('body');
                $body.append('<div id="loadingDiv"><div><img src="' + loadImgUrl + '"><p>努力加载中...</p></div></div>');
                var $loadingDiv = $("#loadingDiv");
            }
            $loadingDiv.show();
            return true;
        },
        /**
         * loading框隐藏
         * */
        hideLoading = function() {
            $("#loadingDiv").hide();
        },
        /**
         * 显示遮罩层
         * */
        showCover = function() {
            var $coverBg = $("#coverBg");
            var $body = $('body');
            if ($coverBg.html()) {
                $coverBg.show();
            } else {
                $body.append('<div id="coverBg" class="cover-bg"></div>');
                $coverBg = $("#coverBg");
                $coverBg.show();
            }
        },
        /**
         * 隐藏遮罩层
         * */
        hideCover = function() {
            $("#coverBg").hide();
        },
        /**
         * 计算字符串长度
         * */
        strlen = function(str) { //在IE8 兼容性模式下 不会报错
            var s = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charAt(i).match(/[\u0391-\uFFE5]/)) {
                    s += 2;
                } else {
                    s++;
                }
            }
            return s;
        },
        /**
         * 替换所有的回车换行
         * * */
        transferString = function(content) {
            var string = content;
            if (!string) return null;
            try {
                string = string.replace(/\r\n/g, "<br>")
                string = string.replace(/\n/g, "<br>");
            } catch (e) {
                alert(e.message);
            }
            return string;
        },
        /**
         * 判断当前浏览器是否为微信浏览器
         * */
        isOpenInWechat = function() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 显示swipebox
         * */
        showSwipeBox = function(data, option) {
            var htmlStr = [],
                swiperContaierWrap = $("#swiper-containerWrap");
            var data = data;
            var $body = $("body");
            //console.dir(data);
            htmlStr.push("<div class=\"swiper-container full\" id=\"swiper-container\"><div class=\"swiper-wrapper\" id=\"fullSwiper\">");
            for (var i = 0, len = data.length; i < len; i++) {
                var val = data[i].img || data[i].image.url;
                htmlStr.push("<div class=\"swiper-slide\"><img  src=\"" + val + "\" onerror=\"this.src='../../images/default_img.png'\" index = \"" + i);
                htmlStr.push("\" class=\"swiper-lazy\" /></div>");
            }
            htmlStr.push("</div><div class=\"swiper-pagination\"></div></div>")
            if (!$body.find("#swiper-containerWrap").html()) {
                $body.append(swiperContaierWrap);
            }
            swiperContaierWrap.html(htmlStr.join(""));
            swiperContaierWrap.show();
            var setting = {
                autoplay: false,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                // Disable preloading of all images
                preloadImages: true,
                // Enable lazy loading
                lazyLoading: false,
                lazyLoadingInPrevNext: true,
                initialSlide: 0
            };
            $.extend(setting, option || {})
            var swiper = new Swiper('#swiper-container', setting);
            swiperContaierWrap.on("click", function() {
                swiperContaierWrap.hide();
            })
            return swiper;
        },
        /**
         * 图片没加载出来时的默认图片
         * */
        imgError = function() {
            $('img').error(function() {
                $(this).attr('src', '../../images/default_img.png');
            });
        },
        /**
         * 回到顶部
         * */
        goTop = function() {
            $('body').append('<a href="javascript:void(0)" class="totop_btn" id="gotop"></a>');
            // var oBtn = document.getElementById('gotop');
            var $goTop = $('#gotop');
            window.onscroll = function() {
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollTop >= 250) {
                    $goTop.show();
                } else {
                    $goTop.hide();
                }
            }
            $goTop.on("click", function() {
                $("html,body").animate({
                    scrollTop: 0
                }, 500);
            });
        },
        /**
         * 臭美券密码
         * */
        ticketNoStr = function() {
            var $ticketno = $('.ticketno');
            var ticketnoStr = '';
            var ticketnoArr = [];
            $ticketno.each(function(index, obj) {
                var $that = $(this);
                ticketnoStr = $that.text()
                ticketnoStr = ticketnoStr.substring(0, 4) + '&nbsp;' + ticketnoStr.substring(4, 8);
                $that.html(ticketnoStr);
            });
        },
        /**
         * 图片预加载
         * */
        loaderImg = function(options) {
            var _options = {
                data: [],
                onFinish: function() {},
                onProgress: function(precent) {}
            };
            _options = $.extend(_options, options || {});
            var total = _options.data.length;
            var loaded = 0;

            function loadImage(src) {
                var img = new Image();
                img.onload = function() {
                    loaded++;
                    checkLoadComplete();
                };
                img.onerror = function() {
                    loaded++;
                    checkLoadComplete();
                }
                img.src = src;
            }

            function checkLoadComplete() {
                checkLoadProgress();
                if (loaded == total) {
                    _options.onFinish();
                }
            }

            function checkLoadProgress() {
                _options.onProgress(parseFloat(loaded / total));
            }
            for (var i = 0; i < total; i++) {
                loadImage(_options.data[i]);
            }
        },
        /**
         * @param fileList type:Array desc:文件URL列表
         * @param onFinish 文件列表加载完成后
         * @param processor 文件列表加载进度
         * */
        require = function(options) {
            var _options = {
                fileList: [],
                onFinish: function() {},
                processor: function(percentage) {}
            };
            _options = $.extend(_options, options || {});
            var fileNum = _options.fileList.length,
                total = fileNum,
                percentage = 0;
            _options.fileList.forEach(function(val, index) {
                add(val);
            })
            var _checkProcess = function() {
                _options.processor(1 - (--fileNum) / total);
                if (fileNum == 0) {
                    _options.onFinish();
                }
            }

                function add(file) {
                    var e, type = file.substring(file.lastIndexOf(".") + 1);
                    if (/^(png|jpg|jpeg|gif)$/.test(type)) {
                        e = new Image();
                        e.src = file;
                        e.onerror = e.onload = function() {
                            _checkProcess();
                        }
                    } else {
                        $.get(file, function() {
                            _checkProcess();
                            if (type === "css") {
                                $("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + file + "\">");
                            }
                        })
                    }
                }
        },
        /**
         * 异步请求数据
         * @param data 请求数据-参数
         * @param url 请求链接
         * @param successCallback 请求成功回调方法
         * @param method 数据请求方式：post/get
         * @param dataType 返回数据格式，默认json
         * @param completeCallback 请求完成回调方法
         * @param showLoading 显示加载层
         * @param async 同步或异步,默认同步
         * */
        ajaxRequest = function(args) {
            var that = this,
                returnData = null,
                setting = {
                    data: {
                        ver: "5.3",
                        time: parseInt(new Date().getTime() / 1000),
                        from: window.navigator.userAgent + "#type=WECHAT#os=" + window.navigator.userAgent + "#dpi=" + $(window).width() + "x" + $(window).height(),
                        seq: that.randomString(),
                        body: {
                            userId: ""
                        } //just for test
                    },
                    url: apiConfig.userApi,
                    successCallback: null,
                    method: "post",
                    dataType: "json",
                    async: true,
                    completeCallback: null,
                    showLoading: true
                };
            $.extend(true, setting, args);
            setting.showLoading && that.showLoading();
            $.ajax({
                type: setting.method,
                url: setting.url,
                data: {
                    code: JSON.stringify(setting.data)
                },
                async: setting.async,
                dataType: setting.dataType,
                success: function(data) {
                    if (setting.successCallback) {
                        setting.successCallback(data);
                        setting.showLoading && that.hideLoading();
                        return;
                    }
                    returnData = data;
                    setting.showLoading && that.hideLoading();
                },
                complete: function() {
                    if (setting.completeCallback) {
                        setting.completeCallback();
                    }
                },
                error: function(xhr, status) {
                    setting.showLoading && that.hideLoading();
                    var message = "";
                    switch (status) {
                        case "parsererror":
                            message = "响应数据格式异常!"
                            break;
                        case "timeout":
                            message = "请求超时，请稍后再试!";
                            break;
                        case "offline":
                            message = "网络异常，请稍后再试!";
                            break;
                        default:
                            message = "数据请求失败，请稍后再试!";
                    }
                    that.showTip(message);
                }
            });
            return returnData;
        },
        /**
         * 请求数据
         * @param data 请求数据-参数
         * @param url 请求链接
         * @param successCallback 请求成功回调方法
         * @param method 数据请求方式：post/get
         * @param dataType 返回数据格式，默认json
         * @param completeCallback 请求完成回调方法
         * @param showLoading 显示加载层
         * @param async 同步或异步,默认异步
         * */
        request = function(args) {
            var that = this,
                setting = {
                    data: {
                        userId: this.cache.user.userId
                    },
                    url: apiConfig.userApi,
                    successCallback: null,
                    method: "post",
                    dataType: "json",
                    async: true,
                    completeCallback: null,
                    showLoading: true
                };
            $.extend(true, setting, args);
            setting.data = JSON.stringify(setting.data); //转成json字符串给后台
            var osStr = window.navigator.userAgent;
            var queryStr = "bundle=FQA5WK2BN43YRM8Z&version=6.0&device-type=WECHAT&device-dpi=" + window.screen.width + "x" + window.screen.height + "&device-model=&device-network=" + "&device-uuid=" + (window.localStorage.getItem("device-uuid") ? window.localStorage.getItem("device-uuid") : that.randomString()) + "&device-cpu=&device-os=" + osStr //过滤掉浏览器会转义的特殊字符，比如3G网络下的+
            + "&timestamp=" + new Date().getTime() + "&sequence=" + that.requestTime + (that.requestCount++) + "&access-token=" + this.cache.accessToken;
            queryStr += "&sign=" + $.md5(queryStr + "&request=" + setting.data);
            queryStr = queryStr.replace(/device-os=([^&]*)(&|$)/, "device-os=" + encodeURIComponent(osStr) + "&");
            setting.url.indexOf("?") != -1 ? setting.url += "&" + queryStr : setting.url += "?" + queryStr;
            setting.showLoading && that.showLoading();
            $.ajax({
                type: setting.method,
                url: setting.url,
                data: {
                    request: setting.data
                },
                async: setting.async,
                dataType: setting.dataType,
                timeout: 15000,
                success: function(data) {
                    if (data.code == "10689" || data.code == "10609") {
                        that.cache.requestArgs = args;
                        that.request({
                            url: apiConfig.newApi + "getAccessTokenByRefreshToken.html",
                            data: {
                                userId: that.cache.user.userId,
                                refreshToken: that.cache.refreshToken
                            }, //用出错时返回的refreshToken重新请求token
                            successCallback: function(data) {
                                var token = data.response.accessToken;
                                if (token) {
                                    that.cache.accessToken = token; //加密并重置user
                                    that.cache.requestArgs.data.accessToken = token;
                                    window.localStorage.setItem("accessToken", token); //重新保存user到本地
                                    that.request(that.cache.requestArgs); //重新进行原来的请求
                                }
                            }
                        });
                    } else if (data.code == "10614") { //getAccessTokenByRefreshToken失败
                        that.authorize();
                    } else if (data.code == "11016") { //账号停用
                            that.alert(data.message,function(){
                            window.sessionStorage.setItem("location", window.location)
                            window.location = '../user/userLogin.html';
                        }); 
                    } else if (setting.successCallback) {
                        setting.successCallback(data);
                    }
                    setting.showLoading && that.hideLoading();
                },
                complete: function() {
                    if (setting.completeCallback) {
                        setting.completeCallback();
                    }
                },
                error: function(xhr, status) {
                    setting.showLoading && that.hideLoading();
                    var message = "";
                    switch (status) {
                        case "parsererror":
                            message = "响应数据格式异常!"
                            break;
                        case "timeout":
                            that.alert("网络故障，访问不了臭美服务器，请确认是否可以上网");
                            break;
                        case "offline":
                            message = "网络异常，请稍后再试!";
                            break;
                        default:
                            message = "数据请求失败，请稍后再试!";
                    }
                    that.showTip(message);
                }
            });
        },
        /**
         * 检测用户登录信息
         * */
        checkLogin = function() {
            if (cache.user && cache.accessToken) {
                return cache.user;
            } else {
                authorize();
                return null;
            }
        },
        /*
         *微信授权获取用户信息
         */
        authorize = function() {
            if (!isOpenInWechat()) {
                window.sessionStorage.setItem("location", window.location);
                window.location = '../user/userLogin.html';
            }else if(!validateUserInfo()){
                 window.location = apiConfig.newApi + "user/get-userInfo-h5.html?h5_redirect_url=" + location.toString().replace(/\?/, "QQQ").replace(/=/, "ZZZ").replace(/&/, "XXX");
            }
        },
        /**
         * 检测本地缓存定位信息
         * */
        checkGeoLoc = function() {
            var that = this;
            var addrlati = window.localStorage.getItem("addrlati"),
                addrlong = window.localStorage.getItem("addrlong");
            if (!addrlati && !addrlong) {
                if (window.navigator.geolocation) {
                    that.showLoading();
                    var options = {
                        enableHighAccuracy: true,
                        timeout: 7000
                    };
                    window.navigator.geolocation.getCurrentPosition(function(position) {
                        // 获取到当前位置经纬度
                        var coords = position.coords;
                        addrlong = coords.longitude;
                        addrlati = coords.latitude;
                        var point = new BMap.Point(addrlong, addrlati);
                        //原始坐标转换成百度坐标
                        BMap.Convertor.translate(point, 0, function() {
                            addrlong = point.lng;
                            addrlati = point.lat;
                            window.localStorage.setItem("addrlong", addrlong);
                            window.localStorage.setItem("addrlati", addrlati);
                            that.hideLoading();
                        });
                    }, function(err) {
                        that.hideLoading();
                        that.alert("我们为您准备了更好的推荐服务，请允许微信访问地理位置信息\n您可以在“设置”中允许微信访问位置信息。");
                    }, options);
                } else {
                    that.alert("浏览器不支持html5来获取地理位置信息");
                }
            }
        },
        /**
         * 随机字符串
         * */
        randomString = function(len) {
            len = len || 32;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = [];
            for (var i = 0; i < len; i++) {
                pwd.push($chars.charAt(Math.floor(Math.random() * maxPos)));
            }
            return pwd.join("");
        },
        /**
         * 检测是否是手机号码
         * */
        isPhone = function(phone) {
            var partten = /^1\d{10}$/;
            return partten.test(phone);
        },
        confirm = function(message, options, callback) {
            var $confirm = $(".confirm");
            var $body = $('body');
            if ($confirm.length > 0) return;
            if ($.isFunction(options)) {
                callback = options;
                options = null;
            }
            options = $.extend({}, options, {
                cancelButtonText: options && options.cancelButtonText || "取消",
                okButtonText: options && options.okButtonText || "确定",
                message: message || ""
            });
            var html = [];
            html.push('<div class="confirm">');
            html.push('<div class="confirm">');
            html.push('<div class="confirm-mask"></div>');
            html.push('<div class="confirm-div">');
            html.push('<div class="confirm-div-top">');
            html.push('<p>' + options.message + '</p>');
            html.push('</div>');
            html.push('<div class="confirm-div-bottom">');
            html.push('<span id ="confirm_cancel_button">' + options.cancelButtonText + '</span>');
            html.push('<span id ="confirm_ok_button">' + options.okButtonText + '</span>');
            html.push('</div>');
            html.push('</div>');
            html.push('</div>');
            $body.append(html.join(""));
            $confirm = $(".confirm");
            $confirm.fadeIn('fast');
            var $confirmCancelButton = $("#confirm_cancel_button");
            var $confirmOkButton = $("#confirm_ok_button");
            $confirmCancelButton.on('click', function(e) {
                e.stopPropagation();
                removeAlert();
                callback && callback(false);
            })
            $confirmOkButton.on('click', function(e) {
                e.stopPropagation();
                removeAlert();
                callback && callback(true);
            })
            var removeAlert = function() {
                $confirm.fadeOut('fast');
                $confirm.remove();
                $confirmOkButton.off();
                $confirmCancelButton.off();
            }
        },
        alert = function(message, options, callback) {
            var $body = $('body'),
                $alert = $(".alert"),
                $alertBtn;
            if ($alert.length > 0) return;
            if ($.isFunction(options)) {
                callback = options;
                options = null;
            }
            options = $.extend({}, options, {
                okButtonText: options && options.okButtonText || "确定",
                message: message || ""
            });
            var html = [];
            html.push('<div class="alert">');
            html.push('<div class="alert-mask"></div>');
            html.push('<div class="alert-div">');
            html.push('<div class="alert-div-top"><p>' + options.message + '</p></div>');
            html.push('<div class="alert-div-bottom"><p>' + options.okButtonText + '</p></div>');
            html.push('</div>');
            html.push('</div>');
            $body.append(html.join(""));
            $alert = $(".alert")
            $alertBtn = $(".alert-div-bottom > p");
            $alertBtn.on('click', function(e) {
                e.stopPropagation();
                $alert.fadeOut('fast');
                $alert.remove();
                $alertBtn.off();
                callback && callback();
            });
            $alert.fadeIn('fast');
        },
        /*
         *引入加载seajs
         */
        /*loadSeajs = function(cb){
        this.require({
            fileList:["../../libs/sea.js"],
            onFinish:function(){
                cb();
            }
        })
    },*/
        /*
         *引入加载aes
         */
        _loadAES = function(cb) {
            this.require({
                fileList: ["../../utils/module/aes.js"],
                onFinish: function() {
                    GibberishAES.size(256);
                    if (cb) {
                        cb();
                    }
                }
            })
        },
        /*
         *aes加密
         */
        aesEncrypt = function(text, key, handler) {
            this._loadAES(function() {
                handler(GibberishAES.aesEncrypt(text, key ? key : text).toString().replace(/\n/g, ""));
            })
        },
        /*
         *aes解密
         */
        aesDecrypt = function(text, key, handler) {
            this._loadAES(function() {
                handler(GibberishAES.aesDecrypt(text, key ? key : text).toString().replace(/\n/g, ""));
            })
        },
        /**
         * 添加返回键
         * */
        addBack = function(selector, cb) {
            if ($.isFunction(arguments[0])) {
                cb = arguments[0];
                selector = '.header';
            } else {
                selector ? '' : selector = '.header';
            }
            $(selector).append('<span class="back" id="back"></span>');
            if (!cb) {
                cb = function() {
                    history.go(-1);
                }
            }
            $("#back").on("click", cb);
        },
        /**
         * 添加菜单
         * */
        addMenu = function(selector) {
            if ($.isFunction(arguments[0])) {
                cb = arguments[0];
                selector = '.header';
            } else {
                selector ? '' : selector = '.header';
            }
            $(selector).append('<span id="menu" class="menu"></span>');
            var menuWrap = '<div class="menu-wrap" id="menuWrap"><ul class="menu-ul"><li><a href="../home/homePage.html" target="_parent">首页</a></li><li><a href="../user/myPage.html" target="_parent">我的</a></li></ul><div class="mask"></div></div>';
            $("body").append(menuWrap);
            $("#menu,.menu-wrap").on("click", function(e) {
                $("#menuWrap").toggle();
            });
            $(".mask").on("touchstart", function(e) {
                $("#menuWrap").toggle();
                e.preventDefault();
                e.stopPropagation();
            });
            $(".mask").on("touchmove", function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
        },
        /**
         * 校验获取授权后用户信息
         * */
        validateUserInfo = function() {
            var userInfo = getQueryString("userInfo"); //微信授权后回调的用户信息
            if (userInfo !== null) {
                if (!userInfo) { //信息获取失败，强制登录,返回userInfo=""
                    window.sessionStorage.setItem("location", window.location)
                    window.location = "../user/userLogin.html";
                }
                user = JSON.parse(userInfo);
                cache.user = user;
                cache.accessToken = user.accessToken;
                cache.refreshToken = user.refreshToken;
                window.localStorage.setItem("accessToken", user.accessToken);
                window.localStorage.setItem("refreshToken", user.refreshToken);
                window.sessionStorage.setItem("user", JSON.stringify(user));
                window.localStorage.setItem("user", JSON.stringify(user));
                return  true;
            }
            return false;
        };
    validateUserInfo();//默认进行一次校验
    /**
     * 查找数组中是否包含某个元素的方法
     * @return index
     * */
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(Object) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == Object) {
                    return i;
                }
            }
            return -1;
        };
    }
    if (!window.localStorage.getItem("device-uuid")) {
        window.localStorage.setItem("device-uuid", randomString());
    }
    /**
     * jQuery MD5 hash algorithm function
     *
     *  <code>
     *      Calculate the md5 hash of a String
     *      String $.md5 ( String str )
     *  </code>
     *
     * Calculates the MD5 hash of str using the » RSA Data Security, Inc. MD5 Message-Digest Algorithm, and returns that hash.
     * MD5 (Message-Digest algorithm 5) is a widely-used cryptographic hash function with a 128-bit hash value. MD5 has been employed in a wide variety of security applications, and is also commonly used to check the integrity of data. The generated hash is also non-reversable. Data cannot be retrieved from the message digest, the digest uniquely identifies the data.
     * MD5 was developed by Professor Ronald L. Rivest in 1994. Its 128 bit (16 byte) message digest makes it a faster implementation than SHA-1.
     * This script is used to process a variable length message into a fixed-length output of 128 bits using the MD5 algorithm. It is fully compatible with UTF-8 encoding. It is very useful when u want to transfer encrypted passwords over the internet. If you plan using UTF-8 encoding in your project don't forget to set the page encoding to UTF-8 (Content-Type meta tag).
     * This function orginally get from the WebToolkit and rewrite for using as the jQuery plugin.
     *
     * Example
     *  Code
     *      <code>
     *          $.md5("I'm Persian.");
     *      </code>
     *  Result
     *      <code>
     *          "b8c901d0f02223f9761016cfff9d68df"
     *      </code>
     *
     * @alias Muhammad Hussein Fattahizadeh < muhammad [AT] semnanweb [DOT] com >
     * @link http://www.semnanweb.com/jquery-plugin/md5.html
     * @see http://www.webtoolkit.info/
     * @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]
     * @param {jQuery} {md5:function(string))
     * @return string
     */
    (function($) {
        var rotateLeft = function(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }
        var addUnsigned = function(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }
        var F = function(x, y, z) {
            return (x & y) | ((~x) & z);
        }
        var G = function(x, y, z) {
            return (x & z) | (y & (~z));
        }
        var H = function(x, y, z) {
            return (x ^ y ^ z);
        }
        var I = function(x, y, z) {
            return (y ^ (x | (~z)));
        }
        var FF = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var GG = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var HH = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var II = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var convertToWordArray = function(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWordsTempOne = lMessageLength + 8;
            var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
            var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };
        var wordToHex = function(lValue) {
            var WordToHexValue = "",
                WordToHexValueTemp = "",
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValueTemp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
            }
            return WordToHexValue;
        };
        var uTF8Encode = function(string) {
            string = string.replace(/\x0d\x0a/g, "\x0a");
            var output = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    output += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    output += String.fromCharCode((c >> 6) | 192);
                    output += String.fromCharCode((c & 63) | 128);
                } else {
                    output += String.fromCharCode((c >> 12) | 224);
                    output += String.fromCharCode(((c >> 6) & 63) | 128);
                    output += String.fromCharCode((c & 63) | 128);
                }
            }
            return output;
        };
        $.extend({
            md5: function(string) {
                var x = Array();
                var k, AA, BB, CC, DD, a, b, c, d;
                var S11 = 7,
                    S12 = 12,
                    S13 = 17,
                    S14 = 22;
                var S21 = 5,
                    S22 = 9,
                    S23 = 14,
                    S24 = 20;
                var S31 = 4,
                    S32 = 11,
                    S33 = 16,
                    S34 = 23;
                var S41 = 6,
                    S42 = 10,
                    S43 = 15,
                    S44 = 21;
                string = uTF8Encode(string);
                x = convertToWordArray(string);
                a = 0x67452301;
                b = 0xEFCDAB89;
                c = 0x98BADCFE;
                d = 0x10325476;
                for (k = 0; k < x.length; k += 16) {
                    AA = a;
                    BB = b;
                    CC = c;
                    DD = d;
                    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                    a = addUnsigned(a, AA);
                    b = addUnsigned(b, BB);
                    c = addUnsigned(c, CC);
                    d = addUnsigned(d, DD);
                }
                var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
                return tempValue.toUpperCase();
            }
        });
    })(jQuery);
    return {
        requestCount: requestCount,
        requestTime: requestTime,
        cache: cache, //cache data
        getQueryString: getQueryString,
        getHashStr: getHashStr,
        /**
         * module 统一暴露接口为init
         *document.ready 后运行 module.init
         */
        library: library,
        showTip: showTip,
        showLoading: showLoading,
        hideLoading: hideLoading,
        showCover: showCover,
        hideCover: hideCover,
        strlen: strlen,
        transferString: transferString,
        isOpenInWechat: isOpenInWechat,
        showSwipeBox: showSwipeBox,
        imgError: imgError,
        goTop: goTop,
        ticketNoStr: ticketNoStr,
        loaderImg: loaderImg,
        require: require,
        ajaxRequest: ajaxRequest,
        request: request,
        checkLogin: checkLogin,
        authorize: authorize,
        checkGeoLoc: checkGeoLoc,
        randomString: randomString,
        isPhone: isPhone,
        confirm: confirm,
        alert: alert,
        /*
         *引入加载seajs
         */
        /*loadSeajs:loadSeajs,*/
        /*
         *引入加载aes
         */
        _loadAES: _loadAES,
        /*
         *aes加密
         */
        aesEncrypt: aesEncrypt,
        /*
         *aes解密
         */
        aesDecrypt: aesDecrypt,
        addBack: addBack,
        addMenu: addMenu
    }
});