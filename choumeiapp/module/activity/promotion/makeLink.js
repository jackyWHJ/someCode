/**
 *
 * @authors jieming.luo (9971414@qq.com)
 * @date    2015-07-07 13:55:09
 * @version $Id$
 */
$(function() {
    $(".cloud").one("webkitAnimationEnd", function() {
        $(this).removeClass('bounceInLeft bounceInRight').addClass('animation2');
    })
    setTimeout(function() {
        $(".star").show();
    }, 2000)
    var page = {
        init: function() {
            page.data.loadData();
            page.action.init();
        },
        data: {
            loadData: function() {
                commonUtils.require({
                    fileList: ["images/1_a.png", "images/1_b.png", "images/1_c.png", "images/1_e.png", "images/1_h.png", ],
                    processor: function(percentage) {
                        $('#loadingTips').text(parseInt(percentage * 100) + '%');
                    },
                    onFinish: function() {
                        $("#loadingWrap").hide();
                    }
                })
            },
            request: function(userName, mobilephone,url) {
                return commonUtils.ajaxRequest({
                    data: {
                        type: "Activity",
                        to: "addUser",
                        body: {
                            userName: userName,
                            mobilephone: mobilephone,
                            activityUrl:url
                        }
                    },
                    url: apiConfig.userApi
                })
            }
        },
        view: {
            init: function() {},
        },
        action: {
            init: function() {
                this.initSubmit();
            },
            initSubmit: function() {
                var submitBtn = $("#link");
                submitBtn.on("click", function() {
                    var phone = $("#phone").val();
                    var name = $("#name").val();
                    if (name == "") {
                        alert("对不起哦，亲，名字不能为空哦");
                    } else if (!/^1[34578]\d{9}$/.test(phone)) {
                        alert("对不起哦，亲，要输入正确的11位手机号码哦！");
                    } else {
                        var  url = location.toString().replace("makeLink","promotion")+"?name="+name+"&phone="+phone;
                        var data = page.data.request(name, phone,url);
                        if(data.data.main.code==1010){
                            alert("你已经生成过专属链接，跳转到你的专属链接");
                        }
                        location = data.data.main.activityUrl;
                    }
                })
            }
        }
    } //end page
    page.init();
})