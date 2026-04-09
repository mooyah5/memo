<template>
  <div class="form-container">
    <h1>Dynamic Form Generator</h1>

    <form @submit="onSubmit">
      <DynamicForm :schema="schema" />
      <button type="submit">제출</button>
    </form>
  </div>
</template>

<script setup>
import { watch } from "vue"
import DynamicForm from "./DynamicForm.vue"
import { inquiryFormSchema as schema } from "@/schema/inquiryFormSchema"
import { useDynamicInquiryForm } from "@/composables/useDynamicInquiryForm"

const { onSubmit, values, errors } = useDynamicInquiryForm()

watch(
  values,
  (newValues) => {
    console.log("현재 values:", newValues)
  },
  { deep: true }
)

watch(
  errors,
  (newErrors) => {
    console.log("현재 errors:", newErrors)
  },
  { deep: true }
)
</script>
