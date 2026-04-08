export type AttachFile = {
  fileUrl?: string
  name: string
  status: "uploading" | "done" | "error"
}

export type UploadResponse = {
  returnCode: number
  name: string
  path: string
}

export interface PurchaseDetail {
  id: string
  purchaseEmail: string
  orderId: string
  purchaseDate: string
  productNo: string | null
}

export interface InquiryForm {
  inquiryType: string
  pinId: string
  email: string
  device: string
  os: string
  os_type: string
  osVersion: string
  title: string
  content: string
  mobile: string
  marketAccount: string
  purchaseList: PurchaseDetail[]
  attachFileList: AttachFile[]
  isAgree: boolean
  isOptionAgree: boolean
}
