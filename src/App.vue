<template>
  <nav>
    <router-link to="/">Főoldal</router-link>
    <router-link :to="{ name: 'currencyExchange' }">Valutaváltás</router-link>
  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  display: flex;
  justify-content: flex-end;
  margin-right: 45px;
  margin-top: 20px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 10px 15px;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

nav a.router-link-exact-active {
  background-color: #42b983;
  color: white;
}

nav a:not(:last-child) {
  position: relative;
  margin-right: 10px;
}

</style>
