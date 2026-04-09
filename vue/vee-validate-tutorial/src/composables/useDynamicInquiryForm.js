import { useForm } from "vee-validate"
import { z } from "zod"
import { toTypedSchema } from "@vee-validate/zod"

const schema = toTypedSchema(
  z.object({
    email: z.string().email("이메일 형식이 아닙니다"),
    inquiryType: z.string().min(1, "문의 유형 선택"),
    content: z.string().min(1, "내용 입력"),
    purchaseList: z.array(z.any()),
    attachFileList: z.array(z.any()),
    isAgree: z.boolean().refine((val) => val === true, {
      message: "약관에 동의해주세요"
    })
  })
)

export const useDynamicInquiryForm = () => {
  const form = useForm({
    validationSchema: schema,
    initialValues: {
      email: "",
      inquiryType: "",
      content: "",
      purchaseList: [],
      attachFileList: [],
      isAgree: false
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    console.log("SUBMIT:", values)
  })

  return {
    ...form,
    onSubmit
  }
}
