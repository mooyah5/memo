<template>
  <Form>
    <div v-for="{ as, name, label, ...attrs } in schema.fields" :key="name">
      <label :for="name">{{ label }}</label>
      <Field :as="as" :id="name" :name="name" v-bind="attrs" />
    </div>
    <button>Submit</button>
  </Form>
</template>
<script setup>
import { Form, Field } from "vee-validate"
defineProps({
  schema: {
    type: Object,
    required: true
  }
})
</script>
