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
						:items-per-page="10"
						:footer-props="{
							showFirstLastPage: true,
							firstIcon: 'mdi-arrow-collapse-left',
							lastIcon: 'mdi-arrow-collapse-right',
							prevIcon: 'mdi-minus',
							nextIcon: 'mdi-plus'
						}"
						:sort-by="['participationTime']"
						:sort-desc="[true]"
						:search="search"
						item-key="botUserId"
						loading 
						loading-text="데이터를 불러오는 중입니다..."
					>
						<template v-slot:item.actions="{ item }">
							<v-chip label color="accent" text-color="black" small :to="'/survey/detail/' + surveyId + '/' + item.botUserId">이동</v-chip>
						</template>
					</v-data-table>
				</v-card>
				</v-tab-item>
			</v-tabs>			
			
		</v-container>
	</div>
</template>

<script>
	export default {
		name: 'SurveyResult',
		components: {},
		data: () => ({
			tab: null,
			search: "",
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