Vue.component(`card-component`, {
    props: {
        person_name: {
            type: String
        },
        person_image: {
            type: String
        },
        do_show_image: {
            type: Boolean
        }
    },
    data() {
        return {
            is_card_shown: false
        }
    },
    methods: {
        flipCard() {
            this.is_card_shown = !this.is_card_shown
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        picked_minigame: "whats_their_name"
    }
})