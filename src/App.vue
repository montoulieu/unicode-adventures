<template>
  <div>
    <!-- <game-manager /> -->
    <dialogue-manager />
    <audio-manager :mapData="state.currentMapData" />

    <div class="wrapper">
      <span class="current-location">{{ state.currentMapData.name }}</span>

      <display-area v-show="false"/>
      <div class="display-area z-10">
        <div class="pixel-screen" :class="[state.currentMapData.playerPos ? `pos-${state.currentMapData.playerPos}` : '']">
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

      <dialogue-box :messageText="state.messageBoxText" />
    </div>

    <details class="debug">
      <summary>🐞: State</summary>
      <pre>{{ state }}</pre>
    </details>
  </div>
</template>

<script>
import { ref, reactive } from "@vue/composition-api";

import mapData from './json/maps.json';
import gameManager from './js/gameManager';
import DisplayArea from './components/DisplayArea';
import DialogueManager from './components/DialogueManager';
import AudioManager from './components/AudioManager';
import DialogueBox from './components/DialogueBox';

export default {
  components: {
    DisplayArea,
    DialogueManager,
    AudioManager,
    DialogueBox
  },

  setup() {
    gameManager();

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

<style lang="postcss">
  html {
    background: black;
    font-family: Menlo, 'Courier New', Courier, monospace !important;
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
    max-width: 100%;
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
    /* filter: contrast(2.5) grayscale(.2); */
    filter: contrast(2.5) grayscale(1) sepia(1) saturate(2.75) hue-rotate(38deg);
    overflow: hidden;
    position: relative;
    cursor: url("/assets/images/cursor-hand.gif"), auto;
    /* transform: rotate3d(0,0,1, 45deg); */
    /* box-sizing: content-box; */
    /* height: 480px;
    width: 480px; */
    max-width: 100%;
  }

  .pixel-screen {
    filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='b' x='0' y='0'%3E%3CfeFlood x='0.1' y='0.1' height='0.1' width='0.1'/%3E%3CfeComposite width='4' height='4'/%3E%3CfeTile result='a'/%3E%3CfeComposite in='SourceGraphic' in2='a' operator='in'/%3E%3CfeMorphology operator='dilate' radius='2'/%3E%3C/filter%3E%3C/svg%3E#b");
    position: relative;
    height: 480px;
    width: 480px;
    max-width: 100%;
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
    /* transform: rotate3d(0,0,1, -45deg); */
  }

  .tiles {
    position: absolute;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    line-height: 0;
  }




  .tile-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5.8rem;
    text-shadow: 0 4px 4px black;
    /* transform: rotate3d(0,0,1, -45deg); */
  }

  @media screen and (max-width: 540) {
    .tile-wrapper {
      font-size: 3.8rem;

    }
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

    .background-scene {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .map-shore {
      background: linear-gradient(to bottom, #7e7d7c 0%,#7e7d7c 30%, #a8a6a5 75%, #fff 75%, #2989d8 80%,#1e5799 100%);
      animation: water 20s linear infinite;
    }

    div[class^="map-jungle-pass"] {
      background: linear-gradient(to right, #7e7d7c 0%,#6e6122 50%, #7e7d7c 100%);
    }

    div[class^="map-village"] {
      background: #7e7d7c;
    }

    .map-convenience-store-village-west,
    .map-abandoned-house {
      background-size: 5px 5px;
      background-image:
        linear-gradient(to right, black 1px, rgb(104, 98, 98) 1px), linear-gradient(to bottom, black 1px, transparent 1px);
    }

  /* Backgrounds */
  .map {
  }

  @keyframes water {
    0% {
      background: linear-gradient(to bottom, #7e7d7c 0%,#7e7d7c 30%, #a8a6a5 75%, #fff 75%, #2989d8 80%,#1e5799 100%);
    }

    50% {
      background: linear-gradient(to bottom, #7e7d7c 0%,#7e7d7c 30%, #a8a6a5 75%, #a8a6a5 75%, #2989d8 80%,#1e5799 100%);

    }
    100% {
      background: linear-gradient(to bottom, #7e7d7c 0%,#7e7d7c 30%, #a8a6a5 75%, #fff 75%, #2989d8 80%,#1e5799 100%);
    }
  }
  /* [data-tile="⬆"],
  [data-tile="⬇"],
  [data-tile="⬅"],
  [data-tile="⮕"] {
    transform:rotateZ(0deg);
  }

  [data-tile="🌴"] .tile {
    animation-duration: 1s;
    animation-name: sway;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    transform-origin: top center;
  }

  @keyframes sway {
    from {
      transform: skew(-2deg, 0);
    }

    to {
      transform: skew(2deg, 0);
    }
  } */


  /* POS Locations */
  .pos-row-2-col-3 .player-wrapper {
    bottom: 40%;
  }
  .pos-row-2-col-4 .player-wrapper {
    bottom: 40%;
    right: -44%;
  }

  .pos-row-3-col-4 .player-wrapper {
    right: -44%;
  }

  .pos-row-4-col-3 .player-wrapper {
    bottom: -40%;
  }
  .pos-row-4-col-4 .player-wrapper {
    bottom: -40%;
    right: -44%;
  }
</style>
