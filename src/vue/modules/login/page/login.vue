<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-head">
        <img
          :src="LOGIN_CONFIG_LOGO"
          class="logo"
        >
        <!-- <span class="logo-text">{{LOGIN_CONFIG.TITLE}}</span> -->
      </div>
      <div v-show="isLoaded">
        <div v-show="login">
          <div class="login-status">
            <div class="login-status-content">
              <div
                :class="{'left-login1':!LOGIN_CONFIG.FASTLOGIN}"
                @click="loginType=true,loginFrom={}"
                class="left-login "
              >
                <a :class="[loginType?'ck-text':'']">账号登录</a>
                <div
                  v-show="loginType"
                  :class="{'right-login-hr1':!LOGIN_CONFIG.FASTLOGIN}"
                  class="left-login-hr"
                >
                  <div class="triangle" />
                </div>
              </div>
              <div
                v-if="LOGIN_CONFIG.FASTLOGIN"
                @click="loginType=false,showQrCode=false"
                class="right-login"
              >
                <a :class="[!loginType?'ck-text':'']">快捷登录</a>
                <div
                  v-show="!loginType"
                  class="right-login-hr"
                >
                  <div class="triangle" />
                </div>
              </div>
            </div>
          </div>
          <!--登录-->
          <div
            v-show="loginType"
            class="login-form"
          >
            <el-form
              ref="loginFrom"
              :model="loginFrom"
              :rules="rulesLoginFrom"
              :show-message="showMessageFlag"
            >
              <el-form-item prop="phone">
                <el-input
                  v-model="loginFrom.phone"
                  :placeholder="!isNoteLogin?placeHolder(LOGIN_CONFIG.ACCOUNT):'手机号'"
                  @blur="customValidateForm('loginFrom',true)"
                  type="text"
                >
                  <template slot="prepend">
                    <i class="jeicon jeicon-mobile" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item
                v-show="!isNoteLogin"
                class="marginBottom15"
                prop="pwd"
              >
                <el-input
                  v-model="pwd"
                  @blur="customValidateForm('loginFrom')"
                  @input="loginFrom.pwd=pwd"
                  type="password"
                  placeholder="密码"
                >
                  <template slot="prepend">
                    <i class="jeicon jeicon-lock" />
                  </template>
                </el-input>
                <input
                  v-model="loginFrom.pwd"
                  type="hidden"
                >
              </el-form-item>
              <el-form-item
                v-show="isNoteLogin"
                class="marginBottom15"
                prop="validateCode"
              >
                <el-input
                  v-model="validateCode"
                  @input="loginFrom.validateCode=validateCode"
                  type="text"
                  placeholder="短信验证码"
                  maxlength="6"
                  class="custom-width"
                >
                  <template slot="prepend">
                    <i class="jeicon jeicon-key" />
                  </template>
                  <template slot="append">
                    <el-button
                      @click="getValidateCode(loginFrom.phone,'LOGIN','loginFrom')"
                      class="getValidate"
                    >
                      <span v-show="sendAuthCode">获取</span>
                      <span v-show="!sendAuthCode">{{ auth_time }}s</span>
                    </el-button>
                  </template>
                  <input
                    v-model="loginFrom.validateCode"
                    type="hidden"
                  >
                </el-input>
              </el-form-item>
              <drag-verify
                ref="Verify"
                :width="width"
                :height="height"
                :text="text"
                :success-text="successText"
                :background="background"
                :progress-bar-bg="progressBarBg"
                :completed-bg="completedBg"
                :handler-bg="handlerBg"
                :handler-icon="handlerIcon"
                :text-size="textSize"
                :success-icon="successIcon"
                v-if="!isNoteLogin&&dragVerifyinput"
              />
              <el-row class="login-bar">
                <el-col :span="24">
                  <el-checkbox
                    v-model="remberStatus"
                    label="记住状态"
                    name="type"
                  />
                  <span
                    v-if="LOGIN_CONFIG.FINDPASSWORD"
                    class="hr"
                  >|</span>
                  <a
                    v-if="LOGIN_CONFIG.FINDPASSWORD"
                    @click="findPwd=true,login=false,findPwdState='1',findPwdFrom={},findPwdFrom1={},sendAuthCode=true,auth_time=0,resetForm('findPwdFrom1'),resetForm('findPwdFrom'),findPwdForm1ErrorMsg='',findPwdFormErrorMsg=''"
                  >忘记密码</a>
                  <span
                    v-if="LOGIN_CONFIG.OTHERLOGIN.PHONE"
                    class="hr"
                  >|</span>
                  <a
                    v-if="LOGIN_CONFIG.OTHERLOGIN.PHONE"
                    @click="isNoteLogin=!isNoteLogin,resetForm('loginFrom'),loginFormErrorMsg='',sendAuthCode=true,auth_time=0,loginFrom={}"
                  >{{
                    !isNoteLogin?'动态':'个人'
                  }}密码登录</a>
                </el-col>
              </el-row>
              <el-row class="error-bar">
                <el-col :span="24">
                  <span>{{ loginFormErrorMsg }}</span>
                </el-col>
              </el-row>
              <el-form-item>
                <!--<el-input class="login-btn" type="button">登陆</el-input>-->
                <el-button
                  @click="loginSubmit('loginFrom')"
                  class="login-btn "
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <!--快捷登录-->
          <div
            v-show="!loginType"
            class="quick-login"
          >
            <div v-show="!showQrCode">
              <div class="quick-login-header">
                <p>使用快捷登录，请先到个人设置中绑定第三方账号</p>
                <!-- <span>绑定教程</span> -->
              </div>
              <div class="quick-login-icon">
                <ul>
                  <li v-if="LOGIN_CONFIG.OTHERLOGIN.DTTALK">
                    <a @click="otherLogin('DT')">
                      <img src="../assets/dingding-icon.png">
                      <span>钉钉</span>
                    </a>
                  </li>
                  <li v-if="LOGIN_CONFIG.OTHERLOGIN.WECHAT">
                    <a @click="otherLogin('WX')">
                      <img src="../assets/weixin-icon.png">
                      <span>微信</span>
                    </a>
                  </li>
                  <li v-if="LOGIN_CONFIG.OTHERLOGIN.QQ">
                    <a @click="otherLogin('QQ')">
                      <img src="../assets/qq-icon.png">
                      <span>QQ</span>
                      <i id="qqLoginBtn" />
                    </a>
                  </li>
                  <li v-if="LOGIN_CONFIG.OTHERLOGIN.APP">
                    <a @click="otherLogin('SB')">
                      <img src="../assets/suanban-icon.png">
                      <span>APP</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              v-show="showQrCode"
              class="qr-code"
              align="center"
            >
              <div class="header">
                <span>使用{{ typeText }}扫码登录</span>
              </div>
              <div id="qr_container" />
              <div class="footer-text">
                <a @click="quickLoginBack"><a class="">返回</a></a>
              </div>
            </div>
          </div>
        </div>
        <!--找回密码-->
        <div
          v-show="findPwd"
          class="login-form find-pwd-form"
        >
          <!--找回密码1-->
          <el-form
            ref="findPwdFrom1"
            v-show="findPwdState=='1'"
            :model="findPwdFrom1"
            :rules="rulesfindPwdFrom1"
            :show-message="showMessageFlag"
          >
            <el-row>
              <el-col
                :span="24"
                class="find-pwd-head"
              >
                <span class="find-pwd-text">找回密码</span>
              </el-col>
            </el-row>
            <el-form-item prop="phone">
              <el-input
                v-model="findPwdFrom1.phone"
                @blur="customValidateForm('findPwdFrom1')"
                placeholder="手机号/账号"
                maxlength="11"
              >
                <template slot="prepend">
                  <i class="jeicon jeicon-mobile" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="validateCode">
              <el-input
                v-model="findPwdFrom1.validateCode"
                @blur="customValidateForm('findPwdFrom1')"
                placeholder="短信验证码"
                maxlength="6"
                class="custom-width"
              >
                <template slot="prepend">
                  <i class="jeicon jeicon-key" />
                </template>
                <template slot="append">
                  <el-button
                    @click="getValidateCode(findPwdFrom1.phone,'ZH','findPwdFrom1')"
                    class="getValidate"
                  >
                    <span v-show="sendAuthCode">获取</span>
                    <span v-show="!sendAuthCode">{{ auth_time }}s</span>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-row class="error-bar find-pwd-error">
              <el-col :span="24">
                <span>{{ findPwdForm1ErrorMsg }}</span>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button
                @click="findPwdFrom1Next('findPwdFrom1')"
                class="login-btn find-pwd-btn"
              >
                下一步
              </el-button>
            </el-form-item>
            <el-row class="footer-text padding-right96">
              <el-col :span="24">
                <a @click="findPwd=false,loginType=true,login=true,resetForm('findPwdFrom1'),loginFrom={}">返回登录</a>
              </el-col>
            </el-row>
          </el-form>
          <!--找回密码2-->
          <el-form
            ref="findPwdFrom"
            v-show="findPwdState=='3'"
            :model="findPwdFrom"
            :rules="rulesfindPwdFrom"
            :show-message="showMessageFlag"
          >
            <el-row>
              <el-col
                :span="24"
                class="find-pwd-head marginBottom15"
              >
                <span class="find-pwd-text">找回密码</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="24"
                class="find-pwd-head marginBottom5"
              >
                <span class="find-pwd-title">密码为6位以上字母+数字组合</span>
              </el-col>
            </el-row>
            <el-form-item
              class="margin-bottom5"
              prop="oldPwd"
            >
              <el-input
                v-model="findPwdFrom.oldPwd"
                @input="pwdStrengthWatch(findPwdFrom.oldPwd)"
                @blur="customValidateForm('findPwdFrom')"
                type="password"
                placeholder="新密码"
                maxlength="20"
              >
                <template slot="prepend">
                  <i class="jeicon jeicon-lock" />
                </template>
              </el-input>
            </el-form-item>
            <el-row class="margin-bottom5">
              <el-col
                :span="24"
                class="pwd-strength"
              >
                <span
                  v-show="level<=0"
                  class="find-pwd-title"
                >增加密码的位数，可以提升强度</span><span
                  v-show="level==1 || level==2"
                  class="find-pwd-title"
                >字母的大小写，可加强一个等级
                </span><span
                  v-show="level==3"
                  class="find-pwd-title"
                >已经很不错了,请牢记</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="24"
                class="pwd-strength"
              >
                <div class="pwd-strength margin0">
                  <div
                    :class="[level==3?'level3':'',(level==2 || level==1)?'level2':'']"
                    class="pwd-strength-border pwd-strength-1"
                  />
                  <div
                    :class="[level==3?'level3':'',level==2?'level2':'']"
                    class="pwd-strength-border pwd-strength-2"
                  />
                  <div
                    :class="[level==3?'level3':'']"
                    class="pwd-strength-border pwd-strength-3"
                  />
                </div>
              </el-col>
            </el-row>
            <el-form-item
              class="margin-bottom35"
              prop="newPwd"
            >
              <el-input
                v-model="findPwdFrom.newPwd"
                @blur="customValidateForm('findPwdFrom')"
                type="password"
                placeholder="确认密码"
                maxlength="20"
              >
                <template slot="prepend">
                  <i class="jeicon jeicon-lock" />
                </template>
              </el-input>
            </el-form-item>
            <el-row class="error-bar">
              <el-col :span="24">
                <span>{{ findPwdFormErrorMsg }}</span>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button
                @click="findPwdLogin('findPwdFrom')"
                class="login-btn find-pwd2-btn"
              >
                提交
              </el-button>
            </el-form-item>
            <el-row class="footer-text padding-right96">
              <el-col :span="24">
                <a @click="findPwd=false,loginType=true,login=true,resetForm('findPwdFrom')">返回登录</a>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!--密码修改成功-->
        <div
          v-show="updateSuccess"
          class="login-form"
        >
          <div class="update-success-content">
            <p class="update-success-text">
              密码修改成功
            </p>
            <a
              @click="findPwd=false,updateSuccess=false,loginType=true,login=true"
              class="update-success-return"
            >返回登录</a>
          </div>
        </div>
      </div>
    </div>
    <div class="login-bg">
      <img
        v-show="showImg"
        :src="LOGIN_CONFIG_BGIMG"
        @load="loadedImg"
        class="fadeInLong walker"
      >
      <img
        v-show="!showImg"
        :style="{filter: filterBlur}"
        :src="LOGIN_CONFIG_BGIMGBLUR"
        class="fadeOutLong walker"
      >
    </div>
  </div>
</template>
<script>
import Login from './login.js';

export default Login;
</script>
<style rel="stylesheet/scss" lang="scss">
@import "./../styles/login.scss";
</style>
