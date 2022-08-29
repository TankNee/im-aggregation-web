<script setup lang="ts">
import type {AdapterInfo} from "@/types";
import axios from "axios";
import IconWeChat from "@/components/icons/IconWeChat.vue";
import IconWhatsApp from "@/components/icons/IconWhatsApp.vue";
import IconWeCom from "@/components/icons/IconWeCom.vue";
import IconNotification from "@/components/icons/IconNotification.vue";
import IconNotificationOff from "@/components/icons/IconNotificationOff.vue";
import {watch, computed, ref} from "vue"

const props = defineProps<{
  info: AdapterInfo
}>()

const {info} = props

const notificationShow = ref(true)

function toggleNotification() {
  notificationShow.value = !notificationShow.value
}

const startButtonShow = computed(() => {
  return info.status !== "online"
})

const logoutButtonShow = computed(() => {
  return info.status === "online" && info.user.status === "online"
})

const exitButtonShow = computed(() => {
  return info.status === "online"
})

// // @ts-ignore
// const Icon = await import(`./icons/Icon${info.name}.vue`) http://localhost:7777

let Icon: any;

switch (info.name) {
  case "WeChat":
    Icon = IconWeChat;
    break;
  case "WeCom":
    Icon = IconWeCom;
    break;
  case "WhatsApp":
    Icon = IconWhatsApp;
    break;
  default:
    break
}

watch(() => info.modified, (value, oldValue) => {
  console.log(value, oldValue);
  // 只要二维码生成的时间迟于用户上次登录的时间，那么就发送通知。
  if (new Date(value) > new Date(info.loginAt || 0) && notificationShow.value)
    sendNotification(`${info.name} 二维码已刷新`, `${info.name} 的二维码发生了变化，请您扫描二维码重新登录！`, info.url)
})

async function exitProcess() {
  const res = await axios.post("/api/v1/exit", {adapter: info.name})
  console.log(res)
}

async function restartProcess() {
  const res = await axios.post("/api/v1/restart", {adapter: info.name})
  console.log(res)
}

async function logout() {
  const res = await axios.post("/api/v1/logout", {adapter: info.name})
  console.log(res)
}

async function sendNotification(title: string, message: string, icon?: string) {
  if (window.Notification) {
    if (window.Notification.permission == "granted") {
      new Notification(title, {
        body: message,
        icon
      })
    } else {
      const permission = await window.Notification.requestPermission()
      if (permission !== "granted") {
        console.error("授权失败, 当前状态为：", permission)
      } else {
        new Notification(title, {
          body: message,
          icon
        })
      }
    }
  }
}

</script>

<template>
  <div align="left" style="box-shadow: none;" class="card col-6 col border-primary border-5">
    <img :src="`${info.url}?t=${new Date(info.modified).getTime()}`" :alt="info.name">
    <div class="card-body">
      <h2 class="card-title"><i>
        <Icon></Icon>
      </i> {{ info.name }}
        <i @click="toggleNotification" style="cursor: pointer">
          <IconNotification v-show="notificationShow"></IconNotification>
          <IconNotificationOff v-show="!notificationShow"></IconNotificationOff>
        </i>
      </h2>
      <p class="card-subtitle qrcode-modifiedTime">⏰ 二维码生成时间：{{ new Date(info.modified).toLocaleString() }}</p>
      <p class="card-subtitle account-loginTime">⏰
        用户上次登录时间：{{ info.loginAt ? new Date(info.loginAt).toLocaleString() : "从未登录" }}</p>
      <p :class="`text-${info.status === 'online' ? 'success' : 'danger'}`">📜 进程状态：{{ info.status }}</p>
      <p :class="`text-${info.user.name ? info.user.status === 'online' ? 'success' : 'danger' : 'warning'}`">🐱
        用户：{{ info.user.name || "暂无用户登录" }}
        ({{ info.user.status }})</p>
      <button style="margin-bottom: 0.25rem; width: 100%;" class="restart-btn" @click="restartProcess"
              v-show="startButtonShow">启动
      </button>
      <button style="margin-bottom: 0.25rem; width: 100%;" class="logout-btn" @click="logout"
              v-show="logoutButtonShow">登出账户
      </button>
      <button style="width: 100%;" class="exit-btn" @click="exitProcess" v-show="exitButtonShow">退出进程</button>
    </div>
  </div>
</template>


<style scoped>

</style>
