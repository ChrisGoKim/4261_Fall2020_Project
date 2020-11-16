<template>
  <div class="about">
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
        &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205;
        &#8205; &#8205; &#8205; &#8205; &#8205; &#8205;
        <img src="@/assets/logo.png" height="50px" />
        <v-spacer></v-spacer>
        <h1 style="font-family: Quicksand">Message in a Bottle</h1>
        <v-spacer></v-spacer>
        <v-btn
          style="font-family: Quicksand"
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
        <v-card color="#385F73" dark>
          <v-card-title
            style="font-family: 'Dancing Script', cursive"
            id="message-subject"
          >
            About
          </v-card-title>

          <v-card-text
            style="font-family: Quicksand"
            align="left"
            id="message-body"
          >
            Message in a Bottle is made by Team CETD, from Chris Kim, Enoch
            Kumala, Tony Tan, and DJ Yu.
          </v-card-text>
        </v-card>
        <v-spacer></v-spacer>
      </v-radio-group>
      <br />
      <v-radio-group row>
        <v-spacer></v-spacer>
        <v-sheet style="background-color: transparent" rounded="lg">
          <amplify-sign-out
            style="--amplify-font-family: Quicksand"
          ></amplify-sign-out>
        </v-sheet>
        <v-spacer></v-spacer>
      </v-radio-group>
    </div>
  </div>
</template>

<script>
import { onAuthUIStateChange } from "@aws-amplify/ui-components";
// import API from "@aws-amplify/api";
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
        Auth.signOut({ global: true });

        //USING API GATEWAY ENDPOINT
        // const params = {
        //   requester: this.user,
        // };
        // const apiName = "MiaB_1";
        // const path = "/user/delete-user";
        // const myInit = {
        //   // OPTIONAL
        //   body: params,
        //   headers: {}, // OPTIONAL
        // };

        // API.post(apiName, path, myInit)
        //   .then((response) => {
        //     response.data;
        //   })
        //   .catch((error) => {
        //     alert(error);
        //   });

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
    openSettings() {
      this.$router.push({ path: "/settings" });
    }
  }
};
</script>

<style>
@import "../components/design/rowStyle.css";
</style>
