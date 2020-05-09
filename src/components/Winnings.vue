<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="4" v-for="(win, index) in wins" :key="index">
        <v-card class="pa-5">
          <v-card-title justify-self="center">{{win.label}} - {{win.winnings | formatMoney}}</v-card-title>
          <v-row>
            <v-col cols="4" class="pt-0" v-for="(reel, idx) in win.reels" :key="idx">
              <v-card light tile class="py-5">
                <v-card-text class="display-4 font-weight-thin text-center" min-height="1000px">
                  <v-icon :color="reel.color" :size="72">mdi-{{reel.icon}}</v-icon>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Winnings',
  props: {
    wins: {
      default: () => {
        return []
      }
    }
  }
}
</script>
