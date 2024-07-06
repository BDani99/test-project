<template>
  <div class="container">
    <div v-if="exchangeRates !== null" class="exchange-form">
      <h1>Valutaváltás</h1>
      <div class="form-group">
        <label for="fromCurrency">Erről a valutáról</label>
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
        <label for="amount">Összeg</label>
        <input
          type="number"
          id="amount"
          v-model.number="amount"
          min="0"
          step="500"
        />
      </div>

      <div class="form-group">
        <label for="toCurrency">Ebben a valutában</label>
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

      <button @click="calculateExchange" class="calculate-btn">Mehet</button>

      <div class="result" :class="{ visible: exchangeResult !== null }">
        <p v-show="exchangeResult !== null">
          {{ amount }} {{ fromCurrency }} = {{ exchangeResult }}
          {{ toCurrency }}
        </p>
      </div>
    </div>

    <div v-else class="loading">
      <p v-if="error">{{ error }}</p>
      <p v-else>Betöltés...</p>
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
      amount: null,
      exchangeResult: null,
      error: null,
    };
  },
  async mounted() {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      this.toDate = formatDate(today);
      this.fromDate = formatDate(yesterday);

      this.exchangeRates = await fetchExchangeRates(this.fromDate, this.toDate);
    } catch (error) {
      this.error = "Hiba a szerverrel való kommunikáció során";
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
        if (this.fromCurrency !== this.toCurrency) {
          const rate = fromRate.middleRate / toRate.middleRate;
          this.exchangeResult = (
            ((this.amount * rate) / fromRate.unit) *
            toRate.unit
          ).toFixed(4);
        } else {
          this.exchangeResult = this.amount.toFixed(2);
        }
      } else {
        this.exchangeResult = null;
      }
    },
  },
};

function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = `0${date.getUTCMonth() + 1}`.slice(-2);
  const day = `0${date.getUTCDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  height: 475px;
  margin-top: 50px;
}

.exchange-form {
  background: white;
  padding: 20px 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
  background: #f7f7f779;
}

h1 {
  margin-bottom: 20px;
  color: #4a4a4a;
  font-size: 24px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

select,
input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

button.calculate-btn {
  background: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  width: 100%;
}

button.calculate-btn:hover {
  background-color: #0056b3;
}

.result {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e7e7e7;
  border-radius: 6px;
  visibility: hidden;
  height: 36px;
  margin-top: 20px;
}

.result.visible {
  visibility: visible;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #777;
}

.error {
  color: red;
}
</style>
