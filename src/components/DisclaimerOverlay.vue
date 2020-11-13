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
      <button v-on:click="agree">Agree and Continue</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      overlayActivityStyle: {
        display: "block",
      },
    };
  },
  methods: {
    agree() {
      // TODO: Change user's showDisclaimer to false

      // If user has consented:
      this.overlayActivityStyle.display = "none";
    },
  },
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