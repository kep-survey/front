<template>
    <div class="dashboard" >
        <!-- 프로젝트 개요란 -->
        <v-container class="mb-8 py-0">
            <v-row justify="space-between">
                <v-col>
                    <h1><span class="font-weight-light">설문</span>목록</h1>
                </v-col>
                <v-col cols="auto">
                    <v-dialog v-model="newSurveyDialog" max-width="700px" persistent>
                        <template v-slot:activator="{ on }">
                             <v-btn color="accent" class="font-weight-black darkPrimary--text elevation-3" v-on="on" large>
                                <v-icon class="mr-2">mdi-pencil</v-icon>새로운 설문
                            </v-btn>
                        </template>
                        <!-- 설문 제작 창 -->
                        <v-form ref="newSurveyForm" v-model="surveyInputVaild">
                            <v-card class="pa-5">
                                <v-card-title class="font-weight-black">
                                    새로운 설문 만들기
                                </v-card-title>
                                <v-card-text>
                                    설문의 이름과 설명을 작성해주세요.
                                    <v-container class="mt-4">
                                        제목*
                                        <v-text-field :rules="titleRules" v-model="newSurvey.title" solo label="설문 제목을 입력해주세요" color="accent" class="mt-3" clearable required></v-text-field>
                                        설명*
                                        <v-text-field :rules="descRules" v-model="newSurvey.description" solo label="설문 설명을 입력해주세요" color="accent" class="mt-3" clearable required></v-text-field>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn text @click="cancelInput">
                                        취소
                                    </v-btn>
                                    <v-btn text @click="validateAndSubmit">
                                        만들기
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-form>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-container>
        <!-- 설문 프로젝트 리스트 출력 -->
        <v-container style="background-color: none !important;" flat>
            <template v-for="survey in surveys">
                <v-card v-bind:key="survey.id" :to="'/survey/edit/'+survey.id" class="mb-6 elevation-4 py-2 px-6" link tile>
                    <v-container>
                        <v-row justify="space-between">
                            <!-- 이름, 설명, 총 응답수 -->
                            <v-col>
                                <v-container class="pa-0">
                                    <v-card-title class="survey-list-title font-weight-black pa-0 pb-7">
                                        {{ survey.title }}
                                    </v-card-title>
                                    <v-card-subtitle class="pa-0 font-weight-bold">
                                        {{ survey.description }} 
                                    </v-card-subtitle>
                                    <v-card-text class="pa-0">
                                        총 응답 {{ survey.sumAnswer }}개
                                    </v-card-text>
                                </v-container>
                            </v-col>
                            <!-- 프로젝트 옵션 -->
                            <v-col cols="auto" align-self="center">
                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-btn icon v-on:click.prevent="" v-on="on" x-large>
                                            <v-icon class="fill-height" color="accent" x-large>mdi-menu</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item class="px-5" @click="deleteSurvey(survey.id)">
                                            <v-list-item-title>
                                                <v-icon class="mr-2">mdi-delete</v-icon> 삭제
                                            </v-list-item-title>
                                        </v-list-item>
                                        <v-list-item to="" class="px-5">
                                            <v-list-item-title>
                                                <v-icon class="mr-2">mdi-file-chart</v-icon> 결과 조회
                                            </v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </template>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: 'Dashboard',
        components: {},
        data: () => ({
            newSurveyDialog: false,
            surveyInputVaild: true, 
            drawer: null,

            newSurvey: {
                title: '',
                description: ''
            },

            // 입력란 규칙 정의
            titleRules: [
                v => !!v || '설문 제목은 필수 사항입니다!',
                v => (v && v.length <= 50) || '설문 제목은 50자를 넘길 수 없습니다!',
            ],
            descRules: [
                v => !!v || '설문 설명은 필수 사항입니다!',
                v => (v && v.length <= 70) || '설문 설명은 70자를 넘길 수 없습니다!',
            ],

            // 사용되는 데이터들
            surveys: [],
        }),

        methods:  {
            // 입력값 검증
            validateAndSubmit() {
                if(this.$refs.newSurveyForm.validate()){
                    this.createSurvey()
                }
            },
            // 입력 취소 및 초기화
            cancelInput() {
                this.newSurveyDialog = false
                this.$refs.newSurveyForm.reset() 
            },

            // 상단 알림창 보이기
            showTopAlert(type, text, timeout=3000){
                // success, info, warning, error
                this.$emit('showTopAlert', type, text, timeout)
            },
            // 하단 알림창 보이기
            showBottomAlert(type, text, timeout=3000){
                // success, info, warning, error
                this.$emit('showBottomAlert', type, text, timeout)
            },

            createSurvey() {
                const url = '/api/createSurvey'
                const param = {
                    title: this.newSurvey.title,
                    description: this.newSurvey.description
                }
                const header = {
                    'Content-Type': 'application/json'
                }

                this.$http.post(url, param, header).then(response => {
                    if(response.data.result){
                        this.showTopAlert("success", "성공적으로 프로젝트가 생성됐습니다!")
                        this.setSurveyList()
                    } else {
                        this.showTopAlert("error", response.data.msg)
                    }
                    this.newSurveyDialog = false
                }).catch(function() {
                    this.showTopAlert("error", "데이터를 받아오지 못했습니다. 잠시후 다시 시도해주세요.")
                })
            },
            setSurveyList() { 
                // api call
                this.$http.get('/api/getSurveyList').then(response => {
                    if(response.data.result){
                        this.surveys = response.data.list
                    } else {
                        this.showTopAlert("error", response.data.msg)
                    }
                }).catch(function() {
                    this.showTopAlert("error", "데이터를 받아오지 못했습니다. 잠시후 다시 시도해주세요.")
                })
            },

            deleteSurvey(id) {
                const url = '/api/deleteSurvey'
                const param = {
                    surveyId: id,
                }
                const header = {
                    'Content-Type': 'application/json'
                }

                this.$http.post(url, param, header).then(response => {
                    if(response.data.result){
                        this.showTopAlert("success", "성공적으로 프로젝트가 삭제됐습니다!")
                        this.setSurveyList()
                    } else {
                        this.showTopAlert("error", response.data.msg)
                    }
                    this.newSurveyDialog = false
                }).catch(function() {
                    this.showTopAlert("error", "데이터를 받아오지 못했습니다. 잠시후 다시 시도해주세요.")
                })
            }
        },
        created: function(){
            this.setSurveyList()
        },
    }
</script>

<style>
    .survey-list-title {
        font-size: 1.4rem !important;
    }
</style>
