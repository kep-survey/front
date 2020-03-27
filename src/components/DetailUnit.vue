<template>
    <div class="detailUnit">
        <p class="question pl-3 font-weight-bold" :key="'unit-' + index" style="margin-bottom:1.5rem">{{ index + 1 }}. {{question}}</p>
        <div class="options" v-bind:key="'options-' + index " v-if="type === 'choice'" style="margin-bottom:2rem">
            <v-card :class="option.content === answer ? 'option pa-3 font-weight-bold' : 'option pa-3'" :color="option.content === answer ? answered : normal" :key="'option-' + index" v-for="(option, index) in options">
                <span>{{option.content}}</span>
            </v-card>
        </div>
        <v-card :key=index v-else class="pa-3" width="700" min-height="40" style="margin-bottom:1rem;">{{answer}}</v-card>
    </div>
</template>

<script>
    export default {
        name: 'DetailUnit',
        components: {},
        props: [
            'question',
            'type',
            'answer',
            'options',
            'index'
		],
        data: () => ({
            answered: 'accent',
            normal: 'primay'
        })
    }
</script>

<style scoped>
    .detailUnit {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin: 1rem 0;
    }

    .detailUnit::after {
        content: "";
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        width: 700px;
    }

    .question {
        display: flex;
        align-items: center;
        border-left: 7px solid #2E2E2E;
        width: 700px;
        min-height: 40px;
    }

    .options {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .option {
        min-width: 80px;
        min-height: 30px;
        margin-right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: "accent" !important;
    }
</style>