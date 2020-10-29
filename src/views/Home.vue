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
      <v-radio-group row>
        <v-spacer></v-spacer>
        <b>Welcome, {{ user.username }}&#8205; &#8205; &#8205; &#8205; &#8205; &#8205; </b>
      </v-radio-group>
      <v-radio-group row>
        <v-spacer></v-spacer>
        <v-btn
            class="mx-2"
            dark
            large
            color="black"
            v-on:click="writeMessage"
        >
          <v-icon>mdi-plus</v-icon>
          &#8205; New Message
        </v-btn>
        &#8205; &#8205; &#8205; &#8205;
      </v-radio-group>
      <br><br/>

      <div>
        <v-main>
          <v-container>
            <v-row>
              <v-col
                  cols="12"
                  sm="2"
              >
                <v-sheet
                    rounded="lg"
                    min-height="268"
                >
                  <!-- left column -->
                </v-sheet>
              </v-col>

              <v-col
                  cols="12"
                  sm="8"
              >
                <v-sheet
                    min-height="70vh"
                    rounded="lg"
                >
                  <v-col cols="12">
                    <v-card
                        color="#385F73"
                        dark
                    >
                      <v-card-title class="justify-center">
                        Message 1
                      </v-card-title>

                      <v-card-subtitle>Description of the card goes here</v-card-subtitle>

                      <v-card-actions>
                        <v-btn
                            outlined
                            v-on:click="readMessageRandom"
                        >
                          Read
                        </v-btn>
                      </v-card-actions>
                    </v-card>

                    <br><br/>

                    <v-card
                        color="#385F73"
                        dark
                    >
                      <v-card-title class="justify-center">
                        Message 2
                      </v-card-title>

                      <v-card-subtitle>Description of the card goes here</v-card-subtitle>

                      <v-card-actions>
                        <v-btn
                            outlined
                            v-on:click="readMessage"
                        >
                          Read
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-sheet>
              </v-col>

              <v-col
                  cols="12"
                  sm="2"
              >
                <v-sheet
                    rounded="lg"
                    min-height="268"
                >
                  <!-- right column -->
                </v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
      </div>

      <amplify-sign-out></amplify-sign-out>
    </div>
  </div>
</template>


<script>
import {onAuthUIStateChange} from '@aws-amplify/ui-components'

export default {
  name: 'AuthStateApp',
  created() {
    this.getLetters();
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    })
  },
  // Where we store data or create static variables
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
  },
  methods: {
    readMessage() {
      this.$router.push({path: "/read"})
    },
    readMessageRandom() {
      this.$router.push({path: "/read_random"})
    },
    writeMessage() {
      this.$router.push({path: "/write"})
    },
    getLetters() {
        // var savedLetters = this.$store.state.savedLetters;
        // get letters from API
        this.$store.commit('saveLetter', [{subject: 'test subject', body: 'test body'}])
        console.log(this.$store.state)
     }// end of methods
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