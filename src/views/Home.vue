<template>
  <div class="home">
    <amplify-authenticator v-if="authState !== 'signedin'">
      <amplify-sign-in header-text="Message in a Bottle" slot="sign-in"></amplify-sign-in>
      <amplify-sign-up
        slot="sign-up"
        username-alias="username"
        :form-fields.prop="formFields"
    ></amplify-sign-up>
    </amplify-authenticator>
    <div v-if="authState === 'signedin' && user">
      <amplify-sign-out></amplify-sign-out>
      <div>Hello, {{user.username}}</div>
    </div>
  </div>
</template>


<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components'

export default {
  name: 'AuthStateApp',
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    })
  },
  //Where we store data or create static variables
  data() {
    return {
      user: undefined,
      authState: undefined,
      formFields: [
            { 
              type: "username" 
            },
            { 
              type: "email"
              /*
              label: 'Custom email Label',
              placeholder: 'custom email placeholder',
              required: true,
              */
            },
            { 
              type: 'password'
            }            
      ]
    }
  },
  beforeDestroy() {
    return onAuthUIStateChange;
  }
}

</script>


<style>
amplify-authenticator {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100vh;
}
</style>