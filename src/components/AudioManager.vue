<template>
  <div class="audio-manager">
    <audio

      :src="state.bgmFile"
      id="bgm"
      autoplay
      loop
      :muted="state.muted"
      class="absolute right-0 bottom-0"
    />
    <audio

      :src="state.sfxFile"
      id="sfx"
      autoplay
      loop
      :muted="state.muted"
      class="absolute right-0 bottom-0"
    />
    <button>Mute</button>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from "@vue/composition-api";

export default {
  props: {
    mapData: {
      type: Object,
      default: () => {},
    }
  },

  setup(props) {
    const muted = ref(false);
    let bgmAudio;
    let sfxAudio;

    let bgmFile = computed(() => props.mapData.bgm ? require(`@/assets/media/${props.mapData.bgm.name}.wav`) : '')
    let bgmVolume = computed(() => props.mapData.bgm ? props.mapData.bgm.volume : 0)

    let sfxFile = computed(() => props.mapData.sfx ? require(`@/assets/media/${props.mapData.sfx.name}.wav`) : '')
    let sfxVolume = computed(() => props.mapData.sfx ? props.mapData.sfx.volume : 0)

    let state = reactive({
      muted,
      bgmFile,
      bgmVolume,
      sfxFile,
      sfxVolume
    })

    const setVolume = (audio, volume) => {
      audio.volume = volume;
    }

    onMounted(() => {
      bgmAudio = document.getElementById("sfx");
      sfxAudio = document.getElementById("sfx");

      watch(() => state.bgmVolume, (volume, prevVolume) => {
        if(volume !== prevVolume && volume) {
          setVolume(bgmAudio, volume);
        }
      })

      watch(() => state.sfxVolume, (volume, prevVolume) => {
        if(volume !== prevVolume && volume) {
          setVolume(sfxAudio, volume);
        }
      })
    })





    return {
      state
    }
  }
}
</script>

<style>

</style>
