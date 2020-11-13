<template>
  <div id="overlay" v-bind:style="overlayActivityStyle">
    <div id="text">
      <div class="head">
        <h1>Terms of Service</h1>
      </div>
      <p class>
        TOS text goes here
        <br />
        <br />
        some spaces and more text
        <br />
        <br />
      </p>
      <v-btn
        style="font-family: Quicksand;"
        class="mx-2"
        dark
        large
        v-on:click="agree"
        >Agree and Continue</v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  // Where we store data or create static variables
  data() {
    return {
      overlayActivityStyle: {
        display: "block"
      }
    };
  },
  methods: {
    agree() {
      this.$parent.agree();
    }
  }
};
</script>

<style scoped>
#overlay {
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

#text {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: white;
  height: 625px;
  width: 800px;
  padding: 20px;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  display: flex;
  flex-flow: column;
  justify-content: space-around;
}

h1 {
  display: inline;
}

.head {
  justify-content: space-between;
  align-items: center;
}
</style>
