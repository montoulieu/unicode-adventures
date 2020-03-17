<template>
  <div>
    <div class="wrapper">
      <span class="current-location">{{ state.currentMapData.name }}</span>
      <div class="display-area">
        <div class="pixel-screen" :class="[state.currentMapData.playerPos ? `pos-${state.currentMapData.playerPos}` : '']">
          <div class="player-wrapper">
            <span class="player">🧍🏻‍♂️</span>
          </div>

          <div :class="[
            `map-${camelToKebab(state.currentMap)}`,
            'background-scene'
            ]">
            <span
              v-for="(tile, index) in state.currentMapData.tiles"
              :key="tile.id"
              class="tile"
              @click.native="interactWithTile(index)"
            >
              {{ tile }}
            </span>
          </div>
        </div>
      </div>

      <!-- <ul class="locations">
        <li>Go to:</li>
        <li
          v-for="location in state.currentMapData.locations"
          :key="location.id"
          class="location-name"
        >
          <button
            @click="setCurrentMap(location.mapName)"
          >
            {{ location.prettyName }}
          </button>
        </li>
      </ul> -->

      <div class="message-box">
        <span class="text" v-html="state.messageBoxText"></span>
      </div>
    </div>
    <details class="debug">
      <summary>🐞: State</summary>
      <pre>{{ state }}</pre>
    </details>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import mapData from './json/maps.json';

export default {
  setup() {
    let messageBoxText = ref('You awake on the shore...')
    let currentMap = ref('shore')
    let currentMapData = ref(mapData[currentMap.value]);

    window.addEventListener("keydown", function(e){
      // console.log(e.keyCode);
      keyboardControls(e.keyCode);
    });

    let state = reactive({
      currentMap,
      currentMapData,
      messageBoxText
    })

    const camelToKebab = (string) => {
      return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    let setCurrentMap = (mapName) => {
      state.currentMap = mapName;
      state.currentMapData = mapData[currentMap.value]
      console.log(currentMap)
    }

    const interactWithTile = (tile) => {
      console.log(tile + 1)

      if (state.currentMapData.interactions) {
        const interaction = state.currentMapData.interactions.filter(interaction => interaction.tile === tile + 1)[0]
        if (interaction) {
          if(interaction.type === 'message') {
            state.messageBoxText = interaction.message
          }
          if(interaction.type === 'pickup') {
            state.messageBoxText = interaction.message
          }
          if (interaction.type === 'teleport') {
            console.log(interaction.mapName)
            setCurrentMap(interaction.mapName)
            state.messageBoxText = interaction.message
          }
        }
      }
    }

    const keyboardControls = (keyCode) => {
      const keyMap = {
        '38': 'up',
        '40': 'down',
        '37': 'left',
        '39': 'right',
      }

      console.log(state.currentMapData.locations)
      const location = state.currentMapData.locations.filter(location => location.key === keyMap[keyCode])[0]
      console.log(location);

      if (location) {
        setCurrentMap(location.mapName)
      }
    }

    return {
      state,
      setCurrentMap,
      interactWithTile,
      camelToKebab
    }
  }
}
</script>

<style>
  html {
    background: black;
    font-family: Menlo, 'Courier New', Courier, monospace;
    color: white;
    user-select: none;
  }

  .debug {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 1rem;
    color: white;
  }

  .wrapper {
    padding: 2rem 0;
    width: 480px;
    margin: 0 auto;
    max-width: 100%;
    position: relative;
  }

  .current-location {
    margin-bottom: 1rem;
    display: inline-block;
  }

  .display-area {
    border: 4px solid white;
    border-radius: 22px;
    margin: 0 auto;
    filter: contrast(2.5) grayscale(.2);
    overflow: hidden;
    position: relative;
    cursor: url("/assets/images/cursor-hand.gif"), auto;

  }

  .pixel-screen {
    filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='b' x='0' y='0'%3E%3CfeFlood x='0.1' y='0.1' height='0.1' width='0.1'/%3E%3CfeComposite width='4' height='4'/%3E%3CfeTile result='a'/%3E%3CfeComposite in='SourceGraphic' in2='a' operator='in'/%3E%3CfeMorphology operator='dilate' radius='2'/%3E%3C/filter%3E%3C/svg%3E#b");
    height: 480px;
    position: relative;

  }

  .player-wrapper {
    font-size: 5.2rem;
    z-index: 10;
    text-shadow: 0 0 3px black;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 20%;
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .message-box {
    border: 4px solid white;
    min-height: 5rem;
    margin: 2rem auto;
    padding: 1rem;
    border-radius: 22px;
  }

  .background-scene {
    position: absolute;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    line-height: 0;
  }

  .tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4.8rem;
    text-shadow: 0 4px 4px black;

  }

  .locations {
    list-style-type: none;
    padding: 0;
    margin-bottom: 0;
    margin-top: 2rem;
    position: absolute;
    left: -200px;
    top: 0;
    width: 180px;
  }

  .locations li {
    margin-bottom: 0.5rem;

  }

  .locations button {
    color: white;
    font-family: Menlo, 'Courier New', Courier, monospace;
    border: 2px solid white;
    padding: 0.5rem;
    border-radius: 5px;
    background: transparent;
    font-size: 1rem;
    width: 100%;
    text-align: left;
    line-height: 1;
  }


  /* Backgrounds */
  .map-shore {
    background: linear-gradient(to bottom,  #6a8a63 0%,#ad9d8b 40%, #a3896c 75%, #fff 75%, #2989d8 80%,#1e5799 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  }
  .map-beach-pass {
    background: linear-gradient(to right, #6a8a63 0%,#6e6122 50%, #6a8a63 100%);
  }
  div[class^="map-village"] {
    background: #6a8a63;
  }
  .map-convenience-store-village-west,
  .map-abandoned-house {
    background-size: 5px 5px;
    background-image:
      linear-gradient(to right, black 1px, rgb(111, 92, 69) 1px),
      linear-gradient(to bottom, black 1px, transparent 1px);
  }

  /* POS Locations */
  .pos-row-4-col-3 .player-wrapper {
    bottom: -40%
  }
  .pos-row-4-col-4 .player-wrapper {
    bottom: -40%;
    right: -40%;
  }
</style>
