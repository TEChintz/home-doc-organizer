export type DocumentCategory =
  | "all"
  | "identity"
  | "health"
  | "vehicles"
  | "finance"
  | "education";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: "Self" | "Spouse" | "Father" | "Mother" | "Son" | "Daughter" | "Other";
  statusText: string;
  status: "Completed" | "In Progress" | "Pending";
  avatarBg: string;
  avatarEmoji: string;
  digilockerLinked: boolean;
  digilockerAadhaarMasked?: string;
  digilockerPhone?: string;
  digilockerLastSync?: string;
  documentsCount: number;
  age?: number;
  dob?: string;
  bloodGroup?: string;
  missingDocs?: string[];
  urgentAlert?: string;
}

export interface VaultDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  memberId: string;
  memberName: string;
  documentNumber: string;
  issuingAuthority: string;
  issuedDate: string;
  expiryDate?: string;
  dueDate: string;
  iconType: "stripes" | "arc" | "pinwheel" | "crescent" | "dots";
  iconColor: string;
  source: "digilocker" | "upload";
  fileSize?: string;
  isUrgent?: boolean;
}

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: "mem-1",
    name: "Alex Carter",
    relationship: "Self",
    statusText: "DigiLocker Linked",
    status: "Completed",
    avatarBg: "bg-amber-100",
    avatarEmoji: "👨🏻‍💻",
    digilockerLinked: true,
    digilockerAadhaarMasked: "•••• 8492",
    digilockerPhone: "+91 98201 •••••",
    digilockerLastSync: "Today, 10:30 AM",
    documentsCount: 4,
    age: 26,
    dob: "14 Aug 1998",
    bloodGroup: "O+",
    missingDocs: [],
  },
  {
    id: "mem-2",
    name: "Robert Carter",
    relationship: "Father",
    statusText: "1 Document Expiring",
    status: "In Progress",
    avatarBg: "bg-blue-100",
    avatarEmoji: "👨🏼‍🦳",
    digilockerLinked: true,
    digilockerAadhaarMasked: "•••• 3104",
    digilockerPhone: "+91 98190 •••••",
    digilockerLastSync: "Yesterday",
    documentsCount: 3,
    age: 58,
    dob: "02 Mar 1966",
    bloodGroup: "B+",
    urgentAlert: "Passport expires on 21 Oct 2026",
    missingDocs: ["Senior Citizen Concession ID"],
  },
  {
    id: "mem-3",
    name: "Sarah Carter",
    relationship: "Mother",
    statusText: "All Records Up to Date",
    status: "Completed",
    avatarBg: "bg-purple-100",
    avatarEmoji: "👵🏼",
    digilockerLinked: true,
    digilockerAadhaarMasked: "•••• 7721",
    digilockerPhone: "+91 98214 •••••",
    digilockerLastSync: "3 days ago",
    documentsCount: 3,
    age: 54,
    dob: "18 Nov 1970",
    bloodGroup: "A+",
    missingDocs: [],
  },
  {
    id: "mem-4",
    name: "Emily Carter",
    relationship: "Spouse",
    statusText: "DigiLocker Pending",
    status: "Pending",
    avatarBg: "bg-rose-100",
    avatarEmoji: "👩🏻‍💼",
    digilockerLinked: false,
    documentsCount: 2,
    age: 25,
    dob: "24 Jul 1999",
    bloodGroup: "O+",
    urgentAlert: "DigiLocker unlinked — Connect via OTP",
    missingDocs: ["DigiLocker Aadhaar Sync", "Term Life Policy"],
  },
  {
    id: "mem-5",
    name: "Leo Carter",
    relationship: "Son",
    statusText: "Needs DigiLocker Sync",
    status: "In Progress",
    avatarBg: "bg-docket-blue/10",
    avatarEmoji: "👦🏻",
    digilockerLinked: false,
    documentsCount: 2,
    age: 3,
    dob: "15 Jan 2021",
    bloodGroup: "O+",
    missingDocs: ["Aadhaar Enrollment (Baal Aadhaar)"],
  },
];

