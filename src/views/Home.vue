<template>
  <div>
    <div class="row">
        <div class="col-md-12">
            <div class="card bg-dark content-div">
                <div class="card-body">
                    <h3 class="text-light card-title">How it works</h3>
                    <p class="text-light card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pharetra a neque in elementum. Ut aliquet convallis consectetur. Integer urna justo, malesuada vel viverra in, ornare eget felis. Etiam nec metus tempus tellus semper
                        egestas at non purus. Pellentesque gravida lacus finibus nibh ultrices, vitae lacinia ante posuere. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse convallis odio eu euismod
                        consequat.<br></p>
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
                            <div class="card match" data-toggle="tooltip" data-bs-tooltip="" title="Date - Map"><img class="card-img w-100 d-block" src="@/assets/img/cache.jpg">
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
    <div class="row">
        <div class="col-md-12">
            <div class="card bg-dark content-div">
                <div class="card-body">
                    <h3 class="text-light card-title">Popular Communities</h3>
                    <div class="row">
                        <div class="col-md-3">
                            <div class="card light team">
                                <div class="card-body text-center"><img class="img-thumbnail team-pfp" src="@/assets/img/ahahha.png">
                                    <h4 class="text-light card-title">Community Name</h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card light team">
                                <div class="card-body text-center"><img class="img-thumbnail team-pfp" src="@/assets/img/ahahha.png">
                                    <h4 class="text-light card-title">Community Name<br></h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card light team">
                                <div class="card-body text-center"><img class="img-thumbnail team-pfp" src="@/assets/img/ahahha.png">
                                    <h4 class="text-light card-title">Community Name<br></h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card light team">
                                <div class="card-body text-center"><img class="img-thumbnail team-pfp" src="@/assets/img/ahahha.png">
                                    <h4 class="text-light card-title">Community Name<br></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home'
})
</script>
