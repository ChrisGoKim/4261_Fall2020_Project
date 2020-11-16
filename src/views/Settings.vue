<template>
  <div class="settings">
    <amplify-authenticator
      style="--amplify-font-family: Quicksand"
      v-if="authState !== 'signedin'"
    >
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
          style="font-family: Quicksand"
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
          style="font-family: Quicksand"
          class="mx-2"
          dark
          large
          v-on:click="deleteUser"
        >
          Delete user
        </v-btn>
        <v-spacer></v-spacer>
      </v-radio-group>
      <v-radio-group row>
        <v-spacer></v-spacer>
        <v-btn
          style="font-family: Quicksand"
          class="mx-2"
          dark
          large
          v-on:click="toAbout"
        >
          About this app
        </v-btn>
        <v-spacer></v-spacer>
      </v-radio-group>
      <v-radio-group row>
        <v-spacer></v-spacer>
        <amplify-sign-out
          style="--amplify-font-family: Quicksand"
          @click="persist()"
        ></amplify-sign-out>
        <v-spacer></v-spacer>
      </v-radio-group>
    </div>
  </div>
</template>

<script>
import { onAuthUIStateChange } from "@aws-amplify/ui-components";
import API from "@aws-amplify/api";

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
            error;
          });

        alert("User deleted!");
      }
      this.$router.push({ path: "/" });
    },
    goHome() {
      this.$router.push({ path: "/" });
    },
    toAbout() {
      this.$router.push({ path: "/about" });
    },
    persist() {
      localStorage.setItem("consent", "false");
    }
  }
};
</script>

<style>
@import "../components/design/rowStyle.css";
</style>
