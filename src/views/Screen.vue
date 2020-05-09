<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-row align="center" justify="center" fill-height>
          <v-col cols="8">
            <v-card class="px-5" :color="slotColor">
              <audio ref="spin">
                <source src="../assets/sounds/spin.mp3" />
              </audio>
              <audio ref="coin">
                <source src="../assets/sounds/coin.mp3" />
              </audio>
              <audio ref="win">
                <source src="../assets/sounds/win.mp3" />
              </audio>

              <v-card-title class="display-4 font-weight-thin justify-center">Roll 'em Slots</v-card-title>
              <v-row>
                <v-col cols="12" class="pb-0 mb-5">
                  <v-card color="black" class="px-5 digital green--text">
                    <v-row dense justify="center" class="py-0 my-0">
                      <v-col cols="4">
                        <p>
                          <v-btn x-small class="digital" @click="addTokens">Add Money</v-btn>
                          <br />
                          <span class="overline digital">Money:</span>
                          <br />
                          <span style="font-size:28px">{{tokens | formatMoney}}</span>
                        </p>
                      </v-col>
                      <v-col cols="4">
                        <p class="text-center">
                          <v-btn x-small class="digital" @click="cashOut">Cash Out</v-btn>
                          <br />
                          {{status}}
                          <br />
                          <span
                            v-if="winnings > 0"
                            class="mt-5"
                            style="font-size:28px; padding:0"
                          >{{winnings | formatMoney}}</span>
                        </p>
                      </v-col>
                      <v-col cols="4">
                        <p class="text-right">
                          <v-btn
                            x-small
                            class="digital text-right"
                            @click="convertPointsToTokens"
                          >Convert</v-btn>
                          <br />
                          <span class="overline digital">Score:</span>
                          <br />
                          <span style="font-size:28px">{{score}}</span>
                        </p>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col cols="4" v-for="i in 9" :key="i" class="pt-0">
                  <slot-reel :index="i" ref="slotreel" />
                </v-col>
                <v-col cols="4" class="mx-auto">
                  <v-btn block x-large tile color="primary" @click="spin" :disabled="spinning">SPIN!</v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <!-- <v-col cols="12">
        <winnings :wins="wins" />
      </v-col>-->
    </v-row>
  </v-container>
</template>
<script>
import winningsCalculator from '@/misc/winningsCalculator'

import SlotReel from '@/components/SlotReel'
// import Winnings from '@/components/Winnings'
export default {
  components: {
    SlotReel
  },
  data: () => {
    return {
      spinning: false,
      slotColor: 'dark',
      winnings: 0,
      tokens: 2000,
      cost: 50,
      score: 0,
      status: 'SPIN TO WIN!',
      settings: {
        reelTimer: 3300
      },
      wins: []
    }
  },
  methods: {
    cashOut () {
      const cashingOut = confirm(`Are you sure you want to cash out? Total Winnings: $${(this.tokens + this.score) / 100.0}`)

      if (cashingOut) {
        const difference = (this.tokens + this.score) - 2000
        let message = ''

        if (difference < 0) {
          message = `You lost $${(difference * -1) / 100.0}`
        } else {
          message = `You won $${difference / 100.0}`
        }
        alert(`You went in with $20 and cashed out at $${(this.tokens + this.score) / 100.0}. ${message}`)

        this.tokens = 0
        this.score = 0
        this.$refs.win.play()
      }
    },
    addTokens () {
      if (!this.tokens) {
        this.tokens += 2000
      } else { this.tokens += 25 }
      this.$refs.coin.play()
    },
    spin () {
      if (this.tokens < this.cost) {
        alert('You\'re out of tokens! time to go home.')
        return
      }

      this.tokens -= this.cost

      // play spin sound
      this.$refs.spin.play()

      this.spinning = true
      this.status = 'GOOD LUCK'
      setTimeout(() => {
        this.checkReel()
      }, this.settings.reelTimer)

      this.$refs.slotreel.forEach(reel => {
        reel.spin()
      })
    },
    checkReel () {
      const reels = []
      this.$refs.slotreel.forEach(reel => {
        reels.push(reel.tile)
      })

      const results = winningsCalculator.readResults(reels)

      this.winnings = results.winnings
      if (results.label !== '') { this.status = results.label }

      if (results.label !== 'lucky') { this.score += results.winnings }

      if (this.winnings > 0) {
        this.wins.push({
          label: results.label,
          winnings: results.winnings,
          reels
        })
        this.payout()
      } else { this.spinning = false; this.status = 'SPIN TO WIN!' }
    },
    convertPointsToTokens () {
      if (this.score < 10) { alert('you need at least 10 points to convert your points to tokens') }
      this.winnings = this.score * 0.1
      this.score = 0
      this.payout()
    },
    payout () {
      this.$refs.win.play()
      let colorIdx = 0
      const winningColors = ['danger', 'primary', 'warning', 'success', 'pink', 'yellow', 'orange', 'purple']

      setTimeout(() => {
        const payout = setInterval(() => {
          if (colorIdx === winningColors.length - 1) {
            colorIdx = 0
          }

          this.slotColor = winningColors[colorIdx]
          colorIdx++

          if (this.winnings === 0) {
            this.spinning = false
            this.slotColor = 'dark'
            this.status = 'SPIN TO WIN!'

            if (this.tokens < 4000) this.cost = 50
            if (this.tokens >= 4000 && this.tokens < 8000) this.cost = 100
            if (this.tokens >= 8000) this.cost = 250

            clearInterval(payout)
          }

          if (this.winnings >= 200000000) {
            this.tokens += 50000000
            this.winnings -= 50000000
          } else if (this.winnings >= 20000000) {
            this.tokens += 10000000
            this.winnings -= 10000000
          } else if (this.winnings > 200000) {
            this.tokens += 100000
            this.winnings -= 100000
          } else if (this.winnings >= 2000) {
            this.tokens += 1000
            this.winnings -= 1000
          } else if (this.winnings >= 200) {
            this.tokens += 100
            this.winnings -= 100
          } else if (this.winnings >= 20) {
            this.tokens += 10
            this.winnings -= 10
          } else if (this.winnings > 0) {
            this.tokens += 1
            this.winnings -= 1
          }

          this.$refs.coin.play()
        }, 50)
      }, 2000)
    }
  }
}
</script>
