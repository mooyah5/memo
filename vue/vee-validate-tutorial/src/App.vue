<template>
  <Form :initial-values="INITIAL_VALUES" :validation-schema="schema" @submit="onSubmit">
    <label for="email">email</label>
    <Field id="email" name="email" type="email" />
    <ErrorMessage name="email" />
    <br />
    <label for="name">name </label>
    <Field id="name" name="name" />
    <ErrorMessage name="name" />

    <br />
    <button>Submit</button>
  </Form>
</template>

<script setup>
import { Form, Field, ErrorMessage } from "vee-validate"

import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"

const INITIAL_VALUES = {
  email: "",
  name: ""
}

const schema = toTypedSchema(
  z.object({
    email: z.string().trim().min(1, "이메일을 입력해주세요").email("올바른 이메일 형식이 아닙니다"),
    name: z.string().trim().min(1, "이름을 입력해주세요")
  })
)

const onSubmit = (values) => {
  alert(JSON.stringify(values, null, 2))
}
</script>
