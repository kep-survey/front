<template>
    <v-app id="app">
        <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app dark class="darkPrimary py-12 px-10" width="300">
            <v-layout justify-space-between column fill-height>
                <!-- 상단 메뉴 -->
                <v-list flat>
                    <v-list-item class="pb-10">
                        <v-list-item-content>
                            <v-list-item-title class="logo-title">
                                kakao
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <template v-for="(item, index) in route(items)">
                        <v-list-item v-bind:key="index" v-if="!item.bottom" :to="{name : item.link}"  active-class="accent--text font-weight-bold" link>
                            <v-icon v-if="item.icon" left>{{ item.icon }}</v-icon>
                            <v-list-item-title class="nav-text" v-bind:class="{ 'font-weight-bold' : item.bold }">
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                </v-list>
                <!-- 하단 메뉴 -->
                <v-list flat>
                    <template v-for="(item, index) in route(items)">
                        <v-list-item justify-end v-bind:key="index" v-if="item.bottom" :to="{name : item.link}" active-class="accent--text" link>
                            <v-icon v-if="item.icon" left>{{ item.icon }}</v-icon>
                            <v-list-item-title class="nav-bottom-text" v-bind:class="{ 'font-weight-bold' : item.bold }">
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                </v-list>
            </v-layout>
        </v-navigation-drawer>

        <v-content id="content-container">
            <v-container class="fill-height secondary pa-12" fluid>
                <router-view style="margin-top: 3.3rem" class="fill-height" fluid></router-view>
            </v-container>
        </v-content>
  </v-app>
</template>

<script>

export default {
    props: {
        source: String,
    },
    data: () => ({
        dialog: false,
        drawer: null,
        items: {
            // 라우팅
            main : [
                { text: 'Dashboard', link: 'dashboard' },
                { text: '설문 현황', link: 'status' }
            ],
            survey: [
                { text: '내 설문 편집', link: 'surveyEdit' },
                { text: '배포', link: 'surveyDeploy' },
                { text: '설문 결과 조회', link: 'surveyResult' },
                { text: 'Dashboard', link: 'dashboard', icon: "mdi-arrow-left-bold-circle", bottom : true, bold : true}
            ]
        },
    }),
    methods: {
        route: function(items) {
            let routeName = this.$route.name
            for(let i = 0; i < items.main.length; i++){ // in 키워드 사용할시 undefined
                if (routeName == items.main[i].link){ // main 계열 요청일 경우
                    return items.main
                }
            }
            return items.survey
        }
    },
}
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR:300,400,500,700,900&display=swap');

    * {
        font-family : "Noto Sans KR", sans-serif !important;
    }

    .logo-title{
        font-size: 2.15rem !important;
    }

    .nav-text{
        font-size: 1rem !important;
    }

    .nav-bottom-text{
        font-size: 1.25rem !important;
    }

    #content-container *{
        color : #2E2E2E;
    }
</style>