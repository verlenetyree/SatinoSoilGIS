<template>
  <div id="app">
    <!--<div id="flashMessage" v-if="GStore.flashMessage">
      {{ GStore.flashMessage }}
    </div>
    <div id="nav">
      <router-link :to="{ name: 'EventList' }">Events</router-link> |
      <router-link :to="{ name: 'About' }">About</router-link>
    </div>
    <router-view />-->
  </div>
</template>

<script></script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-y: hidden;
  text-align: center;
  color: #2c3e50;
}

::-webkit-scrollbar {
  display: none;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

h4 {
  font-size: 20px;
}
</style>