export const INITIAL_DOCUMENTS: VaultDocument[] = [
  {
    id: "doc-1",
    title: "Aadhaar Identity Card",
    category: "identity",
    memberId: "mem-1",
    memberName: "Alex Carter",
    documentNumber: "•••• •••• 8492",
    issuingAuthority: "UIDAI (Govt of India)",
    issuedDate: "12 Oct 2018",
    dueDate: "Due date: Nov 26, 2026",
    iconType: "stripes",
    iconColor: "#3b82f6",
    fileSize: "1.4 MB",
    source: "digilocker",
  },
  {
    id: "doc-2",
    title: "Indian Passport",
    category: "identity",
    memberId: "mem-2",
    memberName: "Robert Carter",
    documentNumber: "Z3918240",
    issuingAuthority: "Ministry of External Affairs",
    issuedDate: "22 Nov 2016",
    expiryDate: "21 Oct 2026",
    dueDate: "Due date: Oct 21, 2026",
    iconType: "crescent",
    iconColor: "#ea580c",
    fileSize: "2.1 MB",
    source: "digilocker",
    isUrgent: true,
  },
  {
    id: "doc-3",
    title: "Bajaj Allianz Car Insurance",
    category: "vehicles",
    memberId: "mem-2",
    memberName: "Robert Carter",
    documentNumber: "BAGIC-AUTO-77291",
    issuingAuthority: "Bajaj Allianz General Insurance",
    issuedDate: "21 Sep 2025",
    expiryDate: "20 Sep 2026",
    dueDate: "Due date: Sep 20, 2026",
    iconType: "arc",
    iconColor: "#0d9488",
    fileSize: "980 KB",
    source: "upload",
    isUrgent: true,
  },
  {
    id: "doc-4",
    title: "HDFC Ergo Optima Secure",
    category: "health",
    memberId: "mem-1",
    memberName: "Alex Carter",
    documentNumber: "POL-HE-2024-998",
    issuingAuthority: "HDFC ERGO General Insurance",
    issuedDate: "10 Oct 2024",
    expiryDate: "09 Oct 2026",
    dueDate: "Due date: Oct 09, 2026",
    iconType: "pinwheel",
    iconColor: "#f59e0b",
    fileSize: "1.8 MB",
    source: "upload",
  },
  {
    id: "doc-5",
    title: "Honda City Registration (RC)",
    category: "vehicles",
    memberId: "mem-2",
    memberName: "Robert Carter",
    documentNumber: "MH02-DX-4491",
    issuingAuthority: "RTO Maharashtra",
    issuedDate: "05 Apr 2021",
    dueDate: "Due date: Apr 05, 2036",
    iconType: "dots",
    iconColor: "#8b5cf6",
    fileSize: "1.1 MB",
    source: "digilocker",
  },
  {
    id: "doc-6",
    title: "Income Tax PAN Card",
    category: "identity",
    memberId: "mem-1",
    memberName: "Alex Carter",
    documentNumber: "ABCDE4492F",
    issuingAuthority: "Income Tax Department",
    issuedDate: "15 Jan 2019",
    dueDate: "Due date: Permanent",
    iconType: "stripes",
    iconColor: "#3b82f6",
    fileSize: "850 KB",
    source: "digilocker",
  },
  {
    id: "doc-7",
    title: "Star Health Senior Citizen Cover",
    category: "health",
    memberId: "mem-3",
    memberName: "Sarah Carter",
    documentNumber: "SH-SC-99104",
    issuingAuthority: "Star Health Insurance",
    issuedDate: "01 Nov 2024",
    expiryDate: "31 Oct 2026",
    dueDate: "Due date: Oct 31, 2026",
    iconType: "pinwheel",
    iconColor: "#10b981",
    fileSize: "1.6 MB",
    source: "upload",
  },
  {
    id: "doc-8",
    title: "Birth Certificate",
    category: "identity",
    memberId: "mem-5",
    memberName: "Leo Carter",
    documentNumber: "MCGM-B-2021-9921",
    issuingAuthority: "Municipal Corporation",
    issuedDate: "20 Jan 2021",
    dueDate: "Due date: Permanent",
    iconType: "arc",
    iconColor: "#06b6d4",
    fileSize: "1.3 MB",
    source: "upload",
  },
  {
    id: "doc-9",
    title: "Aadhaar Identity Card",
    category: "identity",
    memberId: "mem-3",
    memberName: "Sarah Carter",
    documentNumber: "•••• •••• 7721",
    issuingAuthority: "UIDAI",
    issuedDate: "05 Mar 2019",
    dueDate: "Due date: Permanent",
    iconType: "stripes",
    iconColor: "#3b82f6",
    fileSize: "1.2 MB",
    source: "digilocker",
  },
  {
    id: "doc-10",
    title: "Marriage Registration Certificate",
    category: "identity",
    memberId: "mem-4",
    memberName: "Emily Carter",
    documentNumber: "MUM-MR-2023-401",
    issuingAuthority: "Registrar of Marriages",
    issuedDate: "10 Dec 2023",
    dueDate: "Due date: Permanent",
    iconType: "dots",
    iconColor: "#ec4899",
    fileSize: "2.4 MB",
    source: "upload",
  },
];
