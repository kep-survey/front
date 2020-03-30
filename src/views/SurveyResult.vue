<template>
	<div class="surveyResult">
		<v-container class="mb-8">
			<h1><span class="font-weight-light">결과</span>조회</h1>
			<h1 class="survey-title" style="margin-top: 2rem;">{{surveyTitle}}</h1>
			<v-data-table
				:headers="headers"
				:items="resultList"
				:items-per-page="10"
				:footer-props="{
					showFirstLastPage: true,
					firstIcon: 'mdi-arrow-collapse-left',
					lastIcon: 'mdi-arrow-collapse-right',
					prevIcon: 'mdi-minus',
					nextIcon: 'mdi-plus'
				}"
				class="elevation-1"
				style="margin-top:2rem"
			>
				<template v-slot:item.actions="{ item }">
					<v-btn text small :to="'/survey/detail/' + surveyId + '/' + item.botUserId">이동</v-btn>
				</template>
			</v-data-table>
		</v-container>
	</div>
</template>

<script>
	export default {
		name: 'SurveyResult',
		components: {},
		data: () => ({
			surveyId: 0,
			surveyTitle: "",
			resultList: [],
			headers: [
				{
					text: 'botUserId',
					align: 'start',
					sortable: false,
					value: 'botUserId',
				},
				{ text: '응답 일시', value: 'participationTime' },
				{ text: '상세 조회', value: 'actions', sortable: false }
			]
		}),
		methods: {
		},
		created: function () {
				const axios = require('axios');
				const surveyId = this.$route.params.survey_id;

				axios.get('http://localhost:8081/api/getSurveyResultList?surveyId=' + surveyId)
				.then(res => {
					this.resultList = res.data.resultList;
					this.surveyTitle = res.data.title;
					this.surveyId = surveyId;
				})
				.catch(err => {
					console.log(err);
				})
			}
	}
</script>

<style scoped>
	.surveyResult {
		width: 100%;
	}

	.survey-title {
		margin-top: 2rem;
	}
</style>