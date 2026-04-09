import { debounce } from "@/utils/debounce"
import { ref, onMounted, onUnmounted } from "vue"

export const useResponsive = (breakpoint = 750) => {
  const isMobileView = ref(false)
  const windowInnerWidth = ref(0)
  const windowInnerHeight = ref(0)

  const handleResize = debounce(() => {
    isMobileView.value = window.innerWidth <= breakpoint
    windowInnerWidth.value = window.innerWidth
    windowInnerHeight.value = window.innerHeight
  }, 100)

  onMounted(() => {
    windowInnerWidth.value = window.innerWidth
    windowInnerHeight.value = window.innerHeight
    isMobileView.value = window.innerWidth <= breakpoint
    window.addEventListener("resize", handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize)
  })

  return {
    isMobileView,
    windowInnerWidth,
    windowInnerHeight
  }
}
