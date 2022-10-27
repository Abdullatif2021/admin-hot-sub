<template>
  <div style="display: flex; flex-direction: column;">
    <calendar-panel
      :calendar="startCalendar"
      :get-classes="getClasses"
      :value="startValue"
      value-type="YYYY-MM-DD"
      type="datetime"
      :disabled-date="disabledStartDate"
      @update:calendar="updateStartCalendar"
      @select="handleSelectStart"
    ></calendar-panel>
    <calendar-panel
      :calendar="endCalendar"
      :get-classes="getClasses"
      :value="endValue"
      type="datetime"
      value-type="YYYY-MM-DD"
      :disabled-date="disabledEndDate"
      @update:calendar="updateEndCalendar"
      @select="handleSelectEnd"
    ></calendar-panel>
  </div>
</template>

<script>
import { differenceInCalendarMonths } from "date-fns";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

const { CalendarPanel } = DatePicker;

function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

function isValidRangeDate(date) {
  return (
    Array.isArray(date) &&
    date.length === 2 &&
    date.every(isValidDate) &&
    date[0] <= date[1]
  );
}

export default {
  name: "CalendarRange",
  components: {
    CalendarPanel,
  },
  props: {
    value: {},
    defaultValue: {
      default() {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      },
    },
  },
  data() {
    return {
      startCalendar: new Date(),
      endCalendar: new Date(),
      startValue: null,
      endValue: null,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        const [start, end] = isValidRangeDate(this.value)
          ? this.value
          : [null, null];
        this.startValue = start;
        this.endValue = end;
      },
    },
    startValue: {
      immediate: true,
      handler(val) {
        this.updateStartCalendar(isValidDate(val) ? val : this.defaultValue);
      },
    },
    endValue: {
      immediate: true,
      handler(val) {
        this.updateEndCalendar(isValidDate(val) ? val : this.defaultValue);
      },
    },
  },
  methods: {
    updateStartCalendar(value) {
      this.startCalendar = value;
      const diff = differenceInCalendarMonths(
        this.endCalendar,
        this.startCalendar
      );
      if (diff < 0) {
        this.endCalendar = value;
      }
    },
    updateEndCalendar(value) {
      this.endCalendar = value;
      const diff = differenceInCalendarMonths(
        this.endCalendar,
        this.startCalendar
      );
      if (diff < 0) {
        this.startCalendar = value;
      }
    },
    getClasses(cellDate, currentDates, classnames) {
      const classes = [];
      if (
        !/disabled|active|not-current-month/.test(classnames) &&
        this.startValue &&
        this.endValue &&
        cellDate.getTime() >= this.startValue.getTime() &&
        cellDate.getTime() <= this.endValue.getTime()
      ) {
        classes.push("in-range");
      }
      return classes;
    },
    disabledStartDate(date) {
      return this.endValue && this.endValue.getTime() < date.getTime();
    },
    disabledEndDate(date) {
      return this.startValue && this.startValue.getTime() > date.getTime();
    },
    handleSelectStart(date, type) {
      this.startValue = date;
      if (this.endValue) {
        this.$emit("select", [this.startValue, this.endValue], "range");
      }
    },
    handleSelectEnd(date, type) {
      this.endValue = date;
      if (this.startValue) {
        this.$emit("select", [this.startValue, this.endValue], "range");
      }
    },
  },
};
</script>
