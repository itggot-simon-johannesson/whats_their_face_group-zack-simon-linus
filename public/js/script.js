Vue.component(`card-component`, {
    props: {
        card: {
            type: Object
        }
    },
    data() {
        return {
            is_card_shown: false
        }
    },
    methods: {
        flipCard() {
            this.is_card_shown = !this.is_card_shown;
        }
    },
    template:
        `
        <div class="card-component" @click="flipCard">
            <div v-if="!card.is_image && is_card_shown" class="card_front person_name">{{card.name}}</div><img v-if="card.is_image && is_card_shown" :src="card.image_path" class="card_front"><img src="https://via.placeholder.com/128x128" class="card_back" v-if="!is_card_shown">
        </div>
        `
});

Vue.component(`chessboard-component`, {
    props: {
        cards: {
            type: Array
        }
    },
    template:
        `
        <div class="chessboard-component">
            <card-component v-for="card in cards" :key="\`card-image-\${card.id}\`" :card="card"></card-component>
        </div>
        `
})

var app = new Vue({
    el: '#app',
    data: {
        picked_minigame: "whats_their_name"
    }
})