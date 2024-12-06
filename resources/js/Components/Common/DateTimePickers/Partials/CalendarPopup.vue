<script setup>
import { ref, computed } from "vue";
import moment from "moment";
import Button from "../../Button.vue";

moment.updateLocale("fr", { week: { dow: 1 } });

const props = defineProps({
  value: {
    type: Object,
    default: null,
  },
  dateRange: {
    type: Object,
    default: () => ({ start: null, end: null }),
  },
});

const emit = defineEmits(["change"]);

const currentMonth = ref(props.value ? moment(props.value) : moment());
const isChangingMonth = ref(false);

const daysInCalendar = computed(() => {
  const startOfWeek = currentMonth.value.clone().startOf("month").startOf("week");
  const endOfWeek = currentMonth.value.clone().endOf("month").endOf("week");

  const days = [];
  let day = startOfWeek.clone();
  while (day.isBefore(endOfWeek, "day")) {
    days.push(day.clone());
    day.add(1, "day");
  }

  return days;
});


const previousMonth = () => {
  if (isChangingMonth.value) return;
  isChangingMonth.value = true;
  currentMonth.value = currentMonth.value.clone().subtract(1, "month");
  setTimeout(() => {
    isChangingMonth.value = false;
  }, 100);
};

const nextMonth = () => {
  if (isChangingMonth.value) return;
  isChangingMonth.value = true;
  currentMonth.value = currentMonth.value.clone().add(1, "month");
  setTimeout(() => {
    isChangingMonth.value = false;
  }, 100);
};

const selectDate = (date) => {
  emit("change", date);
};

const isInRange = (day) => {
  if (!props.dateRange.start || !props.dateRange.end) return false;
  return day.isBetween(props.dateRange.start, props.dateRange.end, 'day', '[]');
};

const isRangeStart = (day) => {
  return props.dateRange.start && day.isSame(props.dateRange.start, 'day');
};

const isRangeEnd = (day) => {
  return props.dateRange.end && day.isSame(props.dateRange.end, 'day');
};
</script>

<template>
  <div class="calendar bg-white border border-gray-200 rounded-lg shadow">
    <div class="header flex justify-between items-center p-4 bg-gray-100">
      <Button @click="previousMonth" class="btn text-gray-600 hover:text-gray-800">◀</Button>
      <span class="font-bold text-lg uppercase">{{ currentMonth.format("MMMM YYYY") }}</span>
      <Button @click="nextMonth" class="btn text-gray-600 hover:text-gray-800">▶</Button>
    </div>

    <div class="days grid grid-cols-7 text-center bg-gray-50 py-2">
      <div v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']" :key="day" class="font-bold text-sm text-gray-600">
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1 p-2">
      <div
        v-for="day in daysInCalendar"
        :key="day.format('YYYY-MM-DD')"
        :class="[
          'p-2 text-center rounded-full cursor-pointer transition-colors duration-200',
          {
            'bg-blue-500 text-white hover:bg-blue-600': day.isSame(props.value, 'day'),
            'text-gray-400': !day.isSame(currentMonth.value, 'month'),
            'hover:bg-gray-100': !day.isSame(props.value, 'day') && !isInRange(day),
            'bg-red-100 hover:bg-red-200': isInRange(day) && !isRangeStart(day) && !isRangeEnd(day),
            'bg-red-500 text-white hover:bg-red-600': isRangeStart(day) || isRangeEnd(day),
          }
        ]"
        @click="selectDate(day)"
      >
        {{ day.date() }}
      </div>
    </div>

    <div v-if="props.value" class="p-4 mt-2 bg-gray-100 text-center text-sm">
      Date sélectionnée : {{ props.value.format("DD/MM/YYYY") }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>
</style>

