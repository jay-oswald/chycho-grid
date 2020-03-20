export const state = {
  size: 10,
  game: [],
  next: [],
  gameOver: false
}

export const getters = {
  game (state) {
    return state.game
  },
  next (state) {
    return state.next
  },
  size (state) {
    return state.size
  },
  gameOver (state) {
    return state.gameOver
  }
}

export const mutations = {
  addClick (state, { row, col }) {
    state.game.push(getKey(row, col))
  },
  resetNext (state) {
    state.next.splice(0, state.next.length)
  },
  addNext (state, { row, col }) {
    state.next.push(getKey(row, col))
  },
  isGameOver (state, gameOver) {
    state.gameOver = gameOver
  },
  setGame (state, game) {
    state.game.splice(0, state.game.length)
    game.forEach((tile) => {
      state.game.push(tile)
    })
  },
  resetGame (state) {
    state.game.splice(0, state.game.length)
  },
  undo (state) {
    state.game.pop()
  }
}

export const actions = {
  async addClick ({ commit, getters, setters, dispatch }, { row, col }) {
    await commit('addClick', { row, col })
    await dispatch('setNext')
    await dispatch('isGameOver')
  },
  async setNext ({ commit, dispatch, state }) {
    commit('resetNext')

    if (state.game.length === 0) {
      return
    }

    let coords = state.game[state.game.length - 1]
    coords = coords.split('-')
    const row = parseInt(coords[0])
    const col = parseInt(coords[1])

    // Up
    const rowPlus3 = row + 3
    if (rowPlus3 <= state.size && !await dispatch('checkedIfClicked', { row: rowPlus3, col })) {
      commit('addNext', { row: rowPlus3, col })
    }

    // Down
    const rowMinus3 = row - 3
    if (rowMinus3 >= 1 && !await dispatch('checkedIfClicked', { row: rowMinus3, col })) {
      commit('addNext', { row: rowMinus3, col })
    }

    // Right
    const colPlus3 = col + 3
    if (colPlus3 <= state.size && !await dispatch('checkedIfClicked', { row, col: colPlus3 })) {
      commit('addNext', { row, col: colPlus3 })
    }

    // Left
    const colMinus3 = col - 3
    if (colMinus3 >= 1 && !await dispatch('checkedIfClicked', { row, col: colMinus3 })) {
      commit('addNext', { row, col: colMinus3 })
    }

    // Diagianials
    const rowPlus2 = row + 2
    const colPlus2 = col + 2
    const rowMinus2 = row - 2
    const colMinus2 = col - 2

    // Up Right
    if (rowPlus2 <= state.size && colPlus2 <= state.size &&
            !await dispatch('checkedIfClicked', { row: rowPlus2, col: colPlus2 })) {
      commit('addNext', { row: rowPlus2, col: colPlus2 })
    }

    // Up Left
    if (rowPlus2 <= state.size && colMinus2 >= 1 &&
            !await dispatch('checkedIfClicked', { row: rowPlus2, col: colMinus2 })) {
      commit('addNext', { row: rowPlus2, col: colMinus2 })
    }

    // Down Left
    if (rowMinus2 >= 1 && colMinus2 >= 1 &&
            !await dispatch('checkedIfClicked', { row: rowMinus2, col: colMinus2 })) {
      commit('addNext', { row: rowMinus2, col: colMinus2 })
    }

    // Down Right
    if (rowMinus2 >= 1 && colPlus2 <= state.size &&
            !await dispatch('checkedIfClicked', { row: rowMinus2, col: colPlus2 })) {
      commit('addNext', { row: rowMinus2, col: colPlus2 })
    }
  },
  checkedIfClicked ({ getters }, { row, col }) {
    const game = getters.game
    return (game.includes(getKey(row, col)))
  },
  async setGameFromUrl ({ commit, dispatch }, csv) {
    const tiles = csv.split(',')
    const game = []
    let col = 0
    let row = 0
    tiles.forEach((tile) => {
      col = tile.substring(0, 1)
      row = parseInt(tile.substring(1))
      col = col.charCodeAt(0) - 64
      game.push(getKey(row, col))
    })
    await commit('setGame', game)
    await dispatch('setNext', { row, col })
    await dispatch('isGameOver')
  },
  isGameOver ({ commit, getters }) {
    const game = getters.game
    const next = getters.next

    let gameOver = false

    if (game.length > 0 && next.length === 0) {
      gameOver = true
    }

    commit('isGameOver', gameOver)
  },
  reset ({ commit }) {
    commit('resetGame')
    commit('resetNext')
    commit('isGameOver', false)
  },
  async undo ({ commit, dispatch }) {
    await commit('undo')
    await dispatch('setNext')
    await dispatch('isGameOver', false)
  }
}

function getKey (row, col) {
  return row + '-' + col
}
