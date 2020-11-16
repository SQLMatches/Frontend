<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" style="background-color: #2b2640;">
      <b-navbar-brand href="#" class="text-light" style="font-family: Alata, sans-serif;">SQLMatches</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">&nbsp;Home&nbsp;</b-nav-item>
          <b-nav-item href="#">&nbsp;Matches&nbsp;</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#"><a class="btn btn-info btn-lg" role="button">Create Community&nbsp;<i class="la la-plus"></i></a></b-nav-item>
          <b-nav-item href="#"><a class="btn btn-primary btn-lg" role="button">&nbsp;Login&nbsp;<i class="la la-chevron-right"></i></a></b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
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
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Create Community</a></li>
                            <li><a href="#">Matches</a></li>
                            <li><a href="#">Donate</a></li>
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
                <p class="copyright">SQLMatches is proudly licensed under GPL-3.0 | 2020 - {{ new Date().getFullYear() }}</p>
                <!-- End: Copyright -->
            </div>
        </footer>
    </div>
    <!-- End: Footer Dark -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
