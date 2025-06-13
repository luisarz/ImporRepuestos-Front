<template>
  <v-select
      v-model="internalValue"
      :options="options"
      :filterable="false"
      :loading="isLoading"
      @search="onSearch"
      :label="labelField"
      :placeholder="placeholder"
      :reduce="item => item[valueField]"
      v-bind="$attrs"
  >
    <template #no-options="{ search }">
      <template v-if="search.length < minQueryLength">
        Escribe al menos {{ minQueryLength }} caracteres...
      </template>
      <template v-else-if="isLoading">
        Buscando resultados...
      </template>
      <template v-else>
        No se encontraron resultados para "{{ search }}"
      </template>
    </template>

    <template #option="option">
      <slot name="option" v-bind="option">
        <div class="option-item">
          <strong>{{ option[labelField] }}</strong>
          <small v-if="option[secondaryField]">{{ option[secondaryField] }}</small>
        </div>
      </slot>
    </template>
  </v-select>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Array],
    default: null
  },
  apiUrl: {
    type: String,
    required: true
  },
  labelField: {
    type: String,
    default: 'name'
  },
  valueField: {
    type: String,
    default: 'id'
  },
  secondaryField: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  },
  minQueryLength: {
    type: Number,
    default: 3
  },
  debounceTime: {
    type: Number,
    default: 500
  },
  initialOptions: {
    type: Array,
    default: () => []
  },
  params: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue', 'search', 'selected']);

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    emit('selected', value);
  }
});

const options = ref([...props.initialOptions]);
const isLoading = ref(false);
const lastSearch = ref('');

// Buscar opciones remotamente
const onSearch = debounce(async (search, loading) => {
  if (search.length < props.minQueryLength) {
    options.value = [];
    return;
  }

  if (lastSearch.value === search) return;
  lastSearch.value = search;

  isLoading.value = true;
  loading(true);

  try {
    const queryParams = new URLSearchParams({
      search,
      ...props.params
    }).toString();

    const response = await fetch(`${props.apiUrl}?${queryParams}`);
    const data = await response.json();

    options.value = data;
    emit('search', { search, results: data });
  } catch (error) {
    console.error('Error fetching options:', error);
    options.value = [];
    emit('search', { search, error });
  } finally {
    isLoading.value = false;
    loading(false);
  }
}, props.debounceTime);

// Función debounce
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Si cambian las opciones iniciales, actualizamos
watch(() => props.initialOptions, (newVal) => {
  options.value = [...newVal];
}, { deep: true });
</script>

<style scoped>
.option-item {
  line-height: 1.2;
}

.option-item small {
  display: block;
  color: #666;
  font-size: 0.8em;
}
</style>