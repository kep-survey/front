<template>
	<div class="surveyResult">
		<h1><span class="font-weight-light">결과</span>조회</h1>
		<h1 class="surveyTitle" style="margin-top: 2rem;">{{surveyTitle}}</h1>
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
				<v-btn text small :to="'result/' + item.botUserId">이동</v-btn>
			</template>
		</v-data-table>
	</div>
</template>

<script>
	export default {
		name: 'SurveyResult',
		components: {},
		data: () => ({
			surveyId: 34,
			surveyTitle: "설문 봇 수요조사",
			resultList: [
				{ 
					botUserId: "botUserId1", 
					surveyDate: "2020.03.23 13:56:02"
				},
				{ 
					botUserId: "botUserId2", 
					surveyDate: "2020.03.24 19:56:02"
				},
				{ 
					botUserId: "botUserId3", 
					surveyDate: "2020.03.25 19:56:02"
				},
				{ 
					botUserId: "botUserId4", 
					surveyDate: "2020.03.26 19:56:02"
				},
				{ 
					botUserId: "botUserId5", 
					surveyDate: "2020.03.27 19:56:02"
				},
				{ 
					botUserId: "botUserId6", 
					surveyDate: "2020.03.28 19:56:02"
				}
			],
			headers: [
				{
					text: 'botUserId',
					align: 'start',
					sortable: false,
					value: 'botUserId',
				},
				{ text: '응답 일시', value: 'surveyDate' },
				{ text: '상세 조회', value: 'actions', sortable: false }
			]
		}),
		methods: {
			created: function () {
				const axios = require('axios');
				
				axios.get('/api/getSurveyResultList?surveyId=' + this.surveyId)
				.then(res => {
					console.log(res);
					this.resultList = res.resultList;
				}) 
			}
		}
	}
</script>

<style scoped>
	.surveyResult {
		width: 100%;
	}

	.surveyTitle {
		margin-top: 2rem;
	}
</style>