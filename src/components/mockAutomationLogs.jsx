export const mockAutomationLogs = [
  {
    id: 1,
    date: "2025-10-06",
    source: "Gmail",
    action: "Send follow-up email",
    status: "Success",
    details: "Email sent to applicant (ID: 203)",
  },
  {
    id: 2,
    date: "2025-10-06",
    source: "LinkedIn",
    action: "Fetch applications",
    status: "Failed",
    details: "API timeout error (code 504)",
  },
  {
    id: 3,
    date: "2025-10-07",
    source: "PostgreSQL",
    action: "Sync new applications",
    status: "Success",
    details: "3 records synced successfully",
  },
  {
    id: 4,
    date: "2025-10-07",
    source: "Gmail",
    action: "Send rejection email",
    status: "Failed",
    details: "Invalid email format for ID 209",
  },
];
