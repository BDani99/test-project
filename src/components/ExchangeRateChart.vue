<template>
  <div class="chart-container" v-if="selectedCurrency">
    <h2>{{ selectedCurrencyName }} árfolyam diagram</h2>

    <div class="date-pickers">
      <div class="field">
        <label class="label" for="fromDate">Kezdő dátum</label>
        <div class="control">
          <input
            class="input"
            type="date"
            id="fromDate"
            v-model="internalFromDate"
            @change="onDateChange"
          />
        </div>
      </div>

      <div class="field">
        <label class="label" for="toDate">Végdátum</label>
        <div class="control">
          <input
            class="input"
            type="date"
            id="toDate"
            v-model="internalToDate"
            @change="onDateChange"
            :max="getMaxToDate()"
          />
        </div>
      </div>
    </div>

    <div
      v-if="selectedCurrency && selectedCurrencyData.length > 0"
      class="chart-area"
    >
      <canvas id="exchangeRateChart" ref="exchangeRateChart"></canvas>
    </div>

    <p v-else class="notification is-warning">Válasszon intervallumot!</p>
  </div>
</template>

<script>
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
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      internalFromDate: this.fromDate,
      internalToDate: this.toDate,
      selectedCurrencyData: this.exchangeRates,
      chartInstance: null,
    };
  },
  watch: {
    selectedCurrency(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.resetData();
      }
    },
    exchangeRates(newVal) {
      this.selectedCurrencyData = newVal;
      this.renderChart();
    },
  },
  computed: {
    selectedCurrencyName() {
      const currencyData = this.selectedCurrencyData.find(
        (rate) => rate.currency === this.selectedCurrency
      );
      return currencyData ? currencyData.name : "";
    },
    chartData() {
      const sortedData = this.selectedCurrencyData.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      return {
        labels: sortedData.map((rate) => rate.date),
        datasets: [
          {
            label: "Középárfolyam",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            data: sortedData.map((rate) => rate.middleRate),
          },
          {
            label: "Eladási árfolyam",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            data: sortedData.map((rate) => rate.sellRate),
          },
          {
            label: "Vételi árfolyam",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            data: sortedData.map((rate) => rate.buyRate),
          },
        ],
      };
    },
  },
  methods: {
    resetData() {
      this.internalFromDate = "";
      this.internalToDate = "";
      this.selectedCurrencyData = [];
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
    },
    onDateChange() {
      if (new Date(this.internalToDate) > new Date()) {
        this.internalToDate = this.getMaxToDate();
      }
      this.$emit("fetch-data", this.internalFromDate, this.internalToDate);
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
    getMaxToDate() {
      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();

      if (month < 10) {
        month = `0${month}`;
      }

      if (day < 10) {
        day = `0${day}`;
      }

      return `${year}-${month}-${day}`;
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
