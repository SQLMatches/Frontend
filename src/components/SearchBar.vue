<template>
    <div class="search-container">
        <input type="text" class="search-input" name="search-bar" placeholder="Search..." v-on:input="inputDebounce($event.target.value)">
        <button class="btn btn-primary search-btn" type="button"><b-icon icon="search" variant="light"></b-icon></button>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    'debounce': {
      default: 500,
      type: Number
    }
  },
  created () {
    this.inputDebounce = _.debounce(this.inputDebounce, this.debounce)
  },
  methods: {
    inputDebounce (value) {
      this.$emit('input', value)
    }
  }
}
</script>
