<script setup lang="ts">
import './assets/paper.css'
import {onMounted, reactive} from "vue";
import axios from "axios";
import type {AdapterInfo} from "@/types";
import AdapterCard from "@/components/AdapterCard.vue";

const adapterInfo = reactive<AdapterInfo[]>([]);


onMounted(() => {
  getAdapterInfo()
  setInterval(getAdapterInfo, 5000)
})

async function getAdapterInfo() {
  const res = await axios.get("/api/v1/info")
  // adapterInfos = reactive<AdapterInfo[]>(res.data.data);
  const newInfo = res.data.data.filter((p: AdapterInfo) => !adapterInfo.find(ai => ai.name === p.name)) || []
  adapterInfo.forEach((ai) => {
    const info: AdapterInfo = res.data.data.find((p: AdapterInfo) => p.name === ai.name)
    if (info) {
      ai.url = info.url
      ai.loginAt = info.loginAt
      ai.user.name = info.user.name
      ai.user.status = info.user.status
      ai.modified = info.modified
      ai.status = info.status
    }
  })
  newInfo.forEach((info: AdapterInfo) => adapterInfo.push(info))
}
</script>

<template>
  <header>
    <nav class="border fixed split-nav">
      <div class="nav-brand">
        <h3><a href="#">IM-Aggregation</a></h3>
      </div>
      <div class="collapsible">
        <div class="collapsible-body">
          <ul class="inline">
            <li>
              <a href="https://github.com/wechaty/im-aggregation#readme">📄 文档</a>
            </li>
            <li>
              <a href="https://github.com/TankNee">🫂 关于作者</a>
            </li>
            <li>
              <a href="https://github.com/wechaty/im-aggregation">🧱 仓库</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <main style="background-image: url(/imgs/bg.png)">
    <div class="paper container container-lg" style="margin: 4.5rem auto">
      <h1 align="center">🎨 Wechaty 消息聚合应用</h1>
      <div class="alert alert-success">
        🚀 请使用下面展示的二维码进行登录。
      </div>
      <div id="qrcode" class="row" align="center">
        <AdapterCard v-for="info in adapterInfo" :info="info"></AdapterCard>
      </div>
    </div>
  </main>
</template>

<style scoped>
</style>
