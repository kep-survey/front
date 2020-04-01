<template>
	<div class="surveyDeploy" style="z-index: 400">
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
						<v-btn :disabled="status == 3 ? true : false" large color="accent" @click.stop="dialog = true"><span class="btn-text">{{status === 1 ? "배포하기" : (status === 2 ? "설문 진행중" : "설문 종료")}}</span></v-btn> 
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="3">
						<span class="font-weight-bold">환영메시지</span>
						<v-tooltip bottom class="deploy-tooltip">
							<template v-slot:activator="{ on }">
								<v-icon white v-on="on">mdi-information</v-icon>
							</template>
							<span>설문 시작 시 응답자에게 노출되는 메시지를 설정해주세요</span>
						</v-tooltip>
					</v-col>
					<v-col cols="7">
						<v-textarea solo v-model="welcomeMsg"></v-textarea>
						<v-btn :disabled="status == 3 ? true : false" v-on:click="onClickSaveSurveyMsg('welcome')" color="dark-primary" class="save-btn" width="100"><span class="btn-span">저장</span></v-btn>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="3">
						<span class="font-weight-bold">종료메시지</span>
						<v-tooltip bottom class="deploy-tooltip">
							<template v-slot:activator="{ on }">
								<v-icon white v-on="on">info</v-icon>
							</template>
							<span>설문 종료 시 응답자에게 노출되는 메시지를 설정해주세요</span>
						</v-tooltip>
					</v-col>
					<v-col cols="7"> 
						<v-textarea solo v-model="completeMsg"></v-textarea>
						<v-btn :disabled="status == 3 ? true : false" v-on:click="onClickSaveSurveyMsg('complete')" color="dark-primary" class="save-btn" width="100"><span class="btn-span">저장</span></v-btn>
					</v-col>
				</v-row>
			</v-container>
			<v-container>
				<v-dialog
					v-model="dialog"
					max-width="500"
					>
					<v-card>
						<template v-if="status === 1">
							<v-card-title class="headline">설문 배포</v-card-title>
							<v-card-text>
							설문 배포 진행 시 해당 설문의 수정 또는 편집이 더이상 불가능합니다. 그래도 진행하시겠습니까?
							</v-card-text>
						</template>
						
						<template v-else>
							<v-card-title class="headline">설문 종료</v-card-title>
							<v-card-text>
							설문 종료 시 해당 설문에 대한 응답 수집이 불가능하며, 재배포 할 수 없습니다. 그래도 진행하시겠습니까?
							</v-card-text>
						</template>
						<v-card-actions>
							<v-spacer></v-spacer>

							<v-btn
								color="green darken-1"
								text
								@click="dialog = false"
							>
								취소
							</v-btn>

							<v-btn
								color="green darken-1"
								text
								@click="dialog = false"
								v-on:click="onClickDeploy"
							>
								확인
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-container>
		</v-container>
	</div>
</template>

<script>
	export default {
		name: 'SurveyDeploy',
		components: {},
		data: () => ({
			surveyId: -1,
			welcomeMsg: "",
			completeMsg: "",
			status: 1,
			dialog: false
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
			this.surveyId = this.$route.params.survey_id
			const axios = require('axios');

			axios.get('http://localhost:8081/api/getSurveyDeploy?surveyId=' + this.surveyId)
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

	.deploy-tooltip {
		z-index: 400 !important; 
	}

	.btn-text {
		color: black !important;
	}

	.row {
		margin-top: 1rem;
	}

	.btn-span {
		color: white !important;
	}

	.save-btn {
		float: right;
	}

	i {
		font-family: "Material Icons" !important;
		font-size: 20px !important;
		margin-left: 5px;
	}
</style>