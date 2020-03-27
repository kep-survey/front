<template>
	<div class="surveyResultDetail">
        <v-container class="mb-8">
            <h1><span class="font-weight-light">결과</span>조회</h1>
            <div class="resultHeader" style="margin-top: 2rem;">
                <h1 class="surveyTitle">{{surveyTitle}}</h1>
                <v-btn class="listBtn" depressed small color="primary--text" @click="$router.go(-1)">목록</v-btn>
            </div>
            <p class="font-weight-bold botUserId">botUserId: {{botUserId}}</p>
            <div id="detailUnit" style="margin-bottom: 2rem;">
                <template v-for="(item, index) in result">
                    <detail-unit v-if="item.type === 'choice'" :key="'result-' + index" :index=index :question=item.question :type=item.type :options=item.options :answer=item.answer></detail-unit>
                    <detail-unit v-else :key="'result-' + index" :index=index :question=item.question :type=item.type :answer=item.answer></detail-unit>
                </template> 
            </div>
        </v-container>
	</div>
</template>

<!-- 
     <v-card class="question pa-3" :key="'unit-' + index" width="700" min-height="40" elevation="3" style="margin-bottom:1.5rem">{{ index + 1 }}. {{item.question}}</v-card>
            <div class="options font-weight-bold" v-bind:key="'options-' + index " v-if="item.type === 'choice'" style="margin-bottom:2rem">
                <v-card class="option pa-3" v-bind:color="option.content === item.answer ? answered : normal" v-bind:key="'option-' + index" v-for="(option, index) in item.options">
                    <span>{{option.content}}</span>
                </v-card>
            </div>
            <span style="margin-bottom:2rem" v-bind:key=index v-else>- {{item.answer}}</span>
-->

<script>
	import DetailUnit from '../components/DetailUnit';

	export default {
		name: 'SurveyResultDetail',
        components: {'detail-unit': DetailUnit},
		data: () => ({
            surveyId: 0,
            surveyTitle: "",
            botUserId: 0,
			result: []
        }),
		methods: {
        },
        created: function () {
				const axios = require('axios');
				
				axios.get('http://localhost:8081/api/getSurveyResultDetail?surveyId='+  this.$route.params.survey_id + '&botUserId=' +  this.$route.params.bot_user_id)
				.then(res => {
                    this.result = res.data.result;
                    this.surveyId = this.$route.params.survey_id;
                    this.botUserId = this.$route.params.bot_user_id;
                    this.surveyTitle = res.data.title;
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

    .listBtn {
        background-color: black !important;
    }

    .botUserId {
        margin-top: 2rem !important;
    }
</style>