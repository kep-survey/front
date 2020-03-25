<template>
	<div class="status">
		<v-container class="mb-8">
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
				<template v-slot:item.actions="{ item }">
					<v-btn text small :to="'survey/result/' + item.surveyId">이동</v-btn>
				</template>
			</v-data-table>
		</v-container>
	</div>
</template>

<script>
	export default {
		name: 'Status',
		components: {},
		data: () => ({
			registerId: 1,
			statusList: [],
			headers: [
				{
					text: '설문명',
					align: 'start',
					sortable: false,
					value: 'surveyName',
				},
				{ text: '응답수', value: 'count' },
				{ text: '시작 일시', value: 'startDate' },
				{ text: '종료 일시', value: 'endDate' },
				{ text: '결과 조회', value: 'actions', sortable: false }
			]
		}),
		methods: {
			
		},
		created: function () {
				const axios = require('axios');
				
				axios.get('http://localhost:8081/api/getSurveyStatus?registerId=' + this.registerId)
				.then(res => {
					this.statusList = res.data.statusList;
				})
				.catch(err => {
					console.log(err);
				})
			}
	}
</script>

<style scoped>
	.status {
		width: 100%;
	}
</style>