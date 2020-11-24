<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" style="background-color: #2b2640;">
      <b-navbar-brand :to="{name: 'Home'}" class="text-light" style="font-family: Alata, sans-serif;">SQLMatches</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{name: 'Home'}">&nbsp;Home&nbsp;</b-nav-item>
          <b-nav-item :to="{name: 'Matches'}">&nbsp;Matches&nbsp;</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#"><div class="btn btn-info btn-lg" role="button">Create Community&nbsp; <b-icon icon="plus-circle-fill" variant="light"></b-icon></div></b-nav-item>
          <b-nav-item :to="{name: 'Login'}"><div class="btn btn-primary btn-lg" role="button">&nbsp;Login&nbsp; <b-icon icon="chevron-double-right" variant="light"></b-icon></div></b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container">
      <router-view/>
    </div>

  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
