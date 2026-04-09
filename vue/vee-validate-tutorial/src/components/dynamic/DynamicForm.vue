<template>
  <div class="write-form">
    <ul>
      <li class="form-field" :class="{ 'bg-gray': field.type === 'agree' }" v-for="field in schema.fields" :key="field.name" style="margin-bottom: 16px">
        <div class="field-wrap">
          <div class="label-wrap">
            <label style="display: block; font-weight: bold">
              {{ field.label }}
            </label>
            <TooltipField v-if="field.tooltip" :title="field.tooltip.title" :content="field.tooltip.description" />
          </div>

          <!-- input / textarea -->
          <Field v-if="field.type === 'input' || field.type === 'textarea'" :as="field.type" :name="field.name" v-bind="field.props" />

          <!-- radio -->
          <Field v-slot="{ field }" name="terms" type="checkbox" :value="true" :unchecked-value="false">
            <label>
              <input type="checkbox" name="terms" v-bind="field" :value="true" />
              I agree
            </label>
          </Field>

          <!-- select -->
          <Field v-else-if="field.type === 'select'" as="select" :name="field.name">
            <option value="">선택</option>
            <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </Field>

          <!-- checkbox -->
          <Field v-else-if="field.type === 'checkbox'" type="checkbox" :name="field.name" :value="true" />

          <!-- custom -->
          <component v-else-if="field.type === 'custom'" :is="customComponents[field.component]" />

          <ErrorMessage class="error-txt" :name="field.name" style="color: red" />
          <span v-if="field.description" class="desc-txt">{{ field.description }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { Field, ErrorMessage } from "vee-validate"
import PurchaseDetail from "../custom/PurchaseDetail.vue"
import ImageUploader from "../custom/ImageUploader.vue"
import TooltipField from "../form/TooltipField.vue"

defineProps({
  schema: Object
})

const customComponents = {
  PurchaseDetail,
  ImageUploader
}
</script>

<style scoped lang="scss">
$primary-color: #d02a75;

select {
  width: 100%;
  max-width: 332px;
  // @include tablet {
  //   max-width: unset;
  // }
}
input,
textarea {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  font-size: 15px;
  // @include desktop {
  //   width: v-bind(inputWidth);
  // }
  // @include tablet {
  //   width: 100%;
  // }
  &:disabled {
    color: #c0c0c0;
  }
  &::placeholder {
    font-size: 14px;
    color: #c0c0c0;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
}
input {
  line-height: 38px;
  display: block;
  padding: 0 12px;
  height: 38px;
}
textarea {
  display: block;
  padding: 8px 12px;
  resize: none;
  overflow-y: auto;
}
.field-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  .error-txt {
    display: inline-block;
    margin-top: 4px;
    font-size: 13px;
    color: red;
  }
  .desc-txt {
    display: inline-block;
    margin-top: 4px;
    font-size: 13px;
    color: silver;
  }
}

.write-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  ul {
    display: flex;
    flex-direction: column;
    .form-field {
      width: 100%;
      display: flex;
      align-items: start;
      position: relative;
      padding: 10px 20px;
      border-bottom: 1px solid #e0e0e0;
      // @include tablet {
      //   padding: 12px 0;
      //   flex-direction: column;
      //   gap: 6px;
      // }

      // @include tablet {
      //   align-items: start;
      // }
      .label-wrap {
        width: 26%;
        flex-shrink: 0;
        margin-top: 8px;
        // @include tablet {
        //   width: 100%;
        // }
      }
      .input-wrap {
        width: 100%;
      }

      &.bg-gray {
        background-color: #fafafa;
      }
    }
  }
}
.select-box {
  width: 100%;
  max-width: 332px;
  // @include tablet {
  //   max-width: unset;
  // }
}
.os-form-wrapper {
  width: 100%;
}
.purchase-form-wrapper {
  width: 100%;
}

.notice-text {
  font-size: 14px;
  color: #606060;
}
.btn-wrap {
  padding-top: 20px;
  margin-bottom: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  .submit {
    border-color: $primary-color;
    color: $primary-color;
  }
  .cancel {
    border: 1px solid #e0e0e0;
  }
}

.label-wrap {
  display: flex;
  align-items: start;
  gap: 6px;

  label {
    font-size: 14px;
    line-height: 20px;
    color: #909090;
    margin-left: 10px;

    .sub {
      font-size: 13px;
      line-height: 16px;
      font-weight: normal;
      white-space: pre-line;
      display: block;
      margin-top: 4px;
      // @include tablet {
      //   display: unset;
      // }
    }

    &.isRequired {
      &::before {
        content: "* ";
        color: red;
        font-weight: bold;
        margin-left: -10px;
      }
    }

    &.isBold {
      font-weight: bold;
    }
  }
}
</style>
