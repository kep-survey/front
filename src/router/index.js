import Vue from 'vue'
import VueRouter from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Status from '../views/Status.vue'
import SurveyEdit from '../views/SurveyEdit.vue'
// import SurveyDeploy from '../views/SurveyDeploy.vue'
import SurveyResult from '../views/SurveyResult.vue'
import SurveyResultDetail from '../views/SurveyResultDetail.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: {name : 'dashboard'}
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard
    },
    {
        path: '/status',
        name: 'status',
        component: Status
    },
    {
        path: '/survey/edit/',
        name: 'surveyEdit',
        component: SurveyEdit
    },
    {
        path: '/survey/edit/:survey_id',
        name: 'surveyEdit',
        component: SurveyEdit
    },
    // {
    //     path: '/survey/deploy/',
    //     name: 'surveyDeploy',
    //     component: SurveyDeploy
    // },
    // {
    //     path: '/survey/deploy/:survey_id',
    //     name: 'surveyDeploy',
    //     component: SurveyDeploy
    // },
    {
        path: '/survey/result/',
        name: 'surveyResult',
        component: SurveyResult,
    },
    {
        path: '/survey/result/:survey_id',
        name: 'surveyResult',
        component: SurveyResult,
    },
    {
        path: '/survey/detail/:survey_id/:bot_user_id',
        name: 'surveyResultDetail',
        component: SurveyResultDetail,
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
