<style>
@import url("https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Quicksand&display=swap");
</style>

<template>
  <div class="home">
    <amplify-authenticator
        style="--amplify-font-family: Quicksand; background-color: transparent"
        v-if="authState !== 'signedin'"
    >
      <amplify-sign-in
          header-text="Message in a Bottle"
          slot="sign-in"
          @click="check()"
      ></amplify-sign-in>
      <amplify-sign-up
          slot="sign-up"
          username-alias="username"
          :form-fields.prop="formFields"
      ></amplify-sign-up>
    </amplify-authenticator>
    <div v-if="authState === 'signedin' && user">
      <disclaimer v-if="showDisclaimer"></disclaimer>
      <v-radio-group row>
        &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205; &#8205;
        &#8205; &#8205; &#8205; &#8205; &#8205; &#8205;
        <a href="/"><img src="@/assets/logo.png" height="50px"/></a>
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
          <v-icon>mdi-wrench</v-icon>
        </v-btn>
        &#8205; &#8205; &#8205; &#8205; &#8205;
      </v-radio-group>
      <v-radio-group row>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        &#8205; &#8205; &#8205; &#8205; &#8205;
      </v-radio-group>
      <v-radio-group row>
        <v-spacer></v-spacer>
        <p>&#8205; &#8205; &#8205;</p>
        <v-btn
            style="font-family: Quicksand"
            class="mx-2"
            dark
            large
            v-on:click="writeMessage"
        >
          <v-icon>mdi-plus</v-icon>
          &#8205; New Message
        </v-btn>
        <v-spacer></v-spacer>
      </v-radio-group>
      <v-radio-group row>
        <v-spacer></v-spacer>
        <p>&#8205; &#8205; &#8205;</p>
        <v-btn
            style="font-family: Quicksand"
            class="mx-2"
            dark
            large
            v-on:click="readMessageRandom"
        >
          <v-icon>mdi-cached</v-icon>
          &#8205; Get Random Message
        </v-btn>
        <v-spacer></v-spacer>
      </v-radio-group>
      <v-radio-group row>
        <v-spacer></v-spacer>
        <p>&#8205; &#8205; &#8205;</p>
        <v-btn
            style="font-family: Quicksand"
            class="mx-2"
            dark
            large
            v-on:click="readMessage"
        >
          <v-icon>mdi-format-list-bulleted-square</v-icon>
          &#8205; View Inbox
        </v-btn>
        <v-spacer></v-spacer>
      </v-radio-group>
      <v-radio-group row>
        <v-spacer></v-spacer>
        <amplify-sign-out
            style="--amplify-primary-color: cornflowerblue;
                  --amplify-primary-shade: #2880fd;
                  --amplify-primary-tint: #2880fd;"
        ></amplify-sign-out>
        <v-spacer></v-spacer>
      </v-radio-group>
    </div>
  </div>
</template>

<script>
import DisclaimerOverlay from "../components/DisclaimerOverlay";
import {onAuthUIStateChange} from "@aws-amplify/ui-components";
import API from "@aws-amplify/api";

export default {
  components: {
    disclaimer: DisclaimerOverlay
  },
  name: "AuthStateApp",
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
      if (
          localStorage.getItem("consent") == "false" &&
          localStorage.getItem("check") == "true"
      ) {
        this.showConsent();
        this.addUserGetInbox();
      }
    });
  },
  // Where we store data or create static variables
  data() {
    return {
      user: undefined,
      authState: undefined,
      bHasPendingInbox: false,
      userConsent: undefined,
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
      ],
      showDisclaimer: undefined
    };
  },
  beforeDestroy() {
    return onAuthUIStateChange;
  },
  methods: {
    addUserGetInbox() {
      if (!this.user) {
        // console.log("cant find a user");
        return;
      }
      const params = {
        user: this.user.attributes.sub
      };

      //USING API GATEWAY ENDPOINT
      const apiName = "MiaB_1";
      const path = "/user/add-user-return-inbox";
      const myInit = {
        // OPTIONAL
        body: params,
        headers: {} // OPTIONAL
      };

      API.put(apiName, path, myInit)
          .then(response => {
            var inboxLen = response;
            // console.log(inboxLen);
            if (inboxLen < 1) {
              this.bHasPendingInbox = false;
            } else {
              this.bHasPendingInbox = true;
            }
          })
          // eslint-disable-next-line no-unused-vars
          .catch(error => {
            //alert(error);
          });
    },
    showConsent() {
      if (!this.user) {
        // console.log("cant find a user");
        this.showDisclaimer = false;
        localStorage.setItem("consent", "true");
        localStorage.setItem("check", "false");
        return;
      }

      // USING API GATEWAY ENDPOINT
      const apiName = "MiaB_1";
      const path = "/user/check-consent";
      const params = {
        currUser: this.user.attributes.sub
      };

      const myInit = {
        // OPTIONAL
        body: params,
        headers: {} // OPTIONAL
      };

      API.put(apiName, path, myInit)
          .then(response => {
            this.userConsent = response.Item.consent;
            this.showDisclaimer = !this.userConsent;
            localStorage.setItem("consent", "true");
            localStorage.setItem("check", "false");
          })
          .catch(error => {
            error.response;
          });
    },
    agree() {
      // TODO: Change user's showDisclaimer to false
      if (!this.user) {
        // console.log("cant find a user");
        localStorage.setItem("consent", "true");
        localStorage.setItem("check", "false");
        return;
      }
      const params = {
        user: this.user.attributes.sub
      };

      //USING API GATEWAY ENDPOINT
      const apiName = "MiaB_1";
      const path = "/user/consent-agree";
      const myInit = {
        // OPTIONAL
        body: params,
        headers: {} // OPTIONAL
      };

      API.put(apiName, path, myInit)
          .then(response => {
            if (response) {
              this.showDisclaimer = false;
              localStorage.setItem("consent", "true");
              localStorage.setItem("check", "false");
            }
            this.showDisclaimer = false;
            localStorage.setItem("consent", "true");
            localStorage.setItem("check", "false");
          })
          .catch(error => {
            error;
          });

      localStorage.setItem("consent", "true");
      localStorage.setItem("check", "false");
    },
    readMessage() {
      this.$router.push({path: "/inbox"});
    },
    readMessageRandom() {
      this.$router.push({path: "/read_random"});
    },
    openSettings() {
      this.$router.push({path: "/settings"});
    },
    check() {
      localStorage.setItem("check", "true");
      localStorage.setItem("consent", "false");
    },
    writeMessage() {
      this.$router.push({path: "/write"});
    } // end of methods
  }
};
</script>

<style>
amplify-authenticator {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100vh;
  background-color: aliceblue;
  font-family: "Raleway", "Open Sans", "sans-serif";

  --amplify-font-family: "typography-font-family";
  --amplify-primary-color: cornflowerblue;
  --amplify-primary-shade: #2880fd;
  --amplify-primary-tint: #2880fd;
}
</style>
