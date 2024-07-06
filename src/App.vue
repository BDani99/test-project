<template>
  <nav>
    <router-link to="/">Főoldal</router-link>
    <router-link :to="{ name: 'currencyExchange' }">Valutaváltás</router-link>
  </nav>
  <router-view />
</template>

<style src='./styles/Global.css'></style>
