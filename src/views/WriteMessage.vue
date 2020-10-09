<template>
  <div class="write">
    <amplify-authenticator v-if="authState !== 'signedin'">
      <amplify-sign-in
        header-text="Message in a Bottle"
        slot="sign-in"
      ></amplify-sign-in>
      <amplify-sign-up
        slot="sign-up"
        username-alias="username"
        :form-fields.prop="formFields"
      ></amplify-sign-up>
    </amplify-authenticator>
    <div v-if="authState === 'signedin' && user">
      <v-radio-group row>
        <v-spacer></v-spacer>
        <b
          >Welcome, {{ user.username }}&#8205; &#8205; &#8205; &#8205; &#8205;
          &#8205;
        </b>
      </v-radio-group>
      <v-radio-group row>
        <v-spacer></v-spacer>
        <v-col> </v-col>
        &#8205; &#8205; &#8205; &#8205; &#8205; &#8205;
        <v-btn class="mx-2" dark large color="black" v-on:click="goHome">
          <v-icon>mdi-home</v-icon>
          &#8205; Return To Home
        </v-btn>
        &#8205; &#8205; &#8205; &#8205;
      </v-radio-group>
      <br /><br />

      <div>
        <v-main>
          <v-container>
            <v-row>
              <v-col cols="12" sm="2">
                <v-sheet rounded="lg" min-height="268">
                  <!-- left column -->
                </v-sheet>
              </v-col>

              <v-col cols="12" sm="8">
                <v-sheet min-height="70vh" rounded="lg">
                  <v-col cols="12">
                    <v-form ref="form">
                      <v-card color="#385F73" dark>
                        <v-card-title class="justify-center">
                          Compose Your Message
                        </v-card-title>

                        <v-card-text>
                          <v-text-field
                            outlined
                            counter
                            placeholder="Subject line..."
                            id="message-text"
                          ></v-text-field>
                          <v-textarea
                            outlined
                            counter
                            placeholder="Start typing here..."
                            id="message-text"
                          ></v-textarea>
                        </v-card-text>

                        <v-card-actions>
                          <v-btn outlined v-on:click="submit">
                            Send
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-form>

                    <br /><br />
                  </v-col>
                </v-sheet>
              </v-col>

              <v-col cols="12" sm="2">
                <v-sheet rounded="lg" min-height="268">
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
import { onAuthUIStateChange } from "@aws-amplify/ui-components";

// imports go here

export default {
  name: "AuthStateApp",
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    });
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
          type: "password"
        }
      ]
    };
  },
  beforeDestroy() {
    return onAuthUIStateChange;
  },
  methods: {
    goHome() {
      this.$router.push({ path: "/" });
    },
    submit() {
      const messageText = document.getElementById("message-text").value;
      console.log(messageText);
    } // end of methods
  }
};
</script>

<style>
</style>