<template>
  <div>
    <nav class="navbar navbar-light navbar-expand-md">
        <div class="container-fluid"><a class="navbar-brand text-light" href="#" style="font-family: Alata, sans-serif;">SQLMatches</a><button data-toggle="collapse" class="navbar-toggler" data-target="#navcol-1"><span class="sr-only">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navcol-1">
                <ul class="nav navbar-nav mr-auto">
                    <li class="nav-item"><a class="nav-link text-light" href="#">&nbsp;Home&nbsp;</a></li>
                    <li class="nav-item"><a class="nav-link text-light" href="#">&nbsp;Matches&nbsp;</a></li>
                </ul>
                <ul class="nav navbar-nav ml-auto">
                    <li class="nav-item spawn"><a class="btn btn-info btn-lg" role="button">Create Community&nbsp;<i class="la la-plus"></i></a></li>
                    <li class="nav-item"><a class="btn btn-primary btn-lg" role="button">&nbsp;Login&nbsp;<i class="la la-chevron-right"></i></a></li>
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
                <p class="copyright">SQLMatches is proudly licensed under GPL-3.0</p>
                <!-- End: Copyright -->
            </div>
        </footer>
    </div>
    <!-- End: Footer Dark -->
  </div>
</template>
