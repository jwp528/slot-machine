<template>
  <v-card light tile class="py-5" :max-height="$vuetify.breakpoint.smAndDown ? '100px' : 'auto'">
    <audio ref="stop">
      <source src="../assets/sounds/stop.mp3" />
    </audio>
    <v-card-text
      :class="{
      'display-4': $vuetify.breakpoint.mdAndUp,
      'font-weight-thin text-center': true
    }"
    >
      <v-icon :color="tile.color" :size="$vuetify.breakpoint.mdAndUp ? 72 : 36">mdi-{{tile.icon}}</v-icon>
    </v-card-text>
  </v-card>
</template>
<script>
import _ from 'lodash'
import icons from '@/misc/icons'

export default {
  name: 'SlotReel',
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  data: () => {
    return {
      iconIdx: 0,
      icons
    }
  },
  computed: {
    tile: {
      get: function () {
        return this.icons[this.iconIdx]
      },

      set: function (value) {
        this.iconIdx = value
      }
    },
    totalWeight () {
      return this.icons.reduce((acc, item) => {
        acc += item.weight
        return acc
      }, 0)
    }
  },
  mounted () {
    _.shuffle(this.icons)
    this.setRandom()
  },
  methods: {
    setRandom () {
      const rng = Math.floor(Math.random() * this.totalWeight)
      let acc = 0
      this.icons.some((item, idx) => {
        acc += item.weight
        const threshold = this.totalWeight - acc
        const found = rng >= threshold

        if (found) {
          this.iconIdx = idx
        }

        return found
      })
    },
    spin () {
      let timeoutSet = false
      const interval = setInterval(() => {
        this.setRandom()
        if (!timeoutSet) {
          let duration = (this.index % 3) * 1000
          if (!duration) { duration = 3000 }
          setTimeout(() => {
          // play stop sound
            this.$refs.stop.play()
            clearInterval(interval)
          }, duration)
        }
        timeoutSet = true
      }, 10)
    }
  }
}
</script>
