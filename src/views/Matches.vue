<template>
    <div>
        <div class="row">
            <div class="col-md-12">
                <div class="card bg-dark content-div">
                    <div class="card-body">
                        <!-- Start: Search Field With Icon -->
                        <div class="search-container"><input type="text" class="search-input" name="search-bar" placeholder="Search..."><button class="btn btn-primary search-btn" type="button"> <i class="la la-search"></i></button></div>
                        <!-- End: Search Field With Icon -->
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
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Matches'
})
</script>
