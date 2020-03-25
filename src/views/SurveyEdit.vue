<template>
    <div class="surveyEdit">
        <!-- 설문 개요 -->
        <v-container class="mb-12 py-0">
            <v-row justify="space-between" >
                <v-col>
                    <h1>{{ survey.title }}</h1>
                </v-col>
                <v-col cols="auto">
                    <v-btn color="accent" class="font-weight-black darkPrimary--text elevation-3" @click="saveSurvey" large>
                        <v-icon class="mr-2">mdi-content-save-all</v-icon> 저장하기
                    </v-btn>
                </v-col>
                <v-col cols="auto">
                    <v-dialog v-model="newSurveyDialog" max-width="700px" persistent>
                        <template v-slot:activator="{ on }">
                            <v-btn color="accent" class="font-weight-black darkPrimary--text elevation-3" v-on="on" large>
                                <v-icon class="mr-2">mdi-square-edit-outline</v-icon> 개요 편집
                            </v-btn>
                        </template>

                        <!-- 개요 편집 창 -->
                        <v-form ref="newSurveyForm" v-model="surveyInputVaild">
                            <v-card class="pa-5">
                                <v-card-title class="font-weight-black">
                                    설문 개요 편집하기
                                </v-card-title>
                                <v-card-text>
                                    변경할 설문의 이름과 설명을 입력해주세요.
                                    <v-container class="mt-4">
                                        제목*
                                        <v-text-field :rules="titleRules" v-model="survey_input.title" solo color="accent" class="mt-3" clearable required></v-text-field>
                                        설명*
                                        <v-text-field :rules="descRules" v-model="survey_input.description" solo color="accent" class="mt-3" clearable required></v-text-field>
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
                    </v-dialog>
                </v-col>
            </v-row>
        </v-container>

        <!-- 알림창 -->
        <v-snackbar v-model="topAlert.show" :top="true" :multi-line="true" :color="topAlert.type" :timeout="topAlert.timeout" class="mb-12">
            {{ topAlert.text }}
            <v-btn dark text @click="topAlert.show = false">Close</v-btn>
        </v-snackbar>

        <!-- 설문 빌더 -->
        <v-form ref="questionForm" v-model="questionsInputVaild">
            <v-container style="background-color: none !important;" flat>
                <draggable :list="questions" @end="updateQuestionsOrder" drragable=".v-card" handle=".drag-handle">
                    <transition-group>
                        <template v-for="question in questions">
                            <!-- 객관식 -->
                            <v-card v-bind:key="question.id" class="elevation-5 py-2 px-6" style="margin-bottom: 70px; border-radius:5px;" tile>
                                <v-container v-if="question.type=='choice'">
                                    <v-btn color="primary" class="elevation-4 darkPrimary--text font-weight-black" style="margin-top: -70px;" large>
                                        <v-icon class="mr-2">mdi-checkbox-marked-circle</v-icon> 객관식
                                    </v-btn>
                                    <v-container class="pt-3">
                                        <!-- 질문 입력란 -->
                                        <v-row>
                                            <v-col cols="auto" class="py-0">
                                                <h1 class="font-weight-black">Q{{ question.questionOrder + 1}}. </h1> 
                                            </v-col>
                                            <v-col class="py-0">
                                                <v-text-field :rules="questionRules" v-model="question.description" solo color="accent" class="font-weight-black" clearable rounded required></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <!-- 옵션 입력란 -->
                                        <v-row>
                                            <v-col cols="auto" class="py-0">
                                                <h1 class="font-weight-black">A.</h1> 
                                            </v-col>
                                            <v-col class="py-0">
                                                <!-- Vue.draggable, 옵션 리스트 이동 가능-->
                                                <draggable v-model="question.options" @end="updateOptionOrder(question.questionOrder)" handle=".v-input__append-outer">
                                                    <transition-group>
                                                        <template v-for="option in question.options">
                                                            <v-row class="mb-3" v-bind:key="option.id">
                                                                <v-col cols="auto" class="py-0">
                                                                    <p class="ma-0" style="font-size: 1.5rem">{{ option.optionOrder + 1  }}.</p>
                                                                </v-col>
                                                                <v-col class="py-0">
                                                                    <v-text-field :rules="optionRules" append-icon="mdi-delete" @click:append="deleteOption(question.questionOrder, option.optionOrder)" append-outer-icon="mdi-drag-variant" v-model="option.option" class="mt-0 pt-0"  color="accent" single-line clearable>
                                                                    </v-text-field>
                                                                </v-col>
                                                            </v-row>
                                                        </template>
                                                    </transition-group>
                                                </draggable>
                                                <v-btn @click="addOption(question.questionOrder)" class="mt-3 elevation-3 darkPrimary font-weight-black" color="primary" large>
                                                    <v-icon class="mr-2">mdi-plus</v-icon> 옵션 추가
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-container>
                                <!-- 주관식 -->
                                <v-container v-if="question.type=='text'" class="py-12">
                                    <v-btn color="primary" class="elevation-4 darkPrimary--text font-weight-black" style="margin-top: -140px;" large>
                                        <v-icon class="mr-2">mdi-tooltip-text</v-icon> 주관식
                                    </v-btn>
                                    <!-- 질문 입력란 -->
                                    <v-container class="py-0">
                                        <v-row >
                                            <v-col cols="auto" class="py-0">
                                                <h1 class="font-weight-black">Q{{ question.questionOrder + 1 }}. </h1> 
                                            </v-col>
                                            <v-col class="py-0">
                                                <v-text-field :rules="questionRules" v-model="question.description" solo color="accent" class="font-weight-black" clearable rounded required></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-container>
                                <!-- 질문 요소 컨트롤 -->
                                <v-container class="elevation-4 primary px-0 py-3" style="width: 45px; position: absolute; top: 50%; right: 0; transform: translate(50%, -50%); border-radius:5px;" >
                                    <v-row class="ma-0 fill-height">
                                        <v-col class="px-0 py-2" align="center">
                                            <v-btn icon class="drag-handle">
                                                <v-icon>mdi-drag-variant</v-icon>
                                            </v-btn>
                                        </v-col>

                                        <v-col class="px-0 py-2" align="center">
                                            <v-btn icon @click="copyQuestion(question.questionOrder)">
                                                <v-icon>mdi-content-copy</v-icon>
                                            </v-btn>
                                        </v-col>

                                        <v-col class="px-0 py-2" align="center">
                                            <v-btn icon @click="deleteQuestion(question.questionOrder)">
                                                <v-icon>mdi-delete</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                            <!-- 주관식 -->
                        </template>
                    </transition-group>
                </draggable>
            </v-container>
        </v-form>
        <!-- 하단 컨텐츠 추가 박스 -->
        <template>
            <v-container class="bottom-box accent elevation-3">
                <v-row class="px-4">
                    <v-col cols="auto" align="center" class="py-1">
                        <v-btn @click="addQuestionsChoice" class="primary darkPrimary--text elevation-4 font-weight-black">
                            <v-icon class="mr-2">mdi-checkbox-marked-circle</v-icon> 객관식
                        </v-btn>
                    </v-col>
                    <v-col cols="auto" align="center" class="py-1">
                        <v-btn @click="addQuestionsText" class="primary darkPrimary--text elevation-4 font-weight-black">
                            <v-icon class="mr-2">mdi-tooltip-text</v-icon> 주관식
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </template>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    
    export default {
        name: 'SurveyEdit',
        components: {draggable},
        data: () => ({
            tempQuestionsId: 0, // 저장안된 질문들의 임시 id 할당용, 항상 음수의 값을 가짐
            tempOptionId: 0, // 저장안된 객관식 옵션들의 임시 id 할당용, 항상 음수의 값을 가짐
            newSurveyDialog: false,
            surveyInputVaild: true, 
            questionsInputVaild: true, 
            drawer: null,

            // 알림창(snackbar) 속성 지정
            topAlert: {
                show: false,
                type: "success",
                text: "msg",
                timeout : 1000
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
            questionRules: [
                v => !!v || '질문은 필수 사항입니다!',
                v => (v && v.length <= 70) || '질문은 70자를 넘길 수 없습니다!',
            ],
            optionRules: [
                v => !!v || '옵션 텍스트는 필수 사항입니다!',
                v => (v && v.length <= 14) || '옵션은 14자를 넘길 수 없습니다!',
            ],
            survey_input: {
                title: "",
                description: ""
            },
            survey: {
                title: "",
                description: ""
            },
            questions: [], // order로 정렬된 질문 리스트
            save: []
        }),

        methods:  {
            // 설문 개요 편집 및 전송
            validateAndSubmit() {
                if (this.$refs.newSurveyForm.validate()) {
                    this.setSurveyInfo()
                    this.newSurveyDialog = false
                }
            },
            cancelInput() {
                this.newSurveyDialog = false
                this.survey_input.title = this.survey.title
                this.survey_input.description = this.survey.description
            },
            // 객관식 항목 지우기
            deleteOption(questionOrder, optionOrder){
                if(this.questions[questionOrder].options.length == 1) {
                    this.showTopAlert("error", "객관식은 입력이 최소 한개가 필요합니다.")
                    return
                }

                this.questions[questionOrder].options.splice(optionOrder, 1) // 해당 순번에 해당하는 옵션 제거
                
                // 지워진 순번 보다 높은 값을 가진 요소들을 재배열
                this.updateOptionOrder(questionOrder)
            },
            addOption(questionOrder) {
                // 임시 아이디 증가
                this.tempOptionId -= 1;

                // 새로운 옵션 추가
                this.questions[questionOrder].options.push({ 
                    id: this.tempOptionId, 
                    option: "", 
                    optionOrder: this.questions[questionOrder].options.length
                })
            }, 
            // 객관식 옵션 재배열
            updateOptionOrder(questionOrder) {
                for(var i in this.questions[questionOrder].options ){
                    this.questions[questionOrder].options[i].optionOrder = Number(i)
                }
            },
            // 질문 재배열
            updateQuestionsOrder() {
                for(var i in this.questions){
                    this.questions[i].questionOrder = Number(i)
                }
            },

            // 설문 이름, 설명 저장하기
            setSurveyInfo() {
                const url = '/api/setSurveyInfo'
                const param = {
                    surveyId: this.$route.params.survey_id, 
                    title: this.survey_input.title,
                    description: this.survey_input.description
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
                const url = '/api/getSurveyInfo'
                const config = {
                    params : {
                        surveyId: this.$route.params.survey_id 
                    }
                }

                // api call
                this.$http.get(url, config).then(response => {
                    if(response.data.result){
                        this.survey.title = response.data.info.title
                        this.survey.description = response.data.info.description

                        this.survey_input.title = response.data.info.title
                        this.survey_input.description = response.data.info.description
                    } else {
                        this.showTopAlert("error", response.data.msg)
                    }
                }).catch(function() {
                    this.showTopAlert("error", "데이터를 받아오지 못했습니다. 잠시후 다시 시도해주세요.")
                })
            },
            // 설문 질문 가져오기
            getQuestions() {
                const url = '/api/getSurvey'
                const config = {
                    params : {
                        surveyId: this.$route.params.survey_id 
                    }
                }
                // api call
                this.$http.get(url, config).then(response => {
                    if(response.data.result){
                        this.questions = response.data.list
                        this.save = this._.cloneDeep(this.questions)
                    } else {
                        this.showTopAlert("error", response.data.msg)
                    }
                }).catch(function() {
                    this.showTopAlert("error", "데이터를 받아오지 못했습니다. 잠시후 다시 시도해주세요.")
                })
            },
            // 설문 저장하기
            saveSurvey(){
                if(this.$refs.questionForm.validate()){
                    const url = '/api/saveSurvey'
                    const param = {
                        surveyId: this.$route.params.survey_id,
                        questions: this.questions
                    }
                    const header = {
                        'Content-Type': 'application/json'
                    }

                    this.$http.post(url, param, header).then(response => {
                        if(response.data.result){
                            this.showTopAlert("success", "성공적으로 프로젝트가 저장됐습니다!")
                            this.getQuestions()
                        } else {
                            this.showTopAlert("error", response.data.msg)
                        }
                    }).catch(function() {
                        this.showTopAlert("error", "데이터를 받아오지 못했습니다. 잠시후 다시 시도해주세요.")
                    })
                } else{
                    this.showTopAlert("error", "저장중 오류가 발생했습니다. 잘못됐거나 비어있는 입력이 있습니다.")
                }
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
            // 질문 추가 하기
            addQuestionsChoice() {
                this.tempQuestionsId -= 1;
                this.tempOptionId -= 1;

                this.questions.push({ 
                    id: this.tempQuestionsId, 
                    type: 'choice', 
                    questionOrder: this.questions.length, 
                    description: '',
                    options : [
                        { 
                            id: this.tempOptionId, 
                            option: "", 
                            optionOrder: 0 
                        }
                    ]
                })
            },
            addQuestionsText() {
                this.tempQuestionsId -= 1;

                this.questions.push({ 
                    id: this.tempQuestionsId, 
                    type: 'text', 
                    questionOrder: this.questions.length, 
                    description: '' 
                })
            },

            // 질문 복사
            copyQuestion(questionOrder) {
                let copyQuestion = this._.cloneDeep(this.questions[questionOrder])

                // id 관련 항목 임시 값으로 변경
                this.tempQuestionsId -= 1;

                copyQuestion.id = this.tempQuestionsId
                if(copyQuestion.options != undefined){
                    for(var i in copyQuestion.options){
                        this.tempOptionId -= 1;
                        copyQuestion.options[i].id = this.tempOptionId
                    }
                }

                // 수정된 값 삽입
                this.questions.splice(questionOrder+1, 0, copyQuestion);
                this.updateQuestionsOrder()
            },
            // 질문 삭제
            deleteQuestion(questionOrder) {
                this.questions.splice(questionOrder, 1)
                this.updateQuestionsOrder()
            },
        },
        // 프리뷰 열기
        created: function(){
            this.$emit('setPreview', true)
            this.getQuestions()
            this.getSurveyInfo()
        },
        beforeRouteLeave (to, from, next) { // beforeRouteLeave (to, from, next)
            if (this._.isEqual(this.save, this.questions)) {
                this.$emit('setPreview', false)
                next()
                return
            }
            const answer = window.confirm('저장하지 않은 내용이 있습니다. 추가 저장없이 나가시겠습니까?')

            if(answer){ 
                this.$emit('setPreview', false)
                next() 
            }else{
                next(false)
            }
        }
    }
</script>

<style>
    .bottom-box{
        max-width: 700px;
        width: 100%;
        position: fixed; 
        bottom: 0; 
        left: 50%; 
        transform: translate(-50%, 0); 
        z-index: 100; 
        align-items: center; 
        border-radius: 5px;
    }
</style>
