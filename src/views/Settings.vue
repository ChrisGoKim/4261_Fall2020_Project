<template>
  <div class="settings">
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
      <v-radio-group row>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        &#8205; &#8205; &#8205; &#8205; &#8205;
      </v-radio-group>
      <v-radio-group row>
        <v-spacer></v-spacer>
        <v-btn
          style="font-family: Quicksand;"
          class="mx-2"
          dark
          large
          v-on:click="deleteUser"
        >
          Delete user
        </v-btn>
        <v-spacer></v-spacer>
      </v-radio-group>
      <br />
      <div>
        <v-main>
          <v-container>
            <v-row>
              <v-col cols="12" sm="5">
                <v-sheet rounded="lg" min-height="50vh">
                  <!-- left column -->
                </v-sheet>
              </v-col>

              <v-col cols="12" sm="2">
                <v-sheet min-height="50vh" rounded="lg">
                  <v-col cols="12">
                    <amplify-sign-out></amplify-sign-out>
                  </v-col>
                </v-sheet>
              </v-col>

              <v-col cols="12" sm="5">
                <v-sheet rounded="lg" min-height="50vh">
                  <!-- right column -->
                </v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
      </div>
    </div>
  </div>
</template>

<script>
import { onAuthUIStateChange } from "@aws-amplify/ui-components";
import API from "@aws-amplify/api";
import { Auth } from "aws-amplify";

export default {
  name: "AuthStateApp",
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    });
  },
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
  methods: {
    deleteUser() {
      if (confirm("Do you really want to delete your user account?")) {
        const params = {
          requester: this.user
        };

        //USING API GATEWAY ENDPOINT
        const apiName = "MiaB_1";
        const path = "/user/delete-user";
        const myInit = {
          // OPTIONAL
          body: params,
          headers: {} // OPTIONAL
        };

        API.post(apiName, path, myInit)
          .then(response => {
            response.data;
          })
          .catch(error => {
            alert(error);
          });

        alert("User deleted!");
      }
      Auth.signOut({ global: true });
      this.$router.push({ path: "/" });
    },
    goHome() {
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style>
@import "../components/design/rowStyle.css";
</style>
