<template>
  <div class="container">
    <div v-if="exchangeRates" class="exchange-form">
      <h1>Valutaváltás</h1>
      <div class="form-group">
        <label for="fromCurrency">Kiinduló valuta:</label>
        <select id="fromCurrency" v-model="fromCurrency">
          <option
            v-for="currency in exchangeRates.filter((c) => c.name)"
            :key="currency.currency"
            :value="currency.currency"
          >
            {{ currency.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="toCurrency">Célpont valuta:</label>
        <select id="toCurrency" v-model="toCurrency">
          <option
            v-for="currency in exchangeRates.filter((c) => c.name)"
            :key="currency.currency"
            :value="currency.currency"
          >
            {{ currency.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="amount">Átváltandó összeg:</label>
        <input
          type="number"
          id="amount"
          v-model.number="amount"
          min="0"
          step="0.01"
        />
      </div>

      <button @click="calculateExchange" class="calculate-btn">Számol</button>

      <div class="result" :class="{ visible: exchangeResult !== null }">
        <p v-show="exchangeResult !== null">
          {{ amount }} {{ fromCurrency }} = {{ exchangeResult }}
          {{ toCurrency }}
        </p>
      </div>
    </div>

    <div v-else class="loading">
      <p>Betöltés...</p>
    </div>
  </div>
</template>

<script>
import { fetchExchangeRates } from "../api/api.js";

export default {
  data() {
    return {
      exchangeRates: null,
      fromCurrency: null,
      toCurrency: null,
      amount: 1,
      exchangeResult: null,
    };
  },
  async mounted() {
    try {
      this.exchangeRates = await fetchExchangeRates();
      console.log("Exchange rates:", this.exchangeRates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  },
  methods: {
    calculateExchange() {
      const fromRate = this.exchangeRates.find(
        (rate) => rate.currency === this.fromCurrency
      );
      const toRate = this.exchangeRates.find(
        (rate) => rate.currency === this.toCurrency
      );

      if (fromRate && toRate) {
        const rate = toRate.middleRate / fromRate.middleRate;
        this.exchangeResult = (this.amount * rate).toFixed(2);
      } else {
        this.exchangeResult = null;
      }
    },
  },
};
</script>

<style scoped>
.container {
  height: 500px;
  max-width: 600px;
  margin: 50px auto;
  padding: 25px;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.exchange-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group select {
  width: 395px;
  text-align: center;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 123, 255, 0.6) rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

label {
  margin-bottom: 5px;
  color: #555;
}

.calculate-btn {
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.calculate-btn:hover {
  background-color: #0056b3;
}

.result {
  background: #e7e7e7;
  border-radius: 10px;
  min-height: 24px;
  visibility: hidden;
  max-width: 395px;
}

.result.visible {
  visibility: visible;
}

.result p {
  text-align: center;
  font-size: 18px;
  color: #333;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #999;
}
</style>
