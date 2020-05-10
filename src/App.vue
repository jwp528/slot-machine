<template>
  <v-app>
    <v-app-bar app>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <span class="headline">Victory Slots!</span>
      </div>

      <v-spacer></v-spacer>

      <v-btn color="primary">Sign In</v-btn>
    </v-app-bar>

    <v-content :class="{
      'py-5': $vuetify.breakpoint.smAndDown
    }">
      <v-img src="./assets/bg.jpg" max-height="100vh">
        <router-view />
      </v-img>
    </v-content>
  </v-app>
</template>
<style>
@font-face {
  font-family: "digital";
  src: url(assets/fonts/DS-DIGI.TTF) format("truetype");
}

.digital {
  font-family: digital, serif;
}
</style>
<script>
export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>
