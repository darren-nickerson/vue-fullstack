import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
import { createRouter, createWebHistory } from "vue-router";
import ShoppingCartPage from "./pages/ShoppingCartPage.vue";
import ProductsPage from "./pages/ProductsPage.vue";
import ProductDetailPage from "./pages/ProductDetailPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAEEyfAstn0weHqdbGU2LLZcQN0sP5dGMU",
  authDomain: "vue2-b83d4.firebaseapp.com",
  projectId: "vue2-b83d4",
  storageBucket: "vue2-b83d4.appspot.com",
  messagingSenderId: "393059786595",
  appId: "1:393059786595:web:3943de6788f23caf8afd56"
};

initializeApp(firebaseConfig);


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: "/products",
      component: ProductsPage,
    },
    {
      path: "/products/:productId",
      component: ProductDetailPage,
    },
    {
      path: "/cart",
      component: ShoppingCartPage,
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFoundPage,
    },
  ],
});

createApp(App).use(router).mount("#app");
