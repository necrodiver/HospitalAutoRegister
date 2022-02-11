<template lang="pug">
ALayout.parent
    ALayoutHeader.header
        .logo
        AMenu.menu(theme='light', mode='horizontal', v-model:selectedKeys='selectedKeys', @click='selectItem')
            AMenuItem(key='1') 初始选择
            AMenuItem(key='2') 刷
            AMenuItem(key='3') 关于
        .logout
    ALayoutContent.content
        .content-child
            slot
    ALayoutFooter.footer(:style='{ textAlign: "center" }')
        | 注意：本程序只供学习交流之用,由此产生任何纠纷由使用者自己承担!本人概不负责！
        <br />
        | 另外，请求频次太高将会被封号，请注意设定好自己的请求频率（代码已作限制至少请求频率为1000ms）
</template>
<script setup>
import { Layout, LayoutHeader, Menu, MenuItem, LayoutContent, BreadcrumbItem, LayoutFooter } from 'ant-design-vue';
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
const selectedKeys = ref(['1']);
watch(route, val => {
    if (val.name === 'index') {
        selectedKeys.value = ['1'];
    } else if (val.name === 'set') {
        selectedKeys.value = ['2'];
    } else if (val.name === 'about') {
        selectedKeys.value = ['3'];
    }
});

function selectItem({ key }) {
    if (key === '1' && route.name !== 'index') {
        router.push({
            name: 'index'
        });
    }
    if (key === '2' && route.name !== 'set') {
        router.push({
            name: 'set'
        });
    }
    if (key === '3' && route.name !== 'about') {
        router.push({
            name: 'about'
        });
    }
}
</script>
<style lang="sass" scoped>
.parent
    height: 100%
.header
    display: flex
    justify-content: flex-start
    align-items: center
    background-color: #fff
    border-bottom-left-radius: 20px
    border-bottom-right-radius: 20px
.logo
    padding-left: 20px
.content
    background-color: #eee
    padding: 36px
    min-height: 520px
    min-width: 800px
    .content-child
        background-color: #fff
        border-radius: 20px
        height: 100%
.footer
    color: #aaa
    line-height: 20px
    background-color: #ddd
    border-top: 1px solid #ccc
.logout
    padding-right: 8px
</style>
