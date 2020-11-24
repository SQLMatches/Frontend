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
                    <ul class="list-unstyled matches">
                        <li>
                            <div class="card match" v-b-tooltip.hover title="Date - Map"><img class="card-img w-100 d-block" src="@/assets/img/cache.jpg">
                                <div class="card-img-overlay d-flex d-xl-flex flex-column flex-grow-0 flex-shrink-0 justify-content-center align-items-center justify-content-xl-center align-items-xl-center">
                                    <div class="row no-gutters row-cols-3 match">
                                        <div class="col-md-4" style="text-align: right;">
                                            <h2 class="text-center text-light">Team 1</h2>
                                        </div>
                                        <div class="col-md-4">
                                            <h2 class="text-center text-light">15:5</h2>
                                        </div>
                                        <div class="col-md-4">
                                            <h2 class="text-center text-light" style="text-align: left;">Team 1</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <communities></communities>
  </div>
</template>

<script>
import Communities from '../compoments/Communities.vue'

export default {
  name: 'Home',
  components: {
    Communities
  }
}
</script>
