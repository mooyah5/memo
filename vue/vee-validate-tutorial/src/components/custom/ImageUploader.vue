<template>
  <div>
    <input type="file" multiple @change="handleFileChange" />

    <ul>
      <li v-for="(file, index) in values.attachFileList" :key="file.name">
        {{ file.name }} - {{ file.status }}
        <button @click="remove(index)">삭제</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useFormContext } from "vee-validate"

const { values, setFieldValue } = useFormContext()

const handleFileChange = (e) => {
  const files = Array.from(e.target.files)
  setFieldValue("attachFileList", [
    ...values.attachFileList,
    ...files.map((f) => ({
      name: f.name,
      status: "uploading"
    }))
  ])
}

const remove = (index) => {
  const next = values.attachFileList.filter((_, i) => i !== index)
  setFieldValue("attachFileList", next)
}
</script>
