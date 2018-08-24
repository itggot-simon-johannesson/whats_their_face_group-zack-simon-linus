Vue.component(`card-component`, {
    props: {
        card: {
            type: Object
        },
        can_open: {
            type: Boolean
        }
    },
    data() {
        return {
            is_card_shown: false,
            is_card_matched: false
        }
    },
    methods: {
        flipCard() {
            if (!this.is_card_shown && this.can_open) {
                this.is_card_shown = true;
                this.$eventHub.$emit('flipCard', this);
            }
        },
        closeCard() {
            this.is_card_shown = false;
        },
        matchCard() {
            this.is_card_matched = true;
        }
    },
    template:
        `
        <div class="card-component" @click="flipCard" :class="{'card-outline': is_card_matched}">
            <div v-if="!card.is_image && is_card_shown" class="card_front person_name">{{card.name}}</div><img v-if="card.is_image && is_card_shown" :src="card.image_path" class="card_front"><img src="/images/question_mark.png" class="card_back" v-if="!is_card_shown">
        </div>
        `
});

Vue.component(`chessboard-component`, {
    props: {
        cards: {
            type: Array
        }
    },
    data() {
        return {
            cards_open: [],
            can_open_card: true,
            match_card_count: 0,
            show_replay_button: false
        }
    },
    created() {
        this.$eventHub.$on('flipCard', (card) => {
            if (this.cards_open.push(card) >= 2) {
                this.can_open_card = false
                setTimeout(() => {
                    if (this.cards_open[0].card.id == this.cards_open[1].card.id) {
                        for (let open_card of this.cards_open) {
                            open_card.matchCard();
                            this.match_card_count += 1;
                            this.show_replay_button = this.match_card_count == this.cards.length;
                        }
                    } else {
                        for (let open_card of this.cards_open) {
                            open_card.closeCard();
                        }
                    }
                    this.cards_open = [];
                    this.can_open_card = true;
                }, 1000);
            }
        });
    },
    template:
        `
        <div class="chessboard-component">
            <card-component v-for="card in cards" :key="card.is_image ? \`card-image-\${card.id}\` : \`card-text-\${card.id}\`" :card="card" :can_open="can_open_card"></card-component>
            <p v-if="show_replay_button">Well done, you won!</p>
            <button v-if="show_replay_button" onclick="window.location.reload(true)">Replay memory</button>
        </div>
        `
});

Vue.component(`slideshow-component`, {
    props: {
        people: {
            type: Array
        }
    },
    data() {
        return {
            person_index: 0,
            do_show_name: false
        }
    },
    methods: {
        nextPerson() {
            this.person_index += 1;
            if (this.person_index >= this.people.length) this.person_index = 0;
        }
    },
    template:
        `
        <div class="slideshow-component">
            <img @mouseover="do_show_name = true" @mouseleave="do_show_name = false" :src="people[person_index].image_path">
            <h1 :class="{transparent: true, opaque: do_show_name}">{{people[person_index].name}}</h1>
            <button @click="nextPerson">Next!</button>
        </div>
        `
});

Vue.prototype.$eventHub = new Vue(); // Global event bus

var app = new Vue({
    el: '#app',
    data: {
        picked_minigame: "learn_their_name"
    },
    created() {
        let parsedUrl = new URL(window.location.href);
        let minigame = parsedUrl.searchParams.get('minigame');
        if (minigame) {
            this.picked_minigame = minigame;
        }
    }
})