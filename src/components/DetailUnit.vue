<template>
    <div class="detailUnit">
        <span class="font-weight-bold" style="margin-bottom:1rem">{{botUserId}}</span>
        <template v-for="(item, index) in result">
            <v-card class="question pa-3" v-bind:key="'unit-' + index" width="700" min-height="40" elevation="3" style="margin-bottom:1.5rem">{{ index + 1 }}. {{item.question}}</v-card>
            <div class="options" v-bind:key="'options-' + index " v-if="item.type === 'choice'" style="margin-bottom:2rem">
                <v-card class="option" v-bind:color="option.content === item.answer ? answered : normal" v-bind:key="'option-' + index" v-for="(option, index) in item.options">
                    <span>{{option.content}}</span>
                </v-card>
            </div>
            <span v-bind:key=index v-else>- {{item.answer}}</span>
        </template> 
    </div>
</template>

<script>
    export default {
        name: 'DetailUnit',
        components: {},
        props: [
			'botUserId',
			'result'
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
        margin: 2rem 0;
    }

    .question {
        display: flex;
        align-items: center;
    }

    .options {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .option {
        min-width: 70px;
        min-height: 40px;
        margin-right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: "accent" !important;
    }
</style>