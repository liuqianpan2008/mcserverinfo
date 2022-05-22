<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <n-layout :native-scrollbar="false"
                style="min-height: 590px;">

        <n-layout-header class="t">
          <n-space justify="space-between">
            <div>
              <n-gradient-text :size="24"
                               gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)">
                我的世界服务器状态查询
              </n-gradient-text>
            </div>
            <n-button-group>
              <n-button type="error"
                        @click="quit"
                        class="nt">关闭</n-button>
            </n-button-group>
          </n-space>
        </n-layout-header>
        <n-layout-content style="min-height: 520px;"
                          :native-scrollbar="false">
          <n-card title="搜索">
            <n-form ref="formRef"
                    :model="formValue"
                    label-placement="left">
              <n-form-item label="地址">
                <n-input v-model:value="formValue.host"
                         placeholder="请输入查询地址" />
              </n-form-item>
              <n-form-item label="端口">
                <n-input v-model:value="formValue.port"
                         placeholder="请输入查询端口" />
              </n-form-item>
              <n-form-item label="查询类型">
                <n-radio-group v-model:value="formValue.radioValue"
                               name="radiogroup">
                  <n-radio name="java"
                           value="java"
                           :checked="true">
                    java
                  </n-radio>
                  <n-popover trigger="hover">
                    <template #trigger>
                      <n-radio name="query"
                               value="query">
                        query(更多内容查询)
                      </n-radio>
                    </template>
                    <span>支持版本1.19以上需要在配置文件打开enable-query=true</span>
                  </n-popover>

                </n-radio-group>
              </n-form-item>

              <n-form-item>
                <n-button @click="sub"
                          :loading="isbtlogin"
                          :disabled="isbtlogin">开始查询</n-button>
              </n-form-item>
            </n-form>
          </n-card>
          <n-card title="查询结果"
                  v-show="issub"
                  embedded>
            <template #header-extra>
              <n-popover trigger="hover">
                <template #trigger>
                  <div>
                    <n-space>
                      <n-tag>延迟：{{resdate.roundTripLatency}}</n-tag>
                      <n-tag>在线人数：{{resdate.players.online}}/{{resdate.players.max}}</n-tag>
                    </n-space>
                  </div>
                </template>
                <div v-show="resdate.players.list!=null">
                  在线玩家：
                  <span v-for="(v,i) in resdate.players.list"
                        :key="i"
                        style="padding-left: 3px;">{{v}}</span>
                </div>
                <div v-show="resdate.players.sample!=null">
                  在线玩家：<br>
                  <span v-for="(v,i) in resdate.players.sample"
                        :key="i"
                        style="padding-left: 3px;">{{v.name}}<br v-if="i%3==0"></span>
                </div>
                <span v-show="resdate.players.list==null && resdate.players.sample==null">使用query可以查询到在线玩家列表</span>
              </n-popover>
            </template>
            <n-space justify="space-between">
              <n-image width="100"
                       :src="resdate.favicon" />
              <n-card>
                <div v-html="resdate.motd.html"></div>

                <n-tag v-show="resdate.plugins!=null">
                  插件：<span v-for="(v,i) in resdate.plugins"
                        :key="i"
                        style="padding-left: 3px;">
                    {{v}}
                  </span>
                </n-tag>
              </n-card>

            </n-space>
            <template #footer>
              <n-tag type="success">
                版本：{{resdate.version.name==null?resdate.version:resdate.version.name}}
              </n-tag>
            </template>
            <template #action>
            </template>
          </n-card>

        </n-layout-content>
        <n-layout-footer>
          <n-space justify="center">by:枫叶秋林 V0.0.1</n-space>
        </n-layout-footer>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<script>
import { ref } from '@vue/reactivity'
import axios from 'axios'
import { ipcRenderer } from 'electron'
// import { useMessage } from 'naive-ui'

export default {
  name: 'App',
  components: {},
  setup () {
    const formRef = ref()
    const formValue = ref({
      host: "",
      port: "",
      radioValue: null
    })
    const resdate = ref({
      version: {
        name: "未知"
      },

      favicon: null,
      motd: { html: "未知" },
      roundTripLatency: 999999,
      players: {
        online: 0,
        max: 0,
        sample: null,
        list: []
      },
      plugins: [],

    })
    // const message = useMessage()
    //"XIYE.WORLD"
    const issub = ref(false)
    const isbtlogin = ref(false)
    const errbut = ref(false)

    const sub = () => {
      isbtlogin.value = true
      var tapy = "";
      if (formValue.value.radioValue == "java") {
        tapy = "java"
      } else {
        tapy = "query"
      }
      // http://43.138.12.187:3300/mc/
      axios.get('http://127.0.0.1:3300/mc/' + tapy, {
        params: {
          host: formValue.value.host,
          port: formValue.value.port
        }
      }).then((ret) => {
        console.log(ret.data);
        if (ret.data.cod == "200") {
          errbut.value = false;
          isbtlogin.value = false
          resdate.value = ret.data.data
          issub.value = true
        } else {
          errbut.value = true;
          isbtlogin.value = false
          issub.value = true
          // message.error("查询失败");
        }
      }).catch(e => {
        errbut.value = true;
        console.log(e);
        // message.error(e)
        isbtlogin.value = false
      })
    }
    return {
      formRef, formValue, sub, resdate, issub, isbtlogin, quit: () => {
        ipcRenderer.send("close"), errbut
      }
    }
  }
}
</script>

<style>
.t {
  -webkit-app-region: drag;
}
.nt {
  -webkit-app-region: no-drag;
}
</style>
