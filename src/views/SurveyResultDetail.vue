<template>
	<div class="surveyResultDetail">
        <h1><span class="font-weight-light">결과</span>조회</h1>
        <div class="resultHeader" style="margin-top: 2rem;">
            <h1 class="surveyTitle">{{surveyTitle}}</h1>
            <v-btn depressed small color="accent" @click="$router.go(-1)">목록</v-btn>
        </div>
		<div id="detailUnit">
            <detail-unit :result=result :botUserId=botUserId></detail-unit>
		</div>
	</div>
</template>

<script>
	import DetailUnit from '../components/DetailUnit';

	export default {
		name: 'SurveyResultDetail',
        components: {'detail-unit': DetailUnit},
		data: () => ({
            surveyId: window.location.pathname.split('/')[3],
            surveyTitle: "설문 봇 수요조사",
            botUserId: window.location.pathname.split('/')[4],
			result: []
        }),
		methods: {
        },
        created: function () {
				const axios = require('axios');
				
				axios.get('http://localhost:8081/api/getSurveyResultDetail?surveyId='+  this.$route.params.survey_id + '&botUserId=' +  this.$route.params.bot_user_id)
				.then(res => {
					this.result = res.data.result;
				}) 
			}
	}
</script>

<style scoped>
    .resultHeader {
        display: flex; 
        width: 700px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
</style>