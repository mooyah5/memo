<template>
  <div>
    <div v-for="(item, index) in purchaseFields" :key="item.id" class="purchase-item">
      <Field :name="`purchaseList.${index}.purchaseEmail`" placeholder="구매 이메일" />
      <ErrorMessage :name="`purchaseList.${index}.purchaseEmail`" />

      <Field :name="`purchaseList.${index}.orderId`" placeholder="주문 번호" />

      <button @click="remove(index)">삭제</button>
    </div>

    <button @click="add">구매 정보 추가</button>
  </div>
</template>

<script setup>
import { Field, ErrorMessage, useFieldArray } from "vee-validate"

const { fields: purchaseFields, push, remove } = useFieldArray("purchaseList")

const add = () => {
  push({
    id: String(Date.now()),
    purchaseEmail: "",
    orderId: "",
    purchaseDate: "",
    productNo: null
  })
}
</script>
