<template>
  <div class="display-area z-10">
    <!-- <div class="pixel-screen" :class="[state.currentMapData.playerPos ? `pos-${state.currentMapData.playerPos}` : '']">
      <div class="player-wrapper">
        <span class="player">🧍🏻‍♂️</span>
      </div>

      <div class="map">
        <div :class="[
          `map-${camelToKebab(state.currentMap)}`,
          `background-scene`
        ]"></div>

        <div class="tiles">
          <div
            v-for="(tile, index) in state.currentMapData.tiles"
            :key="tile.id"
            class="tile-wrapper"
            @click.stop="interactWithTile(index)"
            :data-tile="tile"
          >
            <div class="tile">{{ tile }}</div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  setup() {
    // const interactWithTile = (tile) => {
    //   console.log(tile + 1)

    //   if (state.currentMapData.interactions) {
    //     const interaction = state.currentMapData.interactions.filter(interaction => interaction.tile === tile + 1)[0]
    //     if (interaction) {
    //       if(interaction.type === 'message') {
    //         state.messageBoxText = interaction.message
    //       }
    //       if(interaction.type === 'pickup') {
    //         state.messageBoxText = interaction.message
    //       }
    //       if (interaction.type === 'teleport') {
    //         console.log(interaction.mapName)
    //         setCurrentMap(interaction.mapName)
    //         state.messageBoxText = interaction.message
    //       }
    //     }
    //   }
    // }
  }
}
</script>

<style>

</style>
