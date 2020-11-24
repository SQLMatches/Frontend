<template>
  <div class="text-center text-light" style="margin-top:150px">
    <b-icon icon="exclamation-circle-fill" variant="info" style="width: 120px; height: 120px;"></b-icon>
    <h3>Sorry we couldn't find the page you're looking for!</h3>

    <router-link :to="{name: 'Home'}">Go back home!</router-link>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound'
}
</script>
