<template>
    <v-app id="app">
        <!-- 네비게이터 메뉴 -->
        <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app dark class="darkPrimary py-12 px-10" width="300" style="z-index: 300">
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
                        <v-list-item v-bind:key="index" v-if="!item.bottom" :to="routePageSurveyId(item.path)"  active-class="accent--text font-weight-bold" link>
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
                        <v-list-item justify-end v-bind:key="index" v-if="item.bottom" :to="item.path" active-class="accent--text" link>
                            <v-icon v-if="item.icon" left>{{ item.icon }}</v-icon>
                            <v-list-item-title class="nav-bottom-text" v-bind:class="{ 'font-weight-bold' : item.bold }">
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                </v-list>
            </v-layout>
        </v-navigation-drawer>
        <!-- 페이지 라우터 -->
        <v-content id="content-container" >
            <v-container justify-center class="fill-height secondary pa-12" fluid>
                <router-view @showTopAlert="showTopAlert" @showBottomAlert="showBottomAlert" @setPreview="preview = $event" style="margin-top: 3.3rem; max-width: 1400px; width: 100%" class="fill-height" fluid></router-view>
            </v-container>
        </v-content>
        <!-- 프리뷰 -->
        <v-navigation-drawer :stateless="true" right v-model="preview" :clipped="$vuetify.breakpoint.lgAndUp" app class="previewBackground py-12 px-10" width="400">
            <v-container align-center justify-center fill-height>
                <v-img max-width="300px" src="@/assets/images/preview_phone.png"></v-img>
            </v-container>
        </v-navigation-drawer>

        <!-- top 알림창 -->
        <v-snackbar v-model="topAlert.show" :top="true" :multi-line="true" :color="topAlert.type" :timeout="topAlert.timeout" class="mb-12">
            {{ topAlert.text }}
            <v-btn dark text @click="topAlert.show = false">Close</v-btn>
        </v-snackbar>

        <!-- bottom 알림창 -->
        <v-snackbar v-model="bottomAlert.show" :bottom="true" :multi-line="true" :color="bottomAlert.type" :timeout="bottomAlert.timeout" class="mb-12">
            {{ topAlert.text }}
            <v-btn dark text @click="bottomAlert.show = false">Close</v-btn>
        </v-snackbar>
  </v-app>
</template>

<script>

export default {
    props: {
        source: String,
    },
    data: () => ({
        // 알림창(snackbar) 속성 지정
        topAlert: {
            show: false,
            type: "success",
            text: "msg",
            timeout : 1000
        },
        bottomAlert: {
            show: false,
            type: "success",
            text: "msg",
            timeout : 1000
        },
        preview : false,
        dialog: false,
        drawer: null,
        items: {
            // 라우팅
            main : [
                { text: 'Dashboard', path: '/dashboard' },
                { text: '설문 현황', path: '/status' }
            ],
            survey: [
                { text: '내 설문 편집', path: '/survey/edit' },
                { text: '배포', path: '/survey/deploy' },
                { text: '설문 결과 조회', path: '/survey/result' },
                { text: 'Dashboard', path: '/dashboard', icon: "mdi-arrow-left-bold-circle", bottom : true, bold : true}
            ]
        },
    }),
    methods: {
        route(items) {
            let routePath = this.$route.path
        
            for(var i in items.main){ // in 키워드 사용할시 undefined
                if (routePath == items.main[i].path){ // main 계열 요청일 경우
                    return items.main
                }
            }
            return items.survey
        },

        // 상단 알림창 보이기
        showTopAlert(type, text, timeout=3000){
            // success, info, warning, error
            this.topAlert.type=type
            this.topAlert.text = text
            this.topAlert.show = true
            this.topAlert.timeout = timeout
        },
        // 하단 알림창 보이기
        showBottomAlert(type, text, timeout=3000){
            // success, info, warning, error
            this.bottomAlert.type=type
            this.bottomAlert.text = text
            this.bottomAlert.show = true
            this.bottomAlert.timeout = timeout
        },
        routePageSurveyId(path){
            if(this.$route.params.survey_id){
                return path+"/"+this.$route.params.survey_id
            }
            return path
        }
    },
}
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR:300,400,500,700,900&display=swap');

    * {
        font-family : "Noto Sans KR", sans-serif !important;
    }

    .v-dialog {
        box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12) !important;
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
</style>