export const inquiryFormSchema = {
  fields: [
    {
      type: "input",
      label: "이메일",
      name: "email",
      props: {
        type: "email",
        placeholder: "이메일 입력"
      },
      tooltip: {
        title: "asdf",
        description: "weraksdfasdfasdf"
      }
    },
    {
      type: "select",
      label: "문의 유형",
      name: "inquiryType",
      options: [
        { label: "결제", value: "payment" },
        { label: "환불", value: "refund" }
      ]
    },
    {
      type: "textarea",
      label: "내용",
      name: "content"
    },
    {
      type: "custom",
      label: "구매 정보",
      name: "purchaseList",
      component: "PurchaseDetail"
    },
    {
      type: "custom",
      label: "첨부 파일",
      name: "attachFileList",
      component: "ImageUploader"
    },
    {
      type: "checkbox",
      label: "약관 동의",
      name: "isAgree"
    }
  ]
}
