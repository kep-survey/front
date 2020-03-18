import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            // 테마 색상 코드 
            light: {
                darkPrimary: '#2E2E2E',
                primary: '#FFFFFF',
                secondary: '#F3F4F7',
                accent: '#FAE100',
            },
        },
    }
});
