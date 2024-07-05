<template>
  <div class="chart-container">
    <h3 v-show="exchangeRates.length">
      {{ exchangeRates.length > 0 ? exchangeRates[0].name : "" }} árfolyam diagram
    </h3>
    <canvas ref="chartCanvas"></canvas>
    <p v-if="!chartInstance && exchangeRates.length === 0" class="error-message">
      Hiba a diagram generálása közben
    </p>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import { nextTick } from "vue";

export default {
  props: {
    exchangeRates: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chartInstance: null,
      error: false,
    };
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      nextTick(() => {
        if (!this.exchangeRates.length) return;

        const rates = this.exchangeRates.map((rate) => ({
          ...rate,
        }));

        try {
          if (this.chartInstance) {
            this.chartInstance.destroy();
          }

          const ctx = this.$refs.chartCanvas.getContext("2d");
          const labels = ["Vételi árfolyam", "Középárfolyam", "Eladási árfolyam"];
          const buyRates = rates.map((rate) => rate.buyRate);
          const middleRates = rates.map((rate) => rate.middleRate);
          const salesRates = rates.map((rate) => rate.salesRate);

          const buyRate = buyRates[0];
          const middleRate = middleRates[0];
          const salesRate = salesRates[0];

          const minRate = Math.min(buyRate, middleRate, salesRate);
          const maxRate = Math.max(buyRate, middleRate, salesRate);

          this.chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Árfolyam értékek",
                  data: [buyRate, middleRate, salesRate],
                  backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(75, 192, 192)",
                  ],
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: false,
                  min: minRate * 0.95,
                  max: maxRate * 1.05,
                },
              },
            },
          });
        } catch (error) {
          console.error("Error rendering chart:", error);
          this.error = true;
        }
      });
    },
  },
  watch: {
    exchangeRates() {
      this.renderChart();
    },
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
};
</script>

<style scoped>
.chart-container {
  max-width: 800px;
  margin: 0 auto;
}

canvas {
  width: 100% !important;
  height: 400px !important;
  margin-bottom: 20px;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
