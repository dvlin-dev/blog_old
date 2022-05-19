
# <br />
[https://github.com/rstacruz/nprogress](https://github.com/rstacruz/nprogress)
安装<br />将nprogress.js和nprogress.css添加到项目中。
```javascript
<script src='nprogress.js'></script>
<link rel='stylesheet' href='nprogress.css'/>
```
NProgress可通过bower和npm获得。
```javascript
$ npm install --save nprogress
```
也可通过unpkg CDN:

- [https://unpkg.com/nprogress@0.2.0/nprogress.js](https://unpkg.com/nprogress@0.2.0/nprogress.js)
- [https://unpkg.com/nprogress@0.2.0/nprogress.css](https://unpkg.com/nprogress@0.2.0/nprogress.css)

基本用法<br />只需调用start()和done()来控制进度条。
```javascript
NProgress.start();
NProgress.done();
```
Vue实例
```JavaScript
import Vue from "vue";
import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // 进度条
import "nprogress/nprogress.css"; // 进度条样式
import getPageTitle from "@/utils/get-page-title";
import { getRefreshToken } from "@/utils/token";
NProgress.configure({ showSpinner: false }); // NProgress配置
const whiteList = [
  "/login",
  "/register",
  "/register_captcha",
  "/forget_password",
  "/forget_password_captcha"
]; // 重定向白名单
router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start();
  // 设置页面标题
  document.title = getPageTitle(to.meta.title);
  // 判断用户是否已登录
  let bearerToken = localStorage.getItem("bearer_token") || "";
  if (bearerToken) {
    if (to.path === "/login") {
      // 如果已登录，则重定向到主页
      next({ path: "/" });
      Vue.prototype.$message.success("您已登录");
      setTimeout(() => {
        NProgress.done();
      }, 300);
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          // 获取用户信息,若获取不到，在getInfo方法内提示用户重新登录
          await store.dispatch("user/getInfo");
          next();
        } catch (error) {
          // 删除令牌并转到登录页面重新登录
          let refreshToken = localStorage.getItem("refresh_token") || "";
          // 尝试刷新 token
          //getRefreshToken 方法刷新token
          if (refreshToken.length !== 0) {
            let refreshToken = await getRefreshToken();
            localStorage.setItem("refresh_token", refreshToken);
            next();
          } else {
            Vue.prototype.$message.error(error || "Has Error");
            //重定向到登录页面
            next(`/login?redirect=${to.path}`);
          }
          setTimeout(() => {
            NProgress.done();
          }, 300);
        }
      }
    }
  } else {
    /*没有令牌*/
    if (whiteList.indexOf(to.path) !== -1) {
      //在免登录白名单中，直接进入
      next();
    } else {
      //其他没有权限访问的页面重定向到登录页面。
      next(`/login?redirect=${to.path}`);
      setTimeout(() => {
        NProgress.done();
      }, 300);
    }
  }
});
router.afterEach(() => {
  //完成进度条
  setTimeout(() => {
    NProgress.done();
  }, 300);
});
```
