<template>
  <div class="testing">
    <div class='row'>
      <page-header text="test"></page-header>
      <basic-button></basic-button>
    </div>
  </div>
</template>

<script>
import BasicButton from '../components/BasicButton.vue'
import PageHeader from '../components/design/PageHeader.vue'

export default {
  data() {
    return {}
  },
  components: {
    basicButton: BasicButton,
    pageHeader: PageHeader
  }
}
</script>

<style>
@import "../components/design/rowStyle.css";

</style>