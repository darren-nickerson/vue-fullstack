<template>
    <div>
      <div v-if="product">
        <h1>Product {{ product.name }}</h1>
        <div class="img-wrap">
          <img :src="product.imageUrl" />
        </div>
        <div class="product-details">
          <h1>{{ product.name }}</h1>
          <h3 class="price">{{ product.price }}</h3>
          <button @click="addToCart" class="add-to-cart" v-if="user && !itemIsInCart">
            Add to cart
          </button>
          <button class="sign-in" @click="signIn" v-else-if="!user">
            Sign in to add to cart
          </button>
          <button class="grey-button" v-else>
            Item already in cart
          </button>
        </div>
      </div>
      <div v-else>
        <NotFoundPage />
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
  import axios from "axios";
  
  import NotFoundPage from "./NotFoundPage.vue";


  
  export default {
    name: "ProductDetailPage",
    props: ['user'],
    data() {
      return {
        product: null,
        cartItems: [],
      };
    },
    computed: {
      itemIsInCart() {
        return this.cartItems.some(item => item.id === this.$route.params.productId);
      },
    },
    methods: {
      async addToCart() {
        await axios.post(`/api/users/${this.user.uid}/cart`, {
          id: this.$route.params.productId,
        });
        alert("Added to cart!");
      },
      async signIn() {
        const email = prompt("Enter your email to sign in");
        if (email) {
          const auth = getAuth();
          const actionCodeSettings = {
            url: `http://localhost:8080/products/${this.$route.params.productId}`,
            handleCodeInApp: true,
          };
          try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem("emailForSignIn", email);
            alert("Check your email to sign in");
          } catch (error) {
            console.error(error);
          }
        }
      },
    },
    components: { NotFoundPage },
    async created() {
      const auth = getAuth();
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = window.localStorage.getItem("emailForSignIn");
        try {
          await signInWithEmailLink(auth, email, window.location.href);
          alert('Successfully signed in');
          window.localStorage.removeItem("emailForSignIn");
        } catch (error) {
          console.error(error);
        }
      }
  
      const response = await axios.get(`/api/products/${this.$route.params.productId}`);
      this.product = response.data;
  
      if (this.user) {
        const cartResponse = await axios.get(`/api/users/${this.user.uid}/cart`);
        this.cartItems = cartResponse.data;
      }
    },
  };
  </script>
  