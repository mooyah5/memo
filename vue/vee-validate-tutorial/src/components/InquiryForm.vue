<script setup>
import { useInquiryForm } from "@/composables/useInquiryForm"
import { Field, ErrorMessage } from "vee-validate"

const { values, errors, isSubmitting, purchaseFields, addPurchase, deletePurchase, handleFileChange, removeAttachFile, onSubmit, onReset } = useInquiryForm()
</script>

<template>
  <h1>CS 문의 등록</h1>

  <form class="form" @submit="onSubmit">
    <!-- 문의 유형 -->
    <section class="section">
      <h2>기본 정보</h2>

      <div class="field">
        <label for="inquiryType">문의 유형</label>
        <Field as="select" name="inquiryType" id="inquiryType">
          <option value="">선택해주세요</option>
          <option value="account">계정</option>
          <option value="payment">결제</option>
          <option value="bug">오류</option>
          <option value="etc">기타</option>
        </Field>
        <ErrorMessage name="inquiryType" class="error" />
      </div>

      <div class="field">
        <label for="pinId">PIN ID</label>
        <Field name="pinId" id="pinId" type="text" />
        <ErrorMessage name="pinId" class="error" />
      </div>

      <div class="field">
        <label for="email">이메일</label>
        <Field name="email" id="email" type="email" />
        <ErrorMessage name="email" class="error" />
      </div>

      <div class="field">
        <label for="mobile">휴대폰 번호</label>
        <Field name="mobile" id="mobile" type="text" />
        <ErrorMessage name="mobile" class="error" />
      </div>

      <div class="field">
        <label for="marketAccount">마켓 계정</label>
        <Field name="marketAccount" id="marketAccount" type="text" />
        <ErrorMessage name="marketAccount" class="error" />
      </div>
    </section>

    <!-- 디바이스 정보 -->
    <section class="section">
      <h2>디바이스 정보</h2>

      <div class="field">
        <label for="device">기기명</label>
        <Field name="device" id="device" type="text" />
        <ErrorMessage name="device" class="error" />
      </div>

      <div class="field">
        <label for="os">OS</label>
        <Field as="select" name="os" id="os">
          <option value="">선택해주세요</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
          <option value="windows">Windows</option>
          <option value="macos">macOS</option>
        </Field>
        <ErrorMessage name="os" class="error" />
      </div>

      <div class="field">
        <label for="os_type">OS 타입</label>
        <Field name="os_type" id="os_type" type="text" />
        <ErrorMessage name="os_type" class="error" />
      </div>

      <div class="field">
        <label for="osVersion">OS 버전</label>
        <Field name="osVersion" id="osVersion" type="text" />
        <ErrorMessage name="osVersion" class="error" />
      </div>
    </section>

    <!-- 문의 내용 -->
    <section class="section">
      <h2>문의 내용</h2>

      <div class="field">
        <label for="title">제목</label>
        <Field name="title" id="title" type="text" />
        <ErrorMessage name="title" class="error" />
      </div>

      <div class="field">
        <label for="content">내용</label>
        <Field as="textarea" name="content" id="content" rows="6" />
        <ErrorMessage name="content" class="error" />
      </div>
    </section>

    <!-- 구매 내역 -->
    <section class="section">
      <div class="section-header">
        <h2>구매 내역</h2>
        <button type="button" class="btn" @click="addPurchase">구매 내역 추가</button>
      </div>

      <p v-if="errors.purchaseList" class="error">
        {{ errors.purchaseList }}
      </p>

      <div v-for="(purchaseField, index) in purchaseFields" :key="purchaseField.key" class="purchase-card">
        <div class="purchase-header">
          <h3>구매 내역 {{ index + 1 }}</h3>
          <button type="button" class="btn danger" @click="deletePurchase(index)" :disabled="values.purchaseList?.length === 1">삭제</button>
        </div>

        <div class="field">
          <label :for="`purchaseEmail-${index}`">구매 이메일</label>
          <Field :name="`purchaseList[${index}].purchaseEmail`" :id="`purchaseEmail-${index}`" type="email" />
          <ErrorMessage :name="`purchaseList[${index}].purchaseEmail`" class="error" />
        </div>

        <div class="field">
          <label :for="`orderId-${index}`">주문 번호</label>
          <Field :name="`purchaseList[${index}].orderId`" :id="`orderId-${index}`" type="text" />
          <ErrorMessage :name="`purchaseList[${index}].orderId`" class="error" />
        </div>

        <div class="field">
          <label :for="`purchaseDate-${index}`">구매일</label>
          <Field :name="`purchaseList[${index}].purchaseDate`" :id="`purchaseDate-${index}`" type="date" />
          <ErrorMessage :name="`purchaseList[${index}].purchaseDate`" class="error" />
        </div>

        <div class="field">
          <label :for="`productNo-${index}`">상품 번호 (선택)</label>
          <Field :name="`purchaseList[${index}].productNo`" :id="`productNo-${index}`" type="text" />
          <ErrorMessage :name="`purchaseList[${index}].productNo`" class="error" />
        </div>
      </div>
    </section>

    <!-- 첨부 파일 -->
    <section class="section">
      <h2>첨부 파일</h2>

      <div class="field">
        <label for="files">파일 업로드</label>
        <input id="files" type="file" multiple @change="handleFileChange" />
      </div>

      <ul v-if="values?.attachFileList?.length > 0" class="file-list">
        <li v-for="(file, index) in values.attachFileList" :key="`${file.name}-${index}`" class="file-item">
          <div class="file-info">
            <strong>{{ file.name }}</strong>
            <span class="file-status" :class="file.status">
              {{ file.status }}
            </span>
            <button v-if="file.fileUrl" :href="file.fileUrl" target="_blank" rel="noopener noreferrer" @click="removeAttachFile(index)">제거</button>
          </div>
        </li>
      </ul>
    </section>

    <!-- 약관 -->
    <section class="section">
      <h2>약관 동의</h2>

      <div class="checkbox-field">
        <Field name="isAgree" v-slot="{ field, value, handleChange, handleBlur }">
          <label class="checkbox-label">
            <input :name="field.name" type="checkbox" :checked="value" @change="handleChange" @blur="handleBlur" />
            필수 약관에 동의합니다
          </label>
        </Field>
        <ErrorMessage name="isAgree" class="error" />
      </div>

      <div class="checkbox-field">
        <Field name="isOptionAgree" v-slot="{ field, value, handleChange, handleBlur }">
          <label class="checkbox-label">
            <input :name="field.name" type="checkbox" :checked="value" @change="handleChange" @blur="handleBlur" />
            선택 약관에 동의합니다
          </label>
        </Field>
        <ErrorMessage name="isOptionAgree" class="error" />
      </div>
    </section>

    <!-- 버튼 -->
    <section class="actions">
      <button type="button" class="btn secondary" @click="onReset">초기화</button>
      <button type="submit" class="btn primary" :disabled="isSubmitting">
        {{ isSubmitting ? "제출 중..." : "제출" }}
      </button>
    </section>

    <!-- 디버깅 -->
    <section class="section debug">
      <h2>현재 values</h2>
      <pre>{{ values }}</pre>
    </section>
  </form>
</template>

<style scoped>
h1 {
  margin-bottom: 24px;
  font-size: 28px;
}

.section {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-header,
.purchase-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.field,
.checkbox-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

label {
  font-weight: 600;
}

input,
select,
textarea,
button {
  font: inherit;
}

input[type="text"],
input[type="email"],
input[type="date"],
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #bbb;
  border-radius: 8px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
}

.error {
  color: #d93025;
  font-size: 14px;
}

.purchase-card {
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.file-status {
  font-size: 13px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eee;
}

.file-status.uploading {
  background: #fff4cc;
}

.file-status.done {
  background: #d7f5dd;
}

.file-status.error {
  background: #ffd9d9;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
}

.btn.primary {
  background: #111827;
  color: white;
}

.btn.secondary {
  background: #e5e7eb;
  color: #111827;
}

.btn.danger {
  background: #fee2e2;
  color: #991b1b;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.debug pre {
  background: #111827;
  color: #e5e7eb;
  padding: 16px;
  border-radius: 8px;
  overflow: auto;
}
</style>
