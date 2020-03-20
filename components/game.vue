<template>
  <div
    :style="{
      gridTemplateColumns: 'repeat(' + (size + 1) + ', 1fr)',
    }"
    class="game"
  >
    <template v-for="rowIndex in size + 1">
      <div class="item header">
        <div v-if="rowIndex !== 1" class="content">
          {{ size - rowIndex + 2 }}
        </div>
      </div>
      <template v-if="rowIndex === 1">
        <div
          v-for="colIndex in size"
          :key="rowIndex * size + colIndex"
          class="item header"
        >
          <div class="content">
            {{ colHeader(colIndex) }}
          </div>
        </div>
      </template>
      <div
        v-else
        v-for="colIndex in size"
        :key="rowIndex * size + colIndex"
        :class="{
          item: true,
          next: isValidNext(size - rowIndex + 2, colIndex),
        }"
        :row="size - rowIndex + 2"
        :col="colIndex"
        @click="gameClick(size - rowIndex + 2, colIndex)"
      >
        <div class="content">
          {{ itemContent(size - rowIndex + 2, colIndex) }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  head () {
    return {
      title: 'Chycho Grid Game'
    }
  },
  computed: {
    ...mapGetters({
      game: 'game/game',
      next: 'game/next',
      size: 'game/size'
    })
  },
  watch: {
    game (newValue, oldValue) {
      history.replaceState({}, null, this.gameToUrlString())
    }
  },
  methods: {
    ...mapActions({
      addClick: 'game/addClick'
    }),
    itemContent (row, col) {
      const key = this.getKey(row, col)
      if (this.game.includes(key)) {
        const value = this.game.indexOf(key)
        return value + 1
      }
      return ''
    },
    gameClick (row, col) {
      if (this.validClick(row, col)) {
        this.addClick({ row, col })
      }
    },
    validClick (row, col) {
      if (this.game.length === 0) { // No tiles clicked, must be good
        return true
      }

      const thisKey = this.getKey(row, col)
      if (this.game.includes(thisKey)) {
        return false // Already clicked
      }

      return (this.next.includes(thisKey))
    },
    isValidNext (row, col) {
      return (this.next.includes(this.getKey(row, col)))
    },
    getKey (row, col) {
      return row + '-' + col
    },
    colHeader (col) {
      return String.fromCharCode(64 + col)
    },
    gameToUrlString () {
      let string = ''
      this.game.forEach((key) => {
        const parts = key.split('-')
        const row = parts[0]
        let col = parseInt(parts[1])
        col = String.fromCharCode(64 + col)
        string += col + row + ','
      })
      string = string.substr(0, string.length - 1)
      return string
    }
  }
}

</script>

<style scoped lang="scss">
.game{
    display: grid;
    grid-gap: 5px;
    width: 100%;
    .item{
        color: rgb(240,240,240);
        position: relative;
        background:darkgray;
        &.header{
            background: transparent;

        }
        &:hover{
            opacity: 0.5;
        }
        &:after {
            content: "";
            display: inline-block;
            padding-bottom: 100%;
        }
        &.next{
            background: rgba(240, 240, 0, 0.5);
            cursor: pointer;
        }
        .content{
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 100%;
            text-align:center;
            font-weight:bold;
            font-size:2em;
            pointer-events: none;
        }
    }
}

</style>
