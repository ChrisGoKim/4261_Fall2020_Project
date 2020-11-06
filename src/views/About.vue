<template>
  <div class="about">
    <amplify-connect :query="listTodosQuery">
      <!--Uses the computed property in the script to check the query(see if it's loading, if it's working etc.)-->
      <template slot-scope="{ loading, data, errors }">
        <div v-if="loading">
          Loading...
        </div>
        <div v-if="errors.length > 0">Errors</div>
        <div v-else-if="data">
          {{ data }}
        </div>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import { components } from "aws-amplify-vue";

const ListTodoQuery = `query ListTodos {
    listTodos {
      items {
        id
        name
        description
      }
    }
  }
  `;
export default {
  components: {
    //Adds every single component from aws-amplify-vue
    ...components
  },
  computed: {
    listTodosQuery() {
      //Use this computed property
      return this.$Amplify.graphqlOperation(ListTodoQuery);
    }
  }
};
</script>
