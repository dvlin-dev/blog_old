
# <br />
```JavaScript
<el-button
  type="primary"
  plain
  @click="send_captcha"
  :disabled="isDisabled"
  >{{ buttonName }}</el-button
>
```
```JavaScript
<script>
export default {
  data() {
    return {
      CountDown: 60,//倒计时
      buttonName: "发送验证码",//按钮初始化文字
      isDisabled: false,//是否禁用按钮
    };
  },
  created() {
    //从sessionStorage中读取倒计时相关信息
    if (sessionStorage.getItem("CountDownInfo")) {
      this.CountDown = JSON.parse(
        sessionStorage.getItem("CountDownInfo")
      ).CountDown;
      this.isDisabled = JSON.parse(
        sessionStorage.getItem("CountDownInfo")
      ).isDisabled;
    }
    //进入该页面时，若倒计时还在进行，则继续跑倒计时
    if (this.isDisabled) {
      let timerId = setInterval(() => {
        this.CountDown--;
        this.buttonName = this.CountDown + "秒后重试";
        if (this.CountDown <= 0) {
          clearInterval(timerId);
          this.buttonName = "重新发送";
          this.CountDown = 60;
          this.isDisabled = false;
        }
      }, 1000);
    }
    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem(
        "CountDownInfo",
        JSON.stringify({
          CountDown: this.CountDown,
          isDisabled: this.isDisabled,
        })
      );
    });
  },
  //路由跳转时，保存倒计时相关信息
  beforeRouteLeave(to, from, next) {
    /*
      隶属于 Vue-Router
      to:router 即将要进入的路由对象
      from:router  当前导航正要离开的路由
      next()进行管道中的下一个钩子
      最后要确保调用next方法，否则钩子不会被resolved
    */
    sessionStorage.setItem(
      "CountDownInfo",
      JSON.stringify({
        CountDown: this.CountDown,
        isDisabled: this.isDisabled,
      })
    );
    next();
  },
  methods: {
    send_captcha() {
      const { account, password, username } = JSON.parse(
        sessionStorage.getItem("userinfo")
      );
      if (account && password && username) {
        //先把按钮禁止，并进行倒计时，防止网速慢的用户重复点击
        this.isDisabled = true;
        let timerId = setInterval(() => {
          this.CountDown--;
          this.buttonName = this.CountDown + "秒后重试";
          if (this.CountDown <= 0) {
            clearInterval(timerId);
            this.buttonName = "重新发送";
            this.CountDown = 60;
            this.isDisabled = false;
          }
        }, 1000);
         //操作验证发送API BLOCK
          this.$store.dispatch("login/sms", account).then((data) => {
            this.$message.success("验证码发送成功");
          }).catch(error => {
          //若接口请求错误，把倒计时关了，按钮恢复可点击状态
            this.$message.error("验证码发送失败，请重试");
            clearInterval(timerId);
            this.buttonName = "重新发送";
            this.CountDown = 60;
            this.isDisabled = false;
          });
        }
      } else {
        this.$message.warning("请返回上一步完善信息");
      }
    }
  }
};
</script>
```
注册成功后，应把当前存的信息全部清空
```JavaScript
sessionStorage.setItem(“userinfo”, {});  
sessionStorage.setItem(“CountDownInfo”, {});  
this.$store.state.login = {};
```
之前的一个版本也值得学习下
```JavaScript
//在页面加载时读取sessionStorage里的状态信息
    sessionStorage.getItem("userInfo") &&
      this.$store.replaceState(
        Object.assign(
          this.$store.state,
          JSON.parse(sessionStorage.getItem("userInfo"))
        )
      );
  //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("userInfo", JSON.stringify(this.$store.state));
    });
```
这里之所以使用sessionStorage而不使用localStorage，因为sessionStorage关闭该标签页，数据就会消失的特性符合项目需求<br />引用 [cookie和session、localStorage和sessionStorage小解](https://www.wolai.com/7ftVUCFsAiRqF6prJcmvw2)
