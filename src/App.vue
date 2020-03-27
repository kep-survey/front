<template>
    <v-app id="app">
        <!-- 네비게이터 메뉴 -->
        <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app dark class="dark-primary py-12 px-10" width="300" style="z-index: 300">
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
                <router-view @refreshPreview="refreshPreview" @showTopAlert="showTopAlert" @showBottomAlert="showBottomAlert" @setPreview="setPreview" style="margin-top: 3.3rem; max-width: 1400px; width: 100%" class="fill-height" fluid></router-view>
            </v-container>
        </v-content>
        <!-- 프리뷰 -->
        <v-navigation-drawer :stateless="true" right v-model="preview" :clipped="$vuetify.breakpoint.lgAndUp" app class="preview-background py-12 px-10" width="450">
            <v-container align-center justify-center fill-height>
                <v-card class="chat-container chat-background elevation-6 d-flex flex-column pa-0" width="300" height="540"> 
                    <div class="px-3 py-4 mb-2 font-weight-bold">
                        카카오톡 프리뷰
                    </div>
                    <div class="flex-grow-1 px-3 pb-5" style="overflow: hidden">
                        <div style="height: 100%; overflow-y: auto; overflow-x: hidden;">
                            <v-row no-gutters>
                                <v-col cols="auto" class="mr-2 profile_thumb">
                                    <v-img width="30" height="30" src="@/assets/images/chat_thumb.jpg" style="border-radius: 12px;"></v-img>
                                </v-col>
                                <v-col cols="auto">
                                    <span class="profile_name font-weight-regular" style="font-size: 12px;">카카오 챗봇</span>
                                    <div class="chat-bubble">
                                        <span class="icon-bubble">
                                            <svg viewBox="0 0 12 14" style="fill: #fff">
                                                <g>
                                                    <path d="M0.966552734,3.28161621 C1.12122295,3.17869178 1.22477011,3.11011512 1.2771942,3.07588623 C3.37094947,1.70882569 7.2785514,0.683530274 13,0 C9,2.02897135 6.96226357,6.37863375 6.88679071,13.0489872 C6.8824443,13.4331262 6.8824443,13.7501305 6.88679071,14 L0.966552734,3.28161621 Z" transform="translate(6.5, 7.0) scale(-1, 1) translate(-6.5, -7.0)"></path>
                                                </g>
                                            </svg>
                                        </span>
                                        <div class="primary chat-box">
                                            <span>{{ previewData.description }}</span>
                                        </div>
                                    </div>
                                </v-col>
                                <v-col v-if="previewData.type ='choice'" cols="12" class="mt-2 px-5" align="center">
                                    <template v-for="option in previewData.options">
                                        <v-btn v-bind:key="option.id" class="quick-applies-btn ma-1 accent font-weight-regular dark-primary--text elevation-2" small rounded>{{ option.option }}</v-btn>
                                    </template>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                    <div class="px-2 py-2 primary">
                        <v-row no-gutters>
                            <v-col cols="auto" class="chat-input--text pr-2">
                                <v-icon>mdi-plus-box-outline</v-icon>
                            </v-col>
                            <v-col class="chat-input-field secondary chat-input--text">
                                <v-icon class="mr-1">mdi-emoticon-happy-outline</v-icon>
                                <span class="font-weight-black">#</span>
                            </v-col>
                        </v-row>
                    </div>
                </v-card>
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
        previewData: {
            description: '',
            type: '',
            options: []
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
        // preview 갱신
        refreshPreview(question){
            this.previewData.description = question.description
            this.previewData.type = question.type

            if(question.options != undefined){
                this.previewData.options = question.options
            } else{
                this.previewData.options = []
            }
        },

        setPreview(event){
            this.preview = event

            this.refreshPreview({ // 이전의 선택된 질문에 대한 정보를 덮어씀
                description : "질문을 추가하거나 선택해주세요",
                type : ''
            })
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

    .chat-container > div{
        width: 100%;
    }

    .chat-input-field {
        height: 30px; 
        border: 0.5px solid #eaeaea !important; 
        border-radius: 15px; 
        padding: 2px 12px !important;
        display : flex;
        align-items: center;
        justify-content: flex-end;
    }

    .chat-bubble{
        position: relative;
    }

    .icon-bubble{
        width: 12px; 
        height: 14px; 
        position: absolute; 
        top: 0; 
        left: -6px;
    }

    .icon-bubble > .svg{
        fill: #fff;
    }

    .chat-box{
        width : auto;
        position: relative; 
        border-radius: 12px; 
        font-size: 13px;
        padding: 6px 10px 7px;
        min-height: 32px;
        min-width: 20px;
        max-width: 200px;
    }

    .profile_name{
        padding-bottom: 6px;
        display: block;
    }

    .quick-applies-btn{
        max-width: 235px; 
        padding-top: 5px !important;
        padding-bottom: 5px !important;
        height: auto !important;
        min-height: 28px;
    }

    /* 다중라인용 */
    .quick-applies-btn > .v-btn__content{
        max-width: 100%;
        white-space: normal;
        word-break: break-all;
    }
</style>