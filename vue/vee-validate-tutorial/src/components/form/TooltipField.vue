<template>
  <div ref="wrapper" class="tip-wrapper">
    <button class="tip-icon" @click="open = !open">?</button>
    <div v-if="open" class="tooltip" :style="{ width: tooltipWidth }" @click.stop>
      <button class="close-btn" @click="open = false"></button>
      <div v-if="title" class="tooltip-title">{{ title }}</div>
      <div v-if="description" class="tooltip-description">
        {{ description }}
      </div>
      <div v-else class="tooltip-description">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useResponsive } from "@/composables/useResponsive"
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

const { isMobileView, windowInnerWidth } = useResponsive()

// title(툴팁제목), description(툴팁내용), containerName(툴팁을 감싼 컨테이너명. 툴팁 길이 계산용)
const props = defineProps({
  title: String,
  description: String,
  containerName: {
    type: String,
    default: "form-container"
  }
})

const open = ref(false)
const wrapper = ref(null)

const tooltipWidth = computed(() => {
  const container = document.querySelector(`.${props.containerName}`)

  const tipIconLeft = wrapper.value.querySelector(".tip-icon")?.getBoundingClientRect().left
  const containerRight = container.getBoundingClientRect().right
  const mobileRightPadding = isMobileView.value ? windowInnerWidth.value * 0.034 : 0

  return `${containerRight - tipIconLeft - mobileRightPadding}px`
})

const handleClickOutside = (e) => {
  if (!wrapper.value) return
  if (!wrapper.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})
</script>

<style lang="scss" scoped>
.tip-wrapper {
  position: relative;
  display: inline-block;
  align-self: flex-start;
  margin-left: 10px;
}

.tip-icon {
  cursor: pointer;
  width: 22px;
  height: 22px;
  border: 1px solid #e0e0e0;
  background: transparent;
  border-radius: 50%;
  box-sizing: border-box;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #838383;
}

.tooltip {
  position: absolute;
  z-index: 20;
  top: 30px;
  left: 0;
  background: #fff;
  padding: 12px 14px;
  width: max-content;
  min-width: 150px;
  min-height: 50px;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.2);
  font-size: 13px;
  color: #000;
  .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 22px;
    height: 22px;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 14px;
      height: 2px;
      background: #909090;
      transform-origin: center;
    }
    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
  .tooltip-title {
    font-weight: bold;
    white-space: pre-line;
  }
  .tooltip-description {
    margin-top: 12px;
    color: #909090;
    white-space: pre-line;
    strong {
      font-weight: unset;
      font-weight: 500 !important;
      color: #606060;
    }
  }
}
</style>
