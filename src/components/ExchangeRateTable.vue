<template>
  <div class="wrapper">
    <div class="table">
      <div class="header">
        <div>Deviza</div>
        <div>Vételi árfolyam</div>
        <div>Középárfolyam</div>
        <div>Eladási árfolyam</div>
        <div>Név</div>
      </div>

      <div class="data-wrapper">
        <div
          v-for="rate in exchangeRates"
          :key="rate.currency"
          class="data"
          @click="selectCurrency(rate.currency)"
        >
          <div>{{ rate.currency }}</div>
          <div>{{ rate.buyRate }}</div>
          <div>{{ rate.middleRate }}</div>
          <div>{{ rate.salesRate }}</div>
          <div>{{ rate.name || "N/A" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    exchangeRates: {
      type: Array,
      required: true,
    },
  },
  methods: {
    selectCurrency(currency) {
      this.$emit("currency-selected", currency);
    },
  },
};
</script>

<style scoped src='../styles/ExchangeRateTable.css'></style>
