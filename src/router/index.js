import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import ReadMessage from "../views/ReadMessage.vue";
import WriteNewMessage from "../views/WriteNewMessage.vue";
import ReadMessageRandom from "../views/ReadMessageRandom";

import Testing from "../views/Testing.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "home",
        component: Home
    },
    {
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/About.vue")
    },
    {
        path: "/testing",
        name: "testing",
        component: Testing
    },
    {
        path: "/read",
        name: "read",
        component: ReadMessage
    },
    {
        path: "/read_random",
        name: "read_random",
        component: ReadMessageRandom
    },
    {
        path: "/write",
        name: "write",
        component: WriteNewMessage
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
