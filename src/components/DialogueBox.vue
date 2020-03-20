<template>
  <div class="dialogue-box">
    <span class="text" v-html="messageText"></span>
  </div>
</template>

<script>
export default {
  props: {
    messageText: {
      type: String,
      default: '',
    }
  }

}
</script>

<style>
  .dialogue-box {
    background: black;
    border: 4px solid white;
    min-height: 5rem;
    margin: 2rem auto 0;
    padding: 1rem;
    border-radius: 22px;
    position: relative;
    z-index: 50;
  }
</style>
