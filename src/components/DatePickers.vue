<template>
  <div class="date-pickers">
    <div class="field">
      <label class="label" for="fromDate">Kezdő dátum</label>
      <div class="control">
        <input
          class="input"
          type="date"
          id="fromDate"
          :value="fromDate"
          @change="updateFromDate($event.target.value)"
          :max="toDate ? toDate : getMaxToDate()"
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
          :value="toDate"
          @change="updateToDate($event.target.value)"
          :max="getMaxToDate()"
          :min="fromDate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getMaxToDate } from "../utils/DateUtils.js";

export default {
  props: {
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
  },
  methods: {
    updateFromDate(value) {
      this.$emit("update:fromDate", value);
      this.$emit("date-change", value, this.toDate);
    },
    updateToDate(value) {
      this.$emit("update:toDate", value);
      this.$emit("date-change", this.fromDate, value);
    },
    getMaxToDate() {
      return getMaxToDate();
    },
  },
};
</script>

<style scoped src="../styles/DatePicker.css"></style>
