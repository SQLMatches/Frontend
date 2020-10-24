<template>
    <div>
        <div class="card bg-dark content-div">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4 text-center">
                        <h3 class="text-light" style="margin: 0px;">Total Matches</h3>
                        <h4 class="text-light" style="margin: 0px;">3223</h4>
                    </div>
                    <div class="col-md-4 text-center">
                        <h3 class="text-light" style="margin: 0px;">Active Matches</h3>
                        <h4 class="text-light" style="margin: 0px;">127</h4>
                    </div>
                    <div class="col-md-4 text-center">
                        <h3 class="text-light" style="margin: 0px;">Stored Demos</h3>
                        <h4 class="text-light" style="margin: 0px;">33</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="card text-light bg-dark content-div">
            <div class="card-header">
                <ul class="nav nav-pills nav-justified card-header-pills">
                    <li class="nav-item"><a class="nav-link active" href="#">API</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Matches</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Community</a></li>
                </ul>
            </div>
            <div class="card-body"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Owner'
})
</script>
