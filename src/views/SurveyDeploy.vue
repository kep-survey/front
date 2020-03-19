<template>
	<div class="surveyDeploy">
		<h1><span class="font-weight-light">설문</span>배포</h1>
		<v-container fluid class="deploy-container">
			<v-row>
				<v-col cols="3">
					<span class="font-weight-bold">설문배포</span>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon dark v-on="on">info</v-icon>
						</template>
						<span>설문을 개시하려면 우측 "배포하기" 버튼을 클릭하세요<br>배포 후 종료하면 설문이 종료됩니다</span>
					</v-tooltip>
				</v-col>
				<v-col cols="7">
					<v-btn v-on:click="onClickDeploy" large color="accent">{{!open ? "배포하기" : "설문 진행중"}}</v-btn> 
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="3">
					<span class="font-weight-bold">환영메시지</span>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon dark v-on="on">info</v-icon>
						</template>
						<span>설문 시작 시 응답자에게 노출되는 메시지를 설정해주세요</span>
					</v-tooltip>
				</v-col>
				<v-col cols="7">
					<v-textarea solo v-model="welcomeMsg"></v-textarea>
					<v-btn v-on:click="onClickSaveSurveyMsg('welcome')" color="darkPrimary" class="saveBtn" width="100"><span class="btnSpan">저장</span></v-btn>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="3">
					<span class="font-weight-bold">종료메시지</span>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon dark v-on="on">info</v-icon>
						</template>
						<span>설문 종료 시 응답자에게 노출되는 메시지를 설정해주세요</span>
					</v-tooltip>
				</v-col>
				<v-col cols="7">
					<v-textarea solo v-model="completeMsg"></v-textarea>
					<v-btn v-on:click="onClickSaveSurveyMsg('complete')" color="darkPrimary" class="saveBtn" width="100"><span class="btnSpan">저장</span></v-btn>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
	export default {
		name: 'SurveyDeploy',
		components: {},
		data: () => ({
			surveyId: 34,
			welcomeMsg: '',
			completeMsg: '',
			open: false
		}),
		methods: {
			created: function () {
				const axios = require('axios');
				console.log(this.surveyId);

				axios.get('/api/getSurveyInfo')
				.then(res => {
					console.log(res);
					this.welcomeMsg = res.welcomeMsg;
					this.completeMsg = res.completeMsg;
					this.open = res.open;
				})
			},
			onClickDeploy: function () {
				const axios = require('axios');

				const inputSurveyId = this.$data.surveyId;
				const inputOpen = !this.$data.open;

				axios.post('/api/openSurvey', {
					surveyId: inputSurveyId,
					open: inputOpen
				}).then(res => {
					console.log(res);
				})
			},
			onClickSaveSurveyMsg: function (flag) {
				const axios = require('axios');

				const inputSurveyId = this.$data.surveyId;
				const inputWelcomeMsg = this.$data.welcomeMsg;
				const inputCompleteMsg = this.$data.completeMsg;

				if (flag === 'welcome') {
					axios.post('/api/setSurveyInfo', {
					surveyId: inputSurveyId,
					welcomeMsg: inputWelcomeMsg
				})
				.then(res => {
					console.log(res);
				})
				} else {
					axios.post('/api/setSurveyInfo', {
					surveyId: inputSurveyId,
					completeMsg: inputCompleteMsg
				}).then(res => {
					console.log(res);
				})
				}
			}
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