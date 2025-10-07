export const SUBMISSION_STATUS = {
  PENDING_PAYMENT: 'Pending Payment',
  PAID: 'Paid',
  APPROVED: 'Approved'
}

export const STATUS_TAG_CLASSES = {
  [SUBMISSION_STATUS.PENDING_PAYMENT]: 'govuk-tag--orange',
  [SUBMISSION_STATUS.PAID]: 'govuk-tag--blue',
  [SUBMISSION_STATUS.APPROVED]: 'govuk-tag--green'
}
