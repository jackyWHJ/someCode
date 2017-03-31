## 配置请参考antd-mobile

## ZnNavBar 默认设定颜色，默认有返回按钮，返回按钮有返回事件，不需要在定义返回事件
整个组件可以通过antd-mobile的api来自定义

##使用方式
```
import ZnNavBar from 'zn-component/znNavBar';
<ZnNavBar beforeBack={点击返回按钮时，要处理的事件}>标题</ZnNavBar>
```