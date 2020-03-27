<template>
	<div class="surveyDeploy">
		<v-container class="mb-8">
			<h1><span class="font-weight-light">설문</span>배포</h1>
			<v-container fluid class="deploy-container">
				<v-row>
					<v-col cols="3">
						<span class="font-weight-bold">설문배포</span>
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-icon white v-on="on">info</v-icon>
							</template>
							<span>설문을 개시하려면 우측 "배포하기" 버튼을 클릭하세요<br>배포 후 클릭하면 설문이 종료됩니다</span>
						</v-tooltip>
					</v-col>
					<v-col cols="7">
						<v-btn :disabled="status == 3 ? true : false" v-on:click="onClickDeploy" large color="accent"><span class="btnText">{{status === 1 ? "배포하기" : (status === 2 ? "설문 진행중" : "설문 종료")}}</span></v-btn> 
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="3">
						<span class="font-weight-bold">환영메시지</span>
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-icon white v-on="on">info</v-icon>
							</template>
							<span>설문 시작 시 응답자에게 노출되는 메시지를 설정해주세요</span>
						</v-tooltip>
					</v-col>
					<v-col cols="7">
						<v-textarea solo v-model="welcomeMsg"></v-textarea>
						<v-btn :disabled="status == 3 ? true : false" v-on:click="onClickSaveSurveyMsg('welcome')" color="darkPrimary" class="saveBtn" width="100"><span class="btnSpan">저장</span></v-btn>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="3">
						<span class="font-weight-bold">종료메시지</span>
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-icon white v-on="on">info</v-icon>
							</template>
							<span>설문 종료 시 응답자에게 노출되는 메시지를 설정해주세요</span>
						</v-tooltip>
					</v-col>
					<v-col cols="7"> 
						<v-textarea solo v-model="completeMsg"></v-textarea>
						<v-btn :disabled="status == 3 ? true : false" v-on:click="onClickSaveSurveyMsg('complete')" color="darkPrimary" class="saveBtn" width="100"><span class="btnSpan">저장</span></v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-container>
	</div>
</template>

<script>
	export default {
		name: 'SurveyDeploy',
		components: {},
		data: () => ({
			surveyId: 1,
			welcomeMsg: "",
			completeMsg: "",
			status: 1
		}),
		methods: {
			onClickDeploy: function () {
				const axios = require('axios');

				const inputSurveyId = this.surveyId;
				const inputStatus = this.status + 1;

				axios.post('http://localhost:8081/api/openSurvey', {
					surveyId: inputSurveyId,
					status: inputStatus
				}).then(res => {
					if (res.data.result === 'true') {

						if (this.status === 2) {
							this.status = 3;
							alert('설문이 정상적으로 종료되었습니다!');
						} else {
							this.status = 2;
							alert('설문이 정상적으로 배포되었습니다!');
						}
					} else {
						alert('배포 과정에 오류가 발생했습니다. 다시 시도해주세요.');
					}
				})
			},
			onClickSaveSurveyMsg: function (flag) {
				const axios = require('axios');

				const inputSurveyId = this.$data.surveyId;
				const inputWelcomeMsg = this.$data.welcomeMsg;
				const inputCompleteMsg = this.$data.completeMsg;

				if (flag === 'welcome') {
					axios.post('http://localhost:8081/api/setSurveyMsg', {
						flag: 'welcome',
						surveyId: inputSurveyId,
						welcomeMsg: inputWelcomeMsg,
				})
				} else {
					axios.post('http://localhost:8081/api/setSurveyMsg', {
						flag: 'complete',
						surveyId: inputSurveyId,
						completeMsg: inputCompleteMsg
				})
				}
			}
		},
		created: function () {
				const axios = require('axios');

				axios.get('http://localhost:8081/api/getSurveyDeploy?surveyId=' + this.$route.params.survey_id)
				.then(res => {
					let welcomeMsg = res.data.welcomeMsg;
					let completeMsg = res.data.completeMsg;

					this.welcomeMsg = welcomeMsg;
					this.completeMsg = completeMsg;
					this.status = res.data.status;
				})
			}
	}
</script>

<style scoped>
	@import url('https://fonts.googleapis.com/css?family=Material+Icons');
	
	.surveyDeploy {
        width: 100%;
	}
	
	.deploy-container {
		margin-top: 2rem;
		padding: 0;
		font-size: 20px;
	}

	.btnText {
		color: black !important;
	}

	.row {
		margin-top: 1rem;
	}

	.btnSpan {
		color: white !important;
	}

	.saveBtn {
		float: right;
	}

	i {
		font-family: "Material Icons" !important;
		font-size: 20px !important;
		margin-left: 5px;
	}
</style>