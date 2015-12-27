/**
 * Created by jacky(王浩杰) on 14-11-18.
 * email:719810496@qq.com
 * Copyright (C) 2014 choumei.cn.
 */
define(["jquery", "commonUtils"],function($, utils) {     
        var init = function(){
            //输入监听
            utils.addBack();
            utils.addMenu();
            addListener();
        };
		/**
         * 添加反馈页面按钮点击监听
         * */
        var addListener=function(){
             var $coverBox = $('#coverBox');
				$('#serviceTel').on('click',function(){
					$coverBox.show();
				});
				$('#cancelBtn,#callBtn').on('click',function(){
					$coverBox.hide();
				});
        }
        return{
            'init':init
        };
    }
);

