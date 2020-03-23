<template>
	<div class="status">
		<h1><span class="font-weight-light" style="margin-bottom: 2rem;">설문</span>현황</h1>
		<v-data-table
			:headers="headers"
			:items="statusList"
			:items-per-page="10"
			:footer-props="{
				showFirstLastPage: true,
				firstIcon: 'mdi-arrow-collapse-left',
				lastIcon: 'mdi-arrow-collapse-right',
				prevIcon: 'mdi-minus',
				nextIcon: 'mdi-plus'
			}"
			:sort-by="['endDate', 'startDate']"
			:sort-desc="[true, true]"
			class="elevation-1"
			style="margin-top:2rem"
		>
			<template v-slot:item.actions="{ }">
				<v-btn text small :to="'survey/result'">이동</v-btn>
			</template>
		</v-data-table>
	</div>
</template>

<script>
	export default {
		name: 'Status',
		components: {},
		data: () => ({
			statusList: [
				{ 
					surveyId: 1,
					surveyTitle: "KEP 설문봇 수요조사", 
					count: 10,
					startDate: "2020.03.23 13:56:02",
					endDate: "2020.03.25 13:56:02"
				},
				{ 
					surveyId: 2,
					surveyTitle: "오픈 API 문서화 툴 사용 실태 조사", 
					count: 1,
					startDate: "2020.03.13 13:56:02",
					endDate: "2020.03.14 13:56:02"
				},
				{ 
					surveyId: 3,
					surveyTitle: "사내 근태관리 솔루션 만족도 조사", 
					count: 5,
					startDate: "2020.03.23 13:56:02",
					endDate: "2020.03.25 13:56:02"
				},
				{ 
					surveyId: 4,
					surveyTitle: "오피스 출근 수단 조사", 
					count: 8,
					startDate: "2020.03.23 13:56:02",
					endDate: "2020.03.25 13:56:02"
				},
				{ 
					surveyId: 5,
					surveyTitle: "원격근무 만족도 조사", 
					count: 20,
					startDate: "2020.03.23 13:56:02",
					endDate: "2020.03.25 13:56:02"
				},
				{ 
					surveyId: 6,
					surveyTitle: "카카오워크 베타 테스트 만족도 조사", 
					count: 100,
					startDate: "2020.02.23 13:56:02",
					endDate: ""
				}
			],
			headers: [
				{
					text: '설문명',
					align: 'start',
					sortable: false,
					value: 'surveyTitle',
				},
				{ text: '응답수', value: 'count' },
				{ text: '시작 일시', value: 'startDate' },
				{ text: '종료 일시', value: 'endDate' },
				{ text: '결과 조회', value: 'actions', sortable: false }
			]
		}),
		methods: {
			created: function () {
				const axios = require('axios');
				
				axios.get('http://localhost:8080/api/getSurveyStatus')
				.then(res => {
					console.log(res);
					this.statusList = res.statusList;
				}) 
			}
		}
	}
</script>

<style scoped>
	.status {
		width: 100%;
	}
</style>