import { useForm, useFieldArray } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"

const createEmptyPurchaseDetail = () => ({
  id: String(Date.now() + Math.random()),
  purchaseEmail: "",
  orderId: "",
  purchaseDate: "",
  productNo: null
})

const initialValues = {
  inquiryType: "",
  pinId: "",
  email: "",
  device: "",
  os: "",
  os_type: "",
  osVersion: "",
  title: "",
  content: "",
  mobile: "",
  marketAccount: "",
  purchaseList: [createEmptyPurchaseDetail()],
  attachFileList: [],
  isAgree: false,
  isOptionAgree: false
}

const schema = toTypedSchema(
  z.object({
    inquiryType: z.string().trim().min(1, "문의 유형을 선택해주세요"),
    pinId: z.string().trim(),
    email: z.string().trim().min(1, "이메일을 입력해주세요").email("올바른 이메일 형식이 아닙니다"),
    device: z.string().trim().min(1, "기기 정보를 입력해주세요"),
    os: z.string().trim().min(1, "OS 정보를 입력해주세요"),
    os_type: z.string().trim().min(1, "OS 타입을 입력해주세요"),
    osVersion: z.string().trim().min(1, "OS 버전을 입력해주세요"),
    title: z.string().trim().min(1, "제목을 입력해주세요"),
    content: z.string().trim().min(1, "내용을 입력해주세요"),
    mobile: z.string().trim().min(1, "휴대폰 번호를 입력해주세요"),
    marketAccount: z.string().trim(),
    purchaseList: z
      .array(
        z.object({
          id: z.string(),
          purchaseEmail: z.string().trim().min(1, "구매 이메일을 입력해주세요").email("올바른 이메일 형식이 아닙니다"),
          orderId: z.string().trim().min(1, "주문 번호를 입력해주세요"),
          purchaseDate: z.string().trim().min(1, "구매일을 입력해주세요"),
          productNo: z.string().nullable()
        })
      )
      .min(1, "구매 내역을 1개 이상 입력해주세요"),
    attachFileList: z.array(
      z.object({
        fileUrl: z.string().optional(),
        name: z.string().min(1, "파일명이 올바르지 않습니다"),
        status: z.enum(["uploading", "done", "error"])
      })
    ),
    isAgree: z.boolean().refine((value) => value === true, {
      message: "필수 약관에 동의해주세요"
    }),
    isOptionAgree: z.boolean()
  })
)

export const useInquiryForm = () => {
  const { handleSubmit, values, errors, setFieldValue, resetForm, isSubmitting } = useForm({
    validationSchema: schema,
    initialValues
  })

  const { fields: purchaseFields, push: pushPurchase, remove: removePurchase } = useFieldArray("purchaseList")

  const addPurchase = () => {
    pushPurchase(createEmptyPurchaseDetail())
  }

  const deletePurchase = (index) => {
    if (values.purchaseList.length === 1) return
    removePurchase(index)
  }

  const updateAttachFiles = (nextFiles) => {
    setFieldValue("attachFileList", nextFiles)
  }

  const addUploadingFile = (fileName) => {
    updateAttachFiles([
      ...values.attachFileList,
      {
        name: fileName,
        status: "uploading"
      }
    ])
  }

  const markFileAsDone = (response) => {
    const nextFiles = values.attachFileList.map((file) =>
      file.name === response.name
        ? {
            name: response.name,
            fileUrl: response.path,
            status: "done"
          }
        : file
    )

    updateAttachFiles(nextFiles)
  }

  const markFileAsError = (fileName) => {
    const nextFiles = values.attachFileList.map((file) =>
      file.name === fileName
        ? {
            ...file,
            status: "error"
          }
        : file
    )

    updateAttachFiles(nextFiles)
  }

  const removeAttachFile = (index) => {
    const nextFiles = values.attachFileList.filter((_, i) => i !== index)
    updateAttachFiles(nextFiles)
  }

  const uploadSingleFile = async (file) => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      returnCode: 0,
      name: file.name,
      path: `/uploads/${encodeURIComponent(file.name)}`
    }
  }

  const handleFileChange = async (event) => {
    const input = event.target
    const files = input.files

    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      addUploadingFile(file.name)

      try {
        const response = await uploadSingleFile(file)

        if (response.returnCode === 0) {
          markFileAsDone(response)
        } else {
          markFileAsError(file.name)
        }
      } catch (e) {
        markFileAsError(file.name)
      }
    }

    input.value = ""
  }

  const onSubmit = handleSubmit(async (formValues) => {
    const hasUploadingFile = formValues.attachFileList.some((file) => file.status === "uploading")

    if (hasUploadingFile) {
      alert("업로드 중인 파일이 있습니다. 업로드 완료 후 다시 시도해주세요.")
      return
    }

    console.log("submit payload:", formValues)
    alert(JSON.stringify(formValues, null, 2))
  })

  const onReset = () => {
    resetForm({
      values: {
        ...initialValues,
        purchaseList: [createEmptyPurchaseDetail()]
      }
    })
  }

  return {
    values,
    errors,
    isSubmitting,
    purchaseFields,
    addPurchase,
    deletePurchase,
    handleFileChange,
    removeAttachFile,
    onSubmit,
    onReset
  }
}
