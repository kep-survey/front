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
			surveyId: 34,
            surveyTitle: "설문 봇 수요조사",
            botUserId: window.location.pathname.split('/')[3],
			result: [
                {
                    question: "설문봇을 사용할 의사가 있습니까?", 
                    type: "choice",
                    options: [
                        {id: 1, content: "네"},
                        {id: 2, content: "아니오"}
                    ],
                    answer: "네"
                },
                {
                    question: "설문봇에 어울리는 이름을 제시해주세요.", 
                    type: "text",
                    answer: "KEP 설문 챗봇"
                }
            ]
		}),
		methods: {
			created: function () {
				const axios = require('axios');
				
				axios.get('/api/getSurveyResultDetail?botUserId=' + this.botUserId)
				.then(res => {
					console.log(res);
					this.result = res.result;
				}) 
			}
		}
	}
</script>

<style scoped>
    .resultHeader {
        display: flex; 
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
</style>