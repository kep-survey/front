<template>
    <div class="analysisUnit">
       <section class="container">
            <p class="question pl-3 font-weight-bold" :key="'unit-' + index" style="margin-bottom:1.5rem">{{ index + 1 }}. {{question}}</p>
            <v-chip class="mb-4">총 응답수 : {{sumAnswers}}</v-chip>
            <div class="columns" v-if="type === 'choice'">
                <div class="column">
                    <bar-chart :datacollection=datacollection></bar-chart>
                </div>
            </div>
            <div v-else>
                
                <template v-for="(data, index) in datacollection">
                    <v-card :key="'text-' + index" class="pa-3" width="700" min-height="40" style="margin-bottom:1rem;">{{data}}</v-card>
                </template>
            </div>
        </section>
    </div>
</template>

<script>
    import BarChart from '@/components/BarChart'

    export default {
        name: 'AnalysisUnit',
        components: {
            'bar-chart': BarChart
        },
        props: [
            'question',
            'type',
            'datacollection',
            'sumAnswers',
            'index'
		],
        data: () => ({
            answered: 'accent',
            normal: 'primay'
        })
    }
</script>

<style scoped>
    .question {
        display: flex;
        align-items: center;
        border-left: 7px solid #2E2E2E;
        width: 700px;
        min-height: 40px;
    }
</style>