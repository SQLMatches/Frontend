<template>
  <div class="content-div text-light text-center">
    <h1 v-if="$route.params.paymentStatus === 'cancel'">Payment cancelled</h1>
    <h1 v-else>Payment successful</h1>
    <br><br>
    <b-spinner style="width: 4rem; height: 4rem;"></b-spinner>
  </div>
</template>

<script>
export default {
  name: 'Payment',
  created () {
    setTimeout(() => {
      this.$router.push({name: 'Owner'})
    }, 2000)
  }
}
</script>
