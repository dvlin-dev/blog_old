
# Axios拦截器实例（token）
request.js
```JavaScript
import axios from "axios";
import Vue from "vue";
import { parseToken, getRefreshToken } from "./token";
// axios 配置
// axios.defaults.timeout = 8000;
const service = axios.create({
    baseURL: "https://api.job.sunxinao.cn/", // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
});
// Loading 实例
let loading;
function startLoading() {
  loading = Vue.prototype.$loading({
    lock: true,
    text: "加载中...",
  });
}
function endLoading() {
  setTimeout(() => {
    loading.close();
  }, 300);
}
let needLoadingRequestCount = 0;
function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
}   
function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}
service.interceptors.request.use(
  config => {
    //当请求的api不是检查用户是否存在时，启动加载动画
    if (config.url !== "/reg/valid/suppress_xhr_error") {
      
    }
    showFullScreenLoading();
    let bearerToken = localStorage.getItem("bearer_token") || "";
    let refreshToken = localStorage.getItem("refresh_token") || "";
    if (config.headers["authorization"] === undefined) {
      if (config.url.endsWith("/refresh_token")) {
        config.headers["authorization"] = "Bearer " + refreshToken;
      } else if (bearerToken.length !== 0) {
        config.headers["authorization"] = bearerToken;
      }
    }
    return config;
  },
  error => {
    tryHideFullScreenLoading();
    return Promise.reject(error);
  }
);
// 添加响应拦截器
service.interceptors.response.use(
  response => {
    tryHideFullScreenLoading();
    if (response.headers["authorization"]) {
      localStorage.setItem("bearer_token", response.headers["authorization"]);
      let token = response.headers["authorization"].replace(/Bearer\s*/i, "");
      let jwt = parseToken(token);
      let userId = jwt["payload"]["sub"];
      localStorage.setItem("user_id", userId);
    }
    return response;
  },
  async error => {
    tryHideFullScreenLoading();
    let response = error.response;
    if (response && response.status === 401) {
      // 当前会话已失效，删除 token 以进入匿名状态
      localStorage.removeItem("bearer_token");
      localStorage.removeItem("user_id");
            if (response.data && response.data["error"] === "invalid_token") {
                let refreshToken = localStorage.getItem("refresh_token") || "";
                // 尝试刷新 token
                if (refreshToken.length !== 0) {
                    let refreshToken = await getRefreshToken();
                    localStorage.setItem("refresh_token", refreshToken);
                    if (refreshToken.length !== 0) {
                        // FIXME 刷新成功的话重新发请求 （待测试）
                        try {
                            delete response.config.headers["authorization"];
                            return await axios(response.config);
                        } catch (e) {
                            //会话刷新失败
                            this.$confirm(
                                    "未登录或会话失效，您可以取消停留在此页面，或重新登录",
                                    "提示", {
                                        confirmButtonText: "确定",
                                        cancelButtonText: "取消",
                                        type: "warning"
                                    }
                                )
                                .then(() => {
                                    this.$router.push("/login");
                                })
                                .catch(() => {
                                    location.reload();
                                });
                            return Promise.reject(e);
                        }
                    } else {
                        //未登录
                        this.$confirm(
                                "未登录或会话失效，您可以取消停留在此页面，或重新登录",
                                "提示", {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning"
                                }
                            )
                            .then(() => {
                                this.$router.push("/login");
                            })
                            .catch(() => {
                                location.reload();
                            });
                    }
                }
            }
        }
        Vue.prototype.$message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);
export default service;
```
token.js
```JavaScript
import request from "./request";
import base64 from "base64-js";
/**
 * 解析 token
 *
 * @param {string} token JWT 字符串
 * @returns {{payload: any, header: any}} 解析后的对象
 */
export function parseToken(token) {
  let decoder = new TextDecoder();
  let tokenHeader = token
    .split(".")[0]
    .replace(/-/gi, "+")
    .replace(/_/gi, "/");
  let tokenPayload = token
    .split(".")[1]
    .replace(/-/gi, "+")
    .replace(/_/gi, "/");
  while (tokenPayload.length % 4 !== 0) tokenPayload += "=";
  while (tokenHeader.length % 4 !== 0) tokenHeader += "=";
  let jsonStr = decoder.decode(base64.toByteArray(tokenPayload));
  let payload = JSON.parse(jsonStr);
  jsonStr = decoder.decode(base64.toByteArray(tokenHeader));
  let header = JSON.parse(jsonStr);
  return {
    header: header,
    payload: payload
  };
}
/**
 * 刷新令牌
 * @return {Promise<string>} 返回的 Refresh Token
 */
export async function getRefreshToken() {
  return await request
    .get("/oauth/refresh_token")
    .then(result => {
      let data = result.data;
      let refreshToken = data["refresh_token"];
      console.log("token 刷新成功: " + data["access_token"]);
      return refreshToken;
    })
    .catch(() => "");
}
```
