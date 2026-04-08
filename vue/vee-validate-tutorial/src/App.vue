<template>
  <div class="page">
    <InquiryForm />
    <br />
    <FormGenerator />
  </div>
</template>

<script setup>
import InquiryForm from "@/components/InquiryForm.vue"
import FormGenerator from "./components/dynamic/FormGenerator.vue"
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px 80px;
}
</style>
