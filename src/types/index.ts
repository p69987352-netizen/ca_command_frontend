export interface Client {
  id?: string;
  name?: string;
  phoneNumber?: string;
  city?: string;
  pinCode?: string;
  clientType?: string;
  incomeRange?: string;
}

export interface Staff {
  id: string;
  name: string;
  phoneNumber?: string;
}

export interface Ticket {
  id: string;
  client?: Client;
  serviceType?: string;
  itrFormType?: string;
  status: string;
  priority?: string;
  progressPercent?: number;
  quotedFee?: number;
  cardRateFee?: number;
  discountPercent?: number;
  paymentStatus?: string;
  assignedStaff?: Staff;
  deadlineAt?: string;
  createdAt?: string;
  updatedAt?: string;
  adminNotes?: string;
  staffUpdate?: string;
  clientRequestLog?: string;
  revisionNotes?: string;
  credentialStatus?: string;
  credentialRequestedAt?: string;
  credentialRequestLabel?: string;
  credentialReceivedAt?: string;
  credentialData?: string;
  aisReportSnapshot?: any;
  clientDocuments?: string;
  staffSubmittedDocument?: string;
  paymentLink?: string;
  aisPdfPath?: string;
}
