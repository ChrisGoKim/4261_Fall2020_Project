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
        <v-btn
          style="font-family: Quicksand;"
          class="mx-2"
          dark
          large
          v-on:click="openSettings"
        >
          <v-icon>mdi-wrench</v-icon> </v-btn
        >&#8205; &#8205; &#8205; &#8205; &#8205;
      </v-radio-group>
      <v-radio-group row>
        <v-spacer></v-spacer>
        <v-col></v-col>
        &#8205; &#8205; &#8205; &#8205; &#8205; &#8205;
        <v-btn
          style="font-family: Quicksand;"
          class="mx-2"
          dark
          large
          color="black"
          v-on:click="goHome"
        >
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

                        <v-card-text style="padding-bottom: 0px">
                          <v-text-field
                            outlined
                            counter
                            placeholder="Subject line..."
                            id="message-subject"
                          ></v-text-field>
                          <v-textarea
                            class="ma-0"
                            outlined
                            counter
                            placeholder="Start typing here..."
                            id="message-body"
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
import API from "@aws-amplify/api";

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
    openSettings() {
      this.$router.push({ path: "/settings" });
    },
    submit() {
      const messageSubject = document.getElementById("message-subject").value;
      const messageBody = document.getElementById("message-body").value;
      //console.log(messageSubject);
      //console.log(messageBody);

      const params = {
        subject: messageSubject,
        body: messageBody,
        sender: this.user
      };

      //USING API GATEWAY ENDPOINT
      const apiName = "MiaB_1";
      const path = "/message/send";
      const myInit = {
        // OPTIONAL
        body: params,
        headers: {} // OPTIONAL
      };

      API.post(apiName, path, myInit)
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          // alert(response.data);
        })
        .catch(error => {
          (error.data);
          //console.log(error.response);
        });

      alert("Message sent!");
      this.$router.push({ path: "/" });
    } // end of methods
  }
};
</script>

<style>
.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0px;
}
</style>
