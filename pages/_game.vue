<template>
  <div class="container">
    <div class="content">
      <div class="game-wrapper">
        <Game />
      </div>
      <div v-if="gameOver" class="lost">
        Game Over! You got to {{ game.length }}
      </div>
      <div class="controls">
        <p @click="undo" class="undo">
          UNDO
        </p>
        <p @click="reset" class="reset">
          RESET
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Game from '~/components/game.vue'

export default {
  components: {
    Game
  },
  computed: {
    ...mapGetters({
      game: 'game/game',
      gameOver: 'game/gameOver'
    })
  },
  mounted () {
    const urlGame = this.$route.params.game
    if (typeof urlGame === 'string' && urlGame.length >= 2) {
      this.setGameFromUrl(urlGame)
    }
  },
  methods: {
    ...mapActions({
      setGameFromUrl: 'game/setGameFromUrl',
      reset: 'game/reset',
      undo: 'game/undo'
    })
  }
}
</script>

<style lang="scss" scoped>
    .container {
        background: grey;
        width: 100%;
        height: 100vh;
        display: grid;
        .content{
            width: 600px;
            margin: auto;
            text-align:center;
        }
    }

    .lost{
        font-size: 2em;
        color: red;
        margin: 0.5em 0;
    }

    .game-wrapper {
        width:100%;
    }

    .controls{
        margin-top: 2em;
        p{
            display: inline-block;
            padding: 0.5em 1em;
            background: darkgray;
            cursor: pointer;
            color: rgb(240,240,240);
            font-size:1.25em;
            margin:0 1em;
        }
    }
</style>
