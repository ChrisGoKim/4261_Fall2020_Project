<style>
v-btn {
  margin-left: 5px;
  margin-right: 5px;
}
</style>

<template>
  <div class="read_random">
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
        <v-spacer></v-spacer>
        <v-btn
            style="font-family: Quicksand;"
            class="mx-2"
            dark
            large
            v-on:click="openSettings"
        >
          <v-icon>mdi-wrench</v-icon>
        </v-btn
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
      <br/><br/>

      <div>
        <v-main>
          <v-container>
            <v-row>
              <!-- START OF READ MESSAGE -->
              <v-col cols="12" sm="2">
                <v-sheet rounded="lg" min-height="268">
                  <!-- left column -->
                </v-sheet>
              </v-col>

              <v-col cols="12" sm="8">
                <v-sheet min-height="15vh" rounded="lg">
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
                            style="font-family: Quicksand;margin-right: 5px;"
                            id="get-random-msg-btn"
                            :disabled="this.preUid == null"
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

                    <br/><br/>
                  </v-col>
                </v-sheet>
              </v-col>

              <v-col cols="12" sm="2">
                <v-sheet rounded="lg" min-height="268">
                  <!-- right column -->
                </v-sheet>
              </v-col>

              <!-- START OF COMPOSE MESSAGE -->
              <v-col cols="12" sm="2">
                <v-sheet rounded="lg" min-height="100">
                  <!-- left column -->
                </v-sheet>
              </v-col>

              <v-col cols="12" sm="8">
                <v-sheet min-height="30vh" rounded="lg">
                  <v-col cols="12">
                    <v-form ref="form">
                      <v-card color="#385F73" dark>
                        <v-card-title class="justify-center">
                          Compose Your Reply
                        </v-card-title>

                        <v-card-text style="padding-bottom: 0px">
                          <v-text-field
                              outlined
                              counter
                              placeholder="Subject line..."
                              id="message-subject-reply"
                          ></v-text-field>
                          <v-textarea
                              class="ma-0"
                              outlined
                              counter
                              placeholder="Start typing here..."
                              id="message-body-reply"
                          ></v-textarea>
                        </v-card-text>

                        <v-card-actions v-if="bGotMessage">
                          <v-btn outlined v-on:click="reply">
                            Send
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-form>

                    <br/><br/>
                  </v-col>
                </v-sheet>
              </v-col>

              <v-col cols="12" sm="2">
                <v-sheet rounded="lg" min-height="100">
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
import {onAuthUIStateChange} from "@aws-amplify/ui-components";
import API from "@aws-amplify/api";

// imports go here

export default {
  name: "AuthStateApp",
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    });

    this.preloadMessage();
  },
  // Where we store data or create static variables
  data() {
    return {
      user: undefined,
      authState: undefined,
      preUid: undefined,
      preSubject: undefined,
      preBody: undefined,
      preOriginalSender: undefined,
      uid: undefined,
      subject: undefined,
      body: undefined,
      originalSender: undefined,
      receiverQueue: undefined,
      bGotMessage: false,
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
    preloadMessage() {
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
            this.preSubject = response.Item.subject;
            this.preBody = response.Item.body;
            this.preOriginalSender = response.Item.originalSender;
            this.preUid = response.Item.uid;
          })
          .catch(error => {
            error.response;
          });
    },
    getRandomMsg() {
      this.uid = this.preUid;
      this.preUid = null;
      this.subject = this.preSubject;
      this.body = this.preBody;
      this.originalSender = this.preOriginalSender;

      document.getElementById("message-subject").innerHTML =
          "Subject: " + this.subject;
      document.getElementById("message-body").innerHTML = this.body;

      this.preloadMessage();

      //Get the sender of the read message(the new recipeint if a reply is made) message queue

      //Allows user to send their reply message
      this.bGotMessage = true;
    },
    goHome() {
      this.$router.push({path: "/"});
    },
    openSettings() {
      this.$router.push({path: "/settings"});
    },
    updateReceiversQueue() {
      //Parameter for the user who is getting the reply added to their queue
      const params = {
        receiverSub: this.originalSender,
        uid: this.uid
      };

      const apiName = "MiaB_1";
      const path = "/message/read-user-queue";
      const myInit = {
        // OPTIONAL
        body: params,
        headers: {} // OPTIONAL
      };

      API.put(apiName, path, myInit)
          .then(response => {
            this.receiverQueue = response.Item.receiverQueue;
          })
          .catch(error => {
            error.response;
          });
    },
    reply() {
      const messageSubject = "Re: " + this.subject;
      const messageBody =
          this.body +
          "--->" +
          document.getElementById("message-body-reply").value;

      const params = {
        subject: messageSubject,
        body: messageBody,
        sender: this.user,
        receiver: this.originalSender
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
          // eslint-disable-next-line no-unused-vars
          .then(response => {
            this.uid = response.Item.uid;
            // alert(response.data);
            //console.log(response.Item.uid)
            this.updateReceiversQueue();
          })
          .catch(error => {
            error.data;
            //console.log(error.response);
          });

      alert("Message sent!");
      this.$router.push({path: "/"});
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