<template>
	<div class="surveyResult">
		<v-container class="mb-8">
			<h1><span class="font-weight-light">결과</span>조회</h1>
			<h1 class="survey-title mb-8" style="margin-top: 2rem;">{{surveyTitle}}</h1>
			<v-tabs
				v-model="tab"
				background-color="trapsparent"
				class="elevation-1"
				color="dark-primary"
			>
				<v-tabs-slider></v-tabs-slider>

				<v-tab
				:href="`#tab-1`"
				>
				응답 조회
				</v-tab>
				<v-tab
				:href="`#tab-2`"
				>
				결과 분석
				</v-tab>

				<v-tab-item
				:value="'tab-1'"
				>
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
						:items="resultList"
						:items-per-page="itemsPerPage"
						:footer-props="{
							showFirstLastPage: true,
							firstIcon: 'mdi-arrow-collapse-left',
							lastIcon: 'mdi-arrow-collapse-right',
							prevIcon: 'mdi-minus',
							nextIcon: 'mdi-plus',
						}"
						:sort-by="['participationTime']"
						:sort-desc="[true]"
						:search="search"
						:page.sync="page"
						item-key="botUserId"
						hide-default-footer
						loading 
						loading-text="데이터를 불러오는 중입니다..."
						@page-count="pageCount = $event"
					>
						<template v-slot:item.actions="{ item }">
							<v-chip label color="accent" text-color="black" small :to="'/survey/detail/' + surveyId + '/' + item.botUserId">이동</v-chip>
						</template>
					</v-data-table>
					<div class="text-center py-2">
						<v-pagination v-model="page" :length="pageCount" color="blue" total-visible="10"></v-pagination>
					</div>
				</v-card>
				</v-tab-item>

				<v-tab-item
				:value="'tab-2'"
				>
				<template v-for="(item, index) in analysisList">
					<section :key="'anaysis-' + index" class="container">
						<analysis-unit :question=item.question :type=item.type :datacollection=item.datacollection  :sumAnswers=item.sumAnswers  :index=index></analysis-unit>
					</section>
				</template>
				</v-tab-item>
			</v-tabs>			
		</v-container>
	</div>
</template>

<script>
	import AnalysisList from '@/components/AnalysisUnit'
	export default {
		name: 'SurveyResult',
		components: {
			'analysis-unit': AnalysisList
		},
		data: () => ({
			page: 1,
			pageCount: 0,
			itemsPerPage: 10,
			tab: null,
			search: "",
			surveyId: -1,
			surveyTitle: "",
			resultList: [],
			analysisList: [],
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

				this.$emit('initPage', this.surveyId, false, true) // surveyid, preview, appbar
			})
			.catch(err => {
				console.log(err);
			})

			axios.get('http://localhost:8081/api/getSurveyResultAnalysis?surveyId=' + surveyId)
			.then(res => {
				this.analysisList = res.data.analysisList;
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