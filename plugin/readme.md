访问方式: http://localhost:8000/#/?pluginType=2&appId=com.pingan.wanjiab&accountType=1&userId=13612345678&phone=13612345678&username=xx&birthday=time=154ff15ba40&token=753C3511B568418E5AA9973E990415BE&_k=0h0hx8


打包后: test.zhi-niao.com/zhiniao/znplugin/index.html?plyginType=2&appId=com.pingan.wanjiab&accountType=1&userId=13751074503&phone=13751074503&username=xxp&birthday=time=154ff15ba40&token=0E2E2BD633203645DCC00173A7AB6D2F_k=4806el

webpack中的publicPath配置:
开发环境: /
测试环境: /zhiniao/znplugin/
生成环境: /zhiniao/static/

开发环境编译: npm start || npm run dev
测试环境编译: npm run test
生成环境编译: npm run build