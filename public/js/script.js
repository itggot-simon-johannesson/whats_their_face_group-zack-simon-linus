Vue.component("letter-button", {
    props: {
        letter: {
            type: String
        }
    },
    data() {
        return {
            disabled: false
        }
    },
    methods: {
        clicked() {
            this.disabled = true;
            this.$eventHub.$emit("hangman-check", this.letter);
        }
    },
    template:
        `
        <button class="keyboard-row-letter" :disabled="disabled" @click="clicked">{{letter}}</button>
        `
});

Vue.component('hangman-component', {
    props: {
        person: {
            type: Object
        }
    },
    data() {
        return {
            letters: [
                ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
                ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
                ["Z", "X", "C", "V", "B", "N", "M"]
            ],
            word_divs: [],
            guesses: 0,
            game_over: false,
            canvas: "",
            ctx: ""
        }
    },
    methods: {
        drawGallows: function(ctx) {
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			ctx.fillStyle = "#FF9800";
			ctx.strokeStyle = "#FF9800";
			ctx.beginPath();
			// left side
			ctx.moveTo(this.canvas.width / 10, this.canvas.height / 10);
			ctx.lineTo(this.canvas.width / 10, this.canvas.height * 0.95);
			// bottom side
			ctx.lineTo(this.canvas.width * 0.8, this.canvas.height * 0.95);
			// top side
			ctx.moveTo(this.canvas.width / 10, this.canvas.height / 10);
			ctx.lineTo(this.canvas.width * 0.4, this.canvas.height / 10);
			// hanging notch
			ctx.lineTo(this.canvas.width * 0.4, this.canvas.height / 5);
			ctx.stroke();
			ctx.closePath();
        },
        updateCanvas: function(ctx) {
			// this.drawGallows(ctx);
			// draw the head
			if (this.guesses === 0) {
				ctx.beginPath();
				ctx.arc(this.canvas.width * 0.4, (this.canvas.height / 5) + 20, 20, 0, 2 * Math.PI);
				ctx.stroke();
				ctx.closePath();
			} 
			// draw the torso
			else if (this.guesses === 1) {
				ctx.beginPath();
				ctx.moveTo(this.canvas.width * 0.4, (this.canvas.height / 5) + 40);
				ctx.lineTo(this.canvas.width * 0.4, this.canvas.height / 2);
				ctx.stroke();
				ctx.closePath();
			}
			// draw the right leg
			else if (this.guesses === 2) {
				ctx.beginPath();
				ctx.moveTo(this.canvas.width * 0.4, this.canvas.height / 2);
				ctx.lineTo((this.canvas.width * 0.4) + 30, this.canvas.height * 0.7);
				ctx.stroke();
				ctx.closePath();
			}
			// draw the left leg
			else if (this.guesses === 3) {
				ctx.beginPath();
				ctx.moveTo(this.canvas.width * 0.4, this.canvas.height / 2);
				ctx.lineTo((this.canvas.width * 0.4) - 30, this.canvas.height * 0.7);
				ctx.stroke();
				ctx.closePath();
			}
			// draw the right arm
			else if (this.guesses === 4) {
				ctx.beginPath();
				ctx.moveTo(this.canvas.width * 0.4, (this.canvas.height / 5) + 55);
				ctx.lineTo((this.canvas.width * 0.4) + 35, (this.canvas.height / 2) + 10);
				ctx.stroke();
				ctx.closePath();
			} 
			// draw the left arm and handle game over
			else if (this.guesses === 5) {
				ctx.beginPath();
				ctx.moveTo(this.canvas.width * 0.4, (this.canvas.height / 5) + 55);
				ctx.lineTo((this.canvas.width * 0.4) - 35, (this.canvas.height / 2) + 10);
				ctx.stroke();
				ctx.closePath();
				// game over
				ctx.font = "24px Roboto, sans-serif";
				ctx.fillText("Game Over", this.canvas.width * 0.4 - 30, this.canvas.height * 0.9);
				this.gameOver = true;
				this.lose = true;
				// fill in the word with the correct answer
				for (var i = 0; i < this.person.name.length; i++) {
					Vue.set(this.word_divs, i, this.person.name[i]);
				}
			}
			this.guesses++
		},
    },
    mounted() {
        this.canvas = this.$el.querySelector(".hangman-canvas");
        this.canvas.width = this.$el.querySelector(".hangman-board").offsetWidth;
        this.canvas.height = this.$el.querySelector(".hangman-board").offsetHeight;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineWidth = 2;
        this.drawGallows(this.ctx);
        for (let i = 0; i < this.person.name.length; i++) this.word_divs.push("");
    },
    created() {
        this.$eventHub.$on('hangman-check', (letter) => {
            let guess_correct = false;

            // check if the letter is in the word, if so, fill it in
            console.log(this.person.name);
            for (let i = 0; i < this.person.name.length; i++) {
                console.log(letter);
                if (letter == this.person.name.toUpperCase()[i]) {
                    console.log("correct");
                    Vue.set(this.word_divs, i, letter);
                    guess_correct = true;
                }
            }
            // if there are no more blanks in the word, you win
            if (!this.word_divs.some(function(value) {return value == ""})) {
                this.game_over = true;
                this.ctx.font = "24px Roboto, sans-serif";
                this.ctx.fillText("You Win!", this.canvas.width * 0.4 - 30, this.canvas.height * 0.9);
            }
            // if they guess wrong, draw the man
            if (!guess_correct) {
                this.updateCanvas(this.ctx);
            }
        });
    },
    template:
        `
        <div class="hangman-component">
            <div class="hangman-board">
                <canvas class="hangman-canvas"></canvas>
            </div>
            <div class="hangman-word">
                <div class="word-blankletter" v-for="letter in word_divs">{{letter}}</div>
            </div>
            <div class="hangman-keyboard">
                <div v-for="row in letters" class="keyboard-row">
                    <letter-button v-for="letter in row" :letter="letter" :key="letter"></letter-button>
                </div>
            </div>
            <button v-if="game_over" onclick="window.location.reload(true)">Replay hangman!</button>
        </div>
        `
});

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
            <button @click="nextPerson">Next person</button>
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