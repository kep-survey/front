<template>
    <v-app id="app">
        <!-- 네비게이터 메뉴 -->
        <v-navigation-drawer v-model="drawer" app dark class="dark-primary py-12 px-10" width="300" style="z-index: 300">
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
        <v-app-bar :stateless="true" v-model="surveyAppBar" class="px-7" color="primary" style="z-index: 300"  :height="80" elevation="3" app clipped-right>
            <v-toolbar-title class="font-weight-bold">{{ surveyEntity.title }}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-dialog v-model="surveyEditDialog" max-width="700px" persistent>
                <template v-slot:activator="{ on }">
                    <v-btn :disabled="surveyEntity.status != 1" text class="font-weight-bold dark-primary--text" v-on="on" large>개요 편집</v-btn>
                </template>
                <div>
                    <v-tabs color="accent">
                        <v-tab>기본 정보 편집</v-tab>
                        <v-tab>참여 메시지 편집</v-tab>
                        <!-- eager: tab item을 lazy loading이 아니라 페이지 생성과 동시에 렌더링 되도록 한다 -->
                        <v-tab-item eager >
                            <!-- 기본 개요 편집 -->
                            <v-form ref="editSurveyProjectForm">
                                <v-card class="pa-5">
                                    <v-card-title class="font-weight-black">
                                        설문 개요 편집하기
                                    </v-card-title>
                                    <v-card-text>
                                        변경할 설문의 이름과 설명을 입력해주세요.
                                        <v-container class="mt-4">
                                            제목*
                                            <v-text-field :rules="titleRules" counter v-model="surveyEditInput.title" label="설문 시작시 노출될 제목을 입력해주세요" solo color="accent" class="mt-3" clearable required></v-text-field>
                                            설명*
                                            <v-text-field :rules="descRules" counter v-model="surveyEditInput.description" label="해당 설문의 설명을 입력해주세요" solo color="accent" class="mt-3" clearable required></v-text-field>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text @click="cancelInput">
                                            취소
                                        </v-btn>
                                        <v-btn text @click="validateAndSubmit">
                                            변경
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-form>
                        </v-tab-item>
                        <v-tab-item eager >
                            <!-- 설문 참여 메시지 -->
                            <v-form ref="editSurveyMsgForm">
                                <v-card class="pa-5">
                                    <v-card-title class="font-weight-black">
                                        설문 참여메시지 설정
                                    </v-card-title>
                                    <v-card-text>
                                        설문에서 응답자에게 노출되는 메시지를 설정 할 수 있습니다.
                                        <v-container class="mt-4">
                                            환영메시지
                                            <v-textarea :rules="msgRules" counter solo v-model="surveyEditInput.welcomeMsg" label="설문 시작 시 응답자에게 노출되는 메시지를 설정해주세요" color="accent" class="mt-3"></v-textarea>
                                            종료메시지
                                            <v-textarea :rules="msgRules" counter solo v-model="surveyEditInput.completeMsg" label="설문 종료 시 응답자에게 노출되는 메시지를 설정해주세요" color="accent" class="mt-3"></v-textarea>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text @click="cancelInput">
                                            취소
                                        </v-btn>
                                        <v-btn text @click="validateAndSubmit">
                                            변경
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-form>
                        </v-tab-item>
                    </v-tabs>
                </div>
            </v-dialog>
            <v-dialog v-model="surveyDeployDialog" max-width="500" persistent>
                <template v-slot:activator="{ on : dialog }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on : tooltip }">
                            <v-btn :disabled="surveyEntity.status == 3 ? true : false" v-on="{...tooltip, ...dialog}" class="ml-4 font-weight-black dark-primary--text" depressed large color="accent">{{ surveyEntity.status === 1 ? "배포하기" : (surveyEntity.status === 2 ? "설문 진행중" : "설문 종료") }}</v-btn> 
                        </template>
                        <span>
                            {{ 
                                (surveyEntity.status === 1 ? 
                                "설문을 배포하면 사용자가 설문에 참여할 수 있습니다" : 
                                "설문이 진행중이거나 종료 됐을경우 편집 기능은 비활성화됍니다.") 
                            }}
                        </span>
                    </v-tooltip>
                </template>
                <v-card>
                    <v-card-title class="font-weight-black dark-primary--text">{{ (surveyEntity.status === 1 ? "설문을 배포하시겠습니까?" : "설문을 종료하시겠습니까?") }}</v-card-title>
                    <v-card-text>
                        {{ 
                            (surveyEntity.status === 1 ? 
                            "설문을 배포하면 사용자가 설문에 참여할 수 있으며 더 이상 내용을 수정할 수 없습니다. 진행하시겠습니까?" : 
                            "설문을 종료하면 사용자가 더 이상 설문에 참여할 수 없습니다. 진행하시겠습니까?") 
                        }}
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="surveyDeployDialog = false">취소</v-btn>
                    <v-btn text @click="deploySurvey">{{ (surveyEntity.status === 1 ? "배포" : "설문 종료") }}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-app-bar>
        <!-- 페이지 라우터 -->
        <v-content id="content-container">
            <v-container justify-center class="fill-height secondary pa-12" fluid>
                <router-view :surveyStatus="surveyEntity.status"  @initPage="initPage" @setSurveyAppBar="setSurveyAppBar" @refreshPreview="refreshPreview" @showTopAlert="showTopAlert" @showBottomAlert="showBottomAlert" @setPreview="setPreview" style="margin-top: 1rem; max-width: 1400px; width: 100%" class="fill-height" fluid></router-view>
            </v-container>
        </v-content>
        <!-- 프리뷰 -->
        <v-navigation-drawer :stateless="true" right v-model="preview" app clipped class="preview-background py-12 px-10" width="450">
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
        surveyEditDialog: false,
        surveyDeployDialog: false,
        surveyInputVaild: true, 
        questionsInputVaild: true, 

        // 입력란 규칙 정의
        titleRules: [
            v => !!v || '설문 제목은 필수 사항입니다!',
            v => (v && v.length <= 20) || '설문 제목은 20자를 넘길 수 없습니다!',
        ],
        descRules: [
            v => !!v || '설문 설명은 필수 사항입니다!',
            v => (v && v.length <= 255) || '설문 설명은 255자를 넘길 수 없습니다!',
        ],
        msgRules: [
            v => ((v || '' ).length <= 255) || '설문 메세지는 255자를 넘길 수 없습니다!'
        ],
        questionRules: [
            v => !!v || '질문은 필수 사항입니다!',
            v => (v && v.length <= 70) || '질문은 70자를 넘길 수 없습니다!',
        ],
        optionRules: [
            v => !!v || '옵션 텍스트는 필수 사항입니다!',
            v => (v && v.length <= 14) || '옵션은 14자를 넘길 수 없습니다!',
        ],
        surveyEditInput: { // 저장전의 입력값
            title: "",
            description: "",
            welcomeMsg: "",
            completeMsg: ""
        },
        surveyEntity: { // 실제 프로젝트 설정값
            title: "",
            description: "",
            welcomeMsg: "",
            completeMsg: "",
            status : 1
        },

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
        surveyAppBar : false,
        surveyId: 0,
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
                { text: '설문 결과 조회', path: '/survey/result' },
                { text: 'Dashboard', path: '/dashboard', icon: "mdi-arrow-left-bold-circle", bottom : true, bold : true}
            ]
        },
    }),
    methods: {
         // 설문 개요 편집 및 전송
        validateAndSubmit() {
            if (this.$refs.editSurveyProjectForm.validate() && this.$refs.editSurveyMsgForm.validate()) {
                this.setSurveyInfo()
                this.surveyEditDialog = false
            }
        },
        cancelInput() {
            this.surveyEditDialog = false
            this.surveyEditInput.title = this.surveyEntity.title
            this.surveyEditInput.description = this.surveyEntity.description
            this.surveyEditInput.welcomeMsg = this.surveyEntity.welcomeMsg
            this.surveyEditInput.completeMsg = this.surveyEntity.completeMsg
        },
        // 설문 배포 설정하기
        deploySurvey() {
            this.surveyDeployDialog = false

            const url = 'http://localhost:8081/api/openSurvey'
            const param = {
                surveyId: this.surveyId, 
                status: this.surveyEntity.status + 1,
            }
            const header = {
                'Content-Type': 'application/json'
            }
            // api call
            this.$http.post(url, param, header).then(response => {
                if (response.data.result === 'true') {
                    if (this.surveyEntity.status === 2) {
                        this.surveyEntity.status = 3;
                        this.showTopAlert('success', '설문이 정상적으로 종료되었습니다!');
                    } else {
                        this.surveyEntity.status = 2;
                        this.showTopAlert('success', '설문이 정상적으로 배포되었습니다!');
                    }
                } else {
                    this.showTopAlert('error','배포 과정에 오류가 발생했습니다. 다시 시도해주세요.');
                }
            }).catch(function() {
                this.showTopAlert("error", "데이터를 받아오지 못했습니다. 잠시후 다시 시도해주세요.")
            })
        },
        // 설문 이름, 설명 저장하기
        setSurveyInfo() {
            const url = 'http://localhost:8081/api/setSurveyInfo'
            const param = {
                surveyId: this.surveyId, 
                title: this.surveyEditInput.title,
                description: this.surveyEditInput.description,
                welcomeMsg: this.surveyEditInput.welcomeMsg,
                completeMsg: this.surveyEditInput.completeMsg
            }
            const header = {
                'Content-Type': 'application/json'
            }
            // api call
            this.$http.post(url, param, header).then(response => {
                if(response.data.result){
                    this.showTopAlert("success", "성공적으로 프로젝트가 변경됐습니다!")
                    this.getSurveyInfo()
                } else {
                    this.showTopAlert("error", response.data.msg)
                }
            }).catch(function() {
                this.showTopAlert("error", "데이터를 받아오지 못했습니다. 잠시후 다시 시도해주세요.")
            })
        },
        // 설문 이름, 설명 가져오기
        getSurveyInfo() {
            const url = 'http://localhost:8081/api/getSurveyInfo'
            const config = {
                params : {
                    surveyId: this.surveyId 
                }
            }

            // api call
            this.$http.get(url, config).then(response => {
                if(response.data.result){
                    this.surveyEntity.title = response.data.info.title
                    this.surveyEntity.description = response.data.info.description
                    this.surveyEntity.welcomeMsg = response.data.info.welcomeMsg
                    this.surveyEntity.completeMsg = response.data.info.completeMsg
                    this.surveyEntity.status = response.data.info.status


                    this.surveyEditInput.title = response.data.info.title
                    this.surveyEditInput.description = response.data.info.description
                    this.surveyEditInput.welcomeMsg = response.data.info.welcomeMsg
                    this.surveyEditInput.completeMsg = response.data.info.completeMsg
                } else {
                    this.showTopAlert("error", response.data.msg)
                }
            }).catch(function() {
                this.showTopAlert("error", "데이터를 받아오지 못했습니다. 잠시후 다시 시도해주세요.")
            })
        },
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
        // 프리뷰 설정
        setPreview(flag){
            this.preview = flag

            this.refreshPreview({ // 이전의 선택된 질문에 대한 정보를 덮어씀
                description : "질문을 추가하거나 선택해주세요",
                type : ''
            })
        },
        initPage(surveyId, preview, appBar){
            this.surveyId = surveyId
            if(surveyId > 0){
                this.getSurveyInfo()
            }
            this.setPreview(preview)
            this.setSurveyAppBar(appBar)
        },
        // 프로젝트 App bar 설정
        setSurveyAppBar(flag){
            this.surveyAppBar = flag
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