// Kiểu Field (thông tin của field chính, parent của subField)
type Field = {
  name: string;  // chỉ cần name, vì populate chọn chỉ name
};

// Kiểu con của sân (SubField)
type SubField = {
  _id: string;
  fieldId: Field;       // đã populate, là object chứ không phải string
  name: string;         // tên sân, ví dụ "Sân số 1"
  type: string;         // loại sân, ví dụ "Sân 7 người"
  pricePerHour: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// Kiểu chính của Booking
export type Booking = {
  _id: string;
  subFieldId: SubField;   // thông tin sân (bao gồm fieldId)
  userId: string;         // id user
  duration: string;       // khoảng thời gian, ví dụ "5:00 - 6:30"
  day: string;            // ngày booking, ví dụ "2025-10-10"
  totalPrice: number;
  status: "confirmed" | "pending" | "cancel"; // trạng thái
  createdAt: string;
  updatedAt: string;
  __v: number;
};
