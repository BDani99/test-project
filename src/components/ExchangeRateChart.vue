<template>
  <div class="chart-container" v-if="selectedCurrency">
    <h2>{{ selectedCurrency }} árfolyam diagram</h2>

    <div class="date-pickers">
      <div class="field">
        <label class="label" for="fromDate">Kezdő dátum:</label>
        <div class="control">
          <input
            class="input"
            type="date"
            id="fromDate"
            v-model="fromDate"
            @change="fetchData"
          />
        </div>
      </div>

      <div class="field">
        <label class="label" for="toDate">Végdátum:</label>
        <div class="control">
          <input
            class="input"
            type="date"
            id="toDate"
            v-model="toDate"
            @change="fetchData"
          />
        </div>
      </div>
    </div>

    <div v-if="selectedCurrency && selectedCurrencyData.length > 0" class="chart-area">
      <canvas id="exchangeRateChart" ref="exchangeRateChart"></canvas>
    </div>

    <p v-else class="notification is-warning">Válasszon intervallumot!</p>
  </div>
</template>

<script>
import { fetchExchangeRates } from "../api/api.js";
import Chart from "chart.js/auto";

export default {
  props: {
    selectedCurrency: {
      type: String,
      required: true,
    },
    exchangeRates: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      fromDate: "",
      toDate: "",
      selectedCurrencyData: [],
      chartInstance: null,
    };
  },
  computed: {
    chartData() {
      return {
        labels: this.selectedCurrencyData.map((rate) => rate.date),
        datasets: [
          {
            label: "Középárfolyam",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            data: this.selectedCurrencyData.map((rate) => rate.middleRate),
          },
          {
            label: "Eladási árfolyam",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            data: this.selectedCurrencyData.map((rate) => rate.sellRate),
          },
          {
            label: "Vételi árfolyam",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            data: this.selectedCurrencyData.map((rate) => rate.buyRate),
          },
        ],
      };
    },
  },
  watch: {
    selectedCurrency: "resetData",
  },
  methods: {
    resetData() {
      this.fromDate = "";
      this.toDate = "";
      this.selectedCurrencyData = [];
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
    },
    async fetchData() {
      if (!this.fromDate || !this.toDate || !this.selectedCurrency) return;

      try {
        const from = new Date(this.fromDate);
        const to = new Date(this.toDate);

        // Naponta érkező adatok száma (pl. 18)
        const dailyDataCount = 18;

        // Számítjuk a két dátum közötti napok számát, beleértve a kezdő és végdátumot is
        const diffTime = to.getTime() - from.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const size = diffDays * dailyDataCount;

        const exchangeRates = await fetchExchangeRates(
          this.fromDate,
          this.toDate,
          size
        );

        this.selectedCurrencyData = exchangeRates
          .filter((rate) => rate.currency === this.selectedCurrency)
          .map((rate) => ({
            ...rate,
            sellRate: rate.salesRate,
            buyRate: rate.buyRate,
          }));

        this.renderChart();
      } catch (error) {
        console.error("Hiba a szerverrel való kommunikáció során:", error);
      }
    },

    renderChart() {
      this.$nextTick(() => {
        if (!this.$refs.exchangeRateChart) return;

        const ctx = this.$refs.exchangeRateChart.getContext("2d");
        if (!ctx) return;

        if (this.chartInstance) {
          this.chartInstance.destroy();
        }

        this.chartInstance = new Chart(ctx, {
          type: "line",
          data: this.chartData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Árfolyamok",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Dátum",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Árfolyam",
                },
              },
            },
          },
        });
      });
    },
  },
};
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: 60%;
}

.date-pickers {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
}

.field {
  margin-bottom: 1rem;
}

.label {
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
}

.notification {
  padding: 1rem;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  color: #856404;
}

.chart-area {
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
