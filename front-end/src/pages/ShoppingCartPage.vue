<template>
    <h1>Shopping Cart</h1>

    <div v-if="cartItems.length > 0">
        <ShoppingCartList :products="cartItems" />
    </div>

    <div v-if="cartItems.length === 0">
        <p>You have no items in your cart</p>
    </div>
</template>

<script>
import ShoppingCartList from "../components/ShoppingCartList.vue";
import { cartItems } from "../temp-data.js";


export default {
    name: "ShoppingCartPage",
    components: { ShoppingCartList },
    data() {
        return {
            cartItems,
        };
    }
};
</script>
