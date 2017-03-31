var observeObj = {};

//添加一个观察者，用来观察课程详情的变化
//type:对应模块的key值
//props:对应redux值
//callback:处理回调
const add = function(type, callback){
	//console.log("add");
	 observeObj[type] = [];//每次add重置空数组，避免操作 “列表 > 详情 > 列表 > 详情”，避免重复添加多个回调函数进去，即一个type对应一个回调
	 observeObj[type].push(callback);
};


//删除一个观察者
//type:要删除的的模块key
//callback:要删除的某个观察者的某个回调，可以不参则删除当前观察者
const remove = function(type, callback){
	//console.log("remove");
	if(observeObj[type]){
		if(callback){
			//遍历循环数组
			for(var i=observeObj[type].length-1; i>=0; i--){
				//从高位开始遍历方便对数组里存储的回调函数进行剔除
				if(callback == observeObj[type][i]){
					observeObj[type].splice(i, 1);
				}
			}
		}else{
			delete observeObj[type]
		}
	}
};


//触发事件回调
//课程里所有可能会改变课程信息的成功回调后触发
const trigger = function(dispatch, course){
	//console.log("trigger");
	//console.log(observeObj);
	for(var i in observeObj){
		if(observeObj.hasOwnProperty(i)){
			//避免Object.prototype上上继承过来的属性
			for(var j=0, len=observeObj[i].length; j<len; j++){
				observeObj[i][j](dispatch, course);
			}
		}
	}
};


module.exports = {
	add,
	remove,
	trigger,
}





