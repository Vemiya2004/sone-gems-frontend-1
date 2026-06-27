import { format } from "date-fns";

export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatDate(date: string | Date | undefined): string {
  if (!date) return "";
  return format(new Date(date), "MMM dd, yyyy");
}

export function formatDateTime(date: string | Date | undefined): string {
  if (!date) return "";
  return format(new Date(date), "MMM dd, yyyy h:mm a");
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}