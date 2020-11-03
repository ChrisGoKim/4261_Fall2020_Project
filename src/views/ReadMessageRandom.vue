<style>
v-btn {
  margin-left: 5px;
  margin-right: 5px;
}
</style>

<template>
  <div class="read">
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
        <b style="font-family: Quicksand;"
          >Welcome, {{ user.username }}&#8205; &#8205; &#8205; &#8205; &#8205;
          &#8205;
        </b>
      </v-radio-group>
      <v-radio-group row>
        <v-spacer></v-spacer>
        <v-col> </v-col>
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
                    <v-card color="#385F73" dark>
                      <v-card-title
                        style="font-family: 'Dancing Script', cursive;"
                        id="message-subject"
                      >
                        Read Message
                      </v-card-title>

                      <v-card-text
                        style="font-family: Quicksand"
                        align="left"
                        id="message-body"
                      >
                        Click the "Get Random Message" button to get a random
                        message...
                      </v-card-text>

                      <v-card-actions>
                        <v-btn
                          color="#1f99bf"
                          v-on:click="getRandomMsg"
                          style="font-family: Quicksand;
                          margin-right: 5px;"
                        >
                          Get Random Message
                        </v-btn>
                        <v-btn
                          color="#1f99bf"
                          v-on:click="goHome"
                          style="font-family: Quicksand;
                          margin-left: 5px;"
                        >
                          Close
                        </v-btn>
                      </v-card-actions>
                    </v-card>

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
      uid: undefined,
      subject: undefined,
      body: undefined,
      originalSender: undefined,
      receiverQueue: undefined,
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
    getRandomMsg() {
      //USING API GATEWAY ENDPOINT
      const apiName = "MiaB_1";
      const path = "/message/read-random";
      const myInit = {
        // OPTIONAL
        body: {},
        headers: {} // OPTIONAL
      };

      API.get(apiName, path, myInit)
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          // alert(JSON.stringify(response, null, 2));
          // const response_values = JSON.stringify(response, null, 2);
          document.getElementById("message-subject").innerHTML = "Subject: " + response.Item.subject;
          document.getElementById("message-body").innerHTML = response.Item.body;
          this.uid = response.Item.uid;
          this.subject = response.Item.subject;
          this.body = response.Item.body;
          this.originalSender = response.Item.originalSender;


        })
        .catch(error => {
          console.log(error.response);
        });

      //Get the sender of the read message(the new recipeint if a reply is made) message queue
      this.getReceiversQueue()
    },
    goHome() {
      this.$router.push({ path: "/" });
    },
    reply() {
      //Keep old subject
      const messageSubject = document.getElementById("message-subject").value;
      //Appending the reply onto the previous message
      const messageBody = this.body + "--->" + document.getElementById("message-body").value;

      //Creating a new message here so the sender should be SELF while the receiver should be the sender of the GET message
      const params = {
        subject: messageSubject,
        body: messageBody,
        originalSender : this.user,
        targetedReceiver : this.originalSender,
        uid : this.uid,
        receiverQ : this.receiverQueue
      };

      //USING API GATEWAY ENDPOINT
      const apiName = "MiaB_1";
      const path = "/message/reply";
      const myInit = {
        // OPTIONAL
        body: params,
        headers: {} // OPTIONAL
      };

      API.post(apiName, path, myInit)
        .then(response => {
          response.data
        })
        .catch(error => {
          alert(error.data)
        });

      alert("Message sent!");
      this.$router.push({ path: "/" });
    },
    getReceiversQueue() {
      //Parameter for the user who is getting the reply added to their queue
      const params = {
        sub: this.originalSender
      }

      const apiName = "MiaB_1";
      const path = "/message/read-user-queue";
      const myInit = {
        // OPTIONAL
        body: params,
        headers: {} // OPTIONAL
      };

      API.get(apiName, path, myInit)
        .then(response => {

          this.receiverQueue = response.Item.receiverQueue
        })
        .catch(error => {
          console.log(error.response);
        });
    } // end of methods
  }
};
</script>

<style>
.v-card__text {
  font-size: 1.2rem !important;
  color: white !important;
}
</style>