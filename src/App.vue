<template>
  <div>
    <nav class="navbar navbar-light navbar-expand-md">
        <div class="container-fluid">
            <router-link class="navbar-brand text-light" style="font-family: Alata, sans-serif;" role="button" :to="{ name: 'Home'}">
                SQLMatches
            </router-link>
            <button data-toggle="collapse" class="navbar-toggler" data-target="#navcol-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navcol-1">
                <ul class="nav navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link class="nav-link text-light" role="button" :to="{ name: 'Home'}">&nbsp;Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link text-light" role="button" :to="{ name: 'Matches'}">&nbsp;Matches</router-link>
                    </li>
                </ul>
                <ul class="nav navbar-nav ml-auto">
                    <li class="nav-item spawn">
                        <router-link class="btn btn-info btn-lg" role="button" :to="{ name: 'Create'}">
                            Create Community&nbsp;<i class="la la-plus"></i>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <a href="/api/login" class="btn btn-primary btn-lg" role="button">
                            &nbsp;Login&nbsp;<i class="la la-chevron-right"></i>
                        </a>
                    </li>
                </ul>
          </div>
        </div>
    </nav>
    <div class="container">
      <router-view/>
    </div>
    <!-- Start: Footer Dark -->
    <div class="footer-dark bg-dark content-div">
        <footer>
            <div class="container">
                <div class="row">
                    <!-- Start: Services -->
                    <div class="col-sm-6 col-md-3 item">
                        <h3>Index</h3>
                        <ul>
                            <li>
                                <router-link :to="{ name: 'Home'}">Home</router-link>
                            </li>
                            <li>
                                <router-link :to="{ name: 'Matches'}">Matches</router-link>
                            </li>
                            <li><router-link :to="{ name: 'Create'}">Create Community</router-link></li>
                            <li><a href="/api/login">Login</a></li>
                        </ul>
                    </div>
                    <!-- End: Services -->
                    <!-- Start: About -->
                    <div class="col-sm-6 col-md-3 item">
                        <h3>Externals</h3>
                        <ul>
                            <li><a href="#">Discord</a></li>
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">GitHub</a></li>
                            <li><a href="#">Donate</a></li>
                        </ul>
                    </div>
                    <!-- End: About -->
                    <!-- Start: Footer Text -->
                    <div class="col-md-6 item text">
                        <h3>About</h3>
                        <p>SQLMatches is a free &amp; open source software built around giving players &amp; communities easy access to match records &amp; demos.</p>
                    </div>
                    <!-- End: Footer Text -->
                </div>
                <!-- Start: Copyright -->
                <p class="copyright">SQLMatches is proudly licensed under GPL-3.0</p>
                <!-- End: Copyright -->
            </div>
        </footer>
    </div>
    <!-- End: Footer Dark -->
  </div>
</template>
