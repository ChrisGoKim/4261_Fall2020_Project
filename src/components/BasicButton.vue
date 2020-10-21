<template>
  <div class="basic-button">
    <button v-on:click="count++">
      You clicked me {{ count }} times.
    </button>
  </div>
</template>

<script>

export default {
  name: 'BasicButton',
  data() {
    return {
      count: 0
    }
  }
}

</script>


<style>
.demo {
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
  user-select: none;
  overflow-x: auto;
}

.basic-button {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100vh;
}
</style>