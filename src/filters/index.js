import Vue from 'vue'
import Dinero from 'dinero.js'

Vue.filter('formatMoney', (amount) => {
  return Dinero({ amount }).toFormat('$0,0.00')
})
