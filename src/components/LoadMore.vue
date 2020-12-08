<template>
  <b-button class="load-more" variant="primary" size="sm" block v-on:click="$emit('click', increaseNumber())">Load More</b-button>
</template>

<script>
export default {
  name: 'LoadMore',
  props: {
    'pageNumber': {
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      currentPage: this.pageNumber
    }
  },
  methods: {
    increaseNumber () {
      this.currentPage += 1
      return this.currentPage
    }
  }
}
</script>
