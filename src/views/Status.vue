<template>
	<div class="status">
		<v-container class="mb-8">
			<h1 class="mb-8"><span class="font-weight-light">설문</span>현황</h1>
			<v-container class="px-0">
				<v-card>
					<v-card-title>
						<v-text-field
							v-model="search"
							append-icon="mdi-magnify"
							label="Search"
							single-line
							hide-details
							color="teritory"
						></v-text-field>
					</v-card-title>
					<v-data-table
						:headers="headers"
						:items="statusList"
						:items-per-page="itemsPerPage"
						:footer-props="{
							showFirstLastPage: true,
							firstIcon: 'mdi-arrow-collapse-left',
							lastIcon: 'mdi-arrow-collapse-right',
							prevIcon: 'mdi-minus',
							nextIcon: 'mdi-plus'
						}"
						:sort-by="['endDate', 'startDate']"
						:sort-desc="[true, true]"
						:search="search"
						:page.sync="page"
						hide-default-footer
						loading 
						loading-text="데이터를 불러오는 중입니다..."
						class="elevation-1"
						@page-count="pageCount = $event"
					>
						<template v-slot:item.count="{ item }">
							<v-chip color="teritary" text-color="dark-primary" small>{{ item.count }}</v-chip>
						</template>
						<template v-slot:item.actions="{ item }">
							<v-chip label color="accent" text-color="black" small :to="'survey/result/' + item.surveyId">이동</v-chip>
						</template>
					</v-data-table>
				</v-card>
				<div class="text-center py-2">
						<v-pagination v-model="page" :length="pageCount" color="blue" total-visible="10"></v-pagination>
				</div>
			</v-container>
		</v-container>
	</div>
</template>

<script>
	export default {
		name: 'Status',
		components: {},
		data: () => ({
			page: 1,
			pageCount: 0,
			itemsPerPage: 10,
			search: '',
			registerId: 1,
			statusList: [],
			headers: [
				{
					text: '설문명',
					align: 'start',
					sortable: false,
					value: 'surveyName',
				},
				{ text: '응답수', value: 'count', align: 'center', sortable: false},
				{ text: '시작 일시', value: 'startDate' },
				{ text: '종료 일시', value: 'endDate' },
				{ text: '결과 조회', value: 'actions', sortable: false }
			]
		}),
		methods: {
			
		},
		created: function () {
			const axios = require('axios');
			this.$emit('initPage', 0, false, false) // surveyid, preview, appbar
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