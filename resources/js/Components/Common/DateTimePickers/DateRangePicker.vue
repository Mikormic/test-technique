<script setup>
import { ref, computed } from "vue";
import moment from "moment";
import CalendarPopup from "./Partials/CalendarPopup.vue";
import Button from "../Button.vue";

const format = "DD/MM/YYYY";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Array,
    validator: (value) =>
      value?.every((date) => !date || moment.isMoment(date)),
    default: [null, null],
  },
});

const endDatePicker = ref(null);
const showStartDatePopup = ref(true);
const showEndDatePopup = ref(true);

const onStartDateChange = (date) => {
  emit("update:modelValue", [date, props.modelValue?.[1]]);
};

const onEndDateChange = (date) => {
  emit("update:modelValue", [props.modelValue?.[0], date]);
};

const dateRange = computed(() => {
  return {
    start: props.modelValue[0],
    end: props.modelValue[1]
  };
});
</script>

<template>
  <div class="max-w-xl mx-auto">
    <div class="bg-white border border-gray-300 rounded-lg shadow-lg p-6">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            From
          </label>
          <Button 
            class="date-button mb-4"
            @click="showStartDatePopup = !showStartDatePopup"
          >
            {{ modelValue?.[0]?.format(format) || 'Select start date' }}
          </Button>
          <CalendarPopup
            v-if="showStartDatePopup"
            :value="modelValue?.[0]"
            :with-time="false"
            :date-range="dateRange"
            @change="onStartDateChange"
            class="w-full"
          />
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            To
          </label>
          <Button 
            ref="endDatePicker"
            class="date-button mb-4"
            @click="showEndDatePopup = !showEndDatePopup"
          >
            {{ modelValue?.[1]?.format(format) || 'Select end date' }}
          </Button>
          <CalendarPopup
            v-if="showEndDatePopup"
            :value="modelValue?.[1]"
            :with-time="false"
            :date-range="dateRange"
            @change="onEndDateChange"
            class="w-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
</style>
<!-- TO DO Terminer le design et lié le tout à la bdd, faire une vraie pop up via un bouton-->