<template>
  <div class="chart-container" v-if="selectedCurrency">
    <h2>{{ selectedCurrencyName }} árfolyam diagram</h2>

    <DatePickers
      :fromDate="internalFromDate"
      :toDate="internalToDate"
      @update:fromDate="internalFromDate = $event"
      @update:toDate="internalToDate = $event"
      @date-change="handleDateChange"
    />

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
import { renderChart } from "../utils/ChartUtils.js";
import { onDateChange } from "../utils/DateUtils.js";
import DatePickers from "./DatePickers.vue";
import { getMaxToDate } from "../utils/DateUtils.js";

export default {
  components: {
    DatePickers,
  },
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
    handleDateChange(fromDate, toDate) {
      onDateChange(
        fromDate,
        toDate,
        getMaxToDate(),
        (val) => (this.internalFromDate = val),
        (val) => (this.internalToDate = val),
        this.$emit.bind(this)
      );
    },
    renderChart() {
      this.$nextTick(() => {
        if (!this.$refs.exchangeRateChart) return;

        const ctx = this.$refs.exchangeRateChart.getContext("2d");
        if (!ctx) return;

        this.chartInstance = renderChart(
          ctx,
          this.chartData,
          this.chartInstance
        );
      });
    },
  },
};
</script>

<style scoped src='../styles/ExchangeRateChart.css'></style>
