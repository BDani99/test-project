<template>
  <div class="table-container">
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
      required: true
    }
  },
  methods: {
    selectCurrency(currency) {
      this.$emit('currency-selected', currency);
    }
  }
};
</script>

<style scoped>
.table {
  width: 98%;
  margin: auto;
  border-radius: 10px;
}

.header {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
  border-bottom: 1px solid #ccc;
}

.header div {
  flex: 1;
  text-align: center;
  font-weight: 600;
}

.data-wrapper {
  padding: 10px;
}

.data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: white;
  margin-top: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #eee;
}

.data:hover {
  background-color: #f0f0f0;
}

.data div {
  flex: 1;
  text-align: center;
}
</style>
