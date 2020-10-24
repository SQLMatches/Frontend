<template>
    <div>
        <div class="card bg-dark content-div">
            <div class="card-body">
                <!-- Start: Steps Progressbar -->
                <div class="steps-progressbar">
                    <ul>
                        <li class="previous">Start</li>
                        <li class="active">Community details</li>
                        <li>Setting up servers</li>
                        <li>Finished</li>
                    </ul>
                </div>
                <!-- End: Steps Progressbar -->
            </div>
        </div>
        <div class="card bg-dark content-div">
            <div class="card-body">
                <form></form><button class="btn btn-info btn-block btn-lg" type="button">NEXT&nbsp;<i class="la la-chevron-right"></i></button></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Create'
})
</script>
