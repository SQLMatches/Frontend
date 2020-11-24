<template>
  <div>
    <div class="row">
        <div class="col-md-12">
            <div class="card bg-dark content-div">
                <div class="card-body">
                    <h3 class="text-light card-title">How it works</h3>

                    <video autoplay loop style="width: 100%">
                      <source src="@/assets/videos/CreateCommunity.mp4" type="video/mp4">
                    </video>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card bg-dark content-div">
                <div class="card-body">
                    <h3 class="text-light card-title">Recent Matches</h3>
                    <games></games>
                </div>
            </div>
        </div>
    </div>
    <communities></communities>
  </div>
</template>

<script>
import Communities from '../compoments/Communities.vue'
import Games from '../compoments/Games.vue'

export default {
  name: 'Home',
  components: {
    Communities,
    Games
  }
}
</script>
