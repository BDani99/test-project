<template>
  <div>
    <h2>Árfolyamok</h2>

    <table
      class="table"
      v-if="exchangeRates && exchangeRates.length > 0"
    >
      <thead>
        <tr>
          <th>Deviza</th>
          <th>Vételi árfolyam</th>
          <th>Középárfolyam</th>
          <th>Eladási árfolyam</th>
          <th>Név</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rate in exchangeRates" :key="rate.currency">
          <td>{{ rate.currency }}</td>
          <td>{{ rate.buyRate }}</td>
          <td>{{ rate.middleRate }}</td>
          <td>{{ rate.salesRate }}</td>
          <td>{{ rate.name || "N/A" }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      <p>Betöltés...</p>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      exchangeRates: null,
    };
  },
  mounted() {
    this.fetchExchangeRates();
  },
  methods: {
    fetchExchangeRates() {
      fetch(
        "/api/apps/backend/exchange-rate/exchange-rate-page?rateType=mkbk&fromDate=20240529&toDate=20240529&from=0&size=30"
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Exchange rates:", data.exchangeRates);
          this.exchangeRates = data.exchangeRates;
        })
        .catch((error) => {
          console.error("Error fetching exchange rates:", error);
        });
    },
  },
};
</script>

<style scoped>
.table {
  margin: auto;
  width: 95%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}

.table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>

