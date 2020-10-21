<template>
  <div class="page-header">
    <h3>{{ text }}</h3>
  </div>
</template>

<script>

export default {
  name: 'PageHeader',
  props: ['text']
}

</script>


<style>
.page-header {
  font-family: sans-serif;
  color: darkgoldenrod;
  font-size: 50px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
  overflow-x: auto;
}
</style>