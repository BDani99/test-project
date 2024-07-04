<template>
  <div>
    <h2>Valuta árfolyamok</h2>

    <div v-if="exchangeRates" class="container">
      <div class="wrapper">
        <div class="table-container">
          <div class="table2">
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
      </div>
    </div>

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

<style>
.container {
  width: 100%;
  height: 82vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper {
  width: 95%;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
}

.wrapper::-webkit-scrollbar {
  display: none;
}

.table-container {
  max-height: 85%;
  overflow-y: auto;
  scrollbar-width: none;
}

.table2 {
  width: 100%;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: white;
  z-index: 2;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.header > div {
  flex: 1;
  text-align: center;
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
}

.data > div {
  flex: 1;
  text-align: center;
}


.data:not(:last-child) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.data:not(:last-child) > div {
  border-radius: 10px;
}
</style>



