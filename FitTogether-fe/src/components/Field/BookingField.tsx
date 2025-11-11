import React, { useEffect, useState } from "react";
import { Gift, X } from "lucide-react";
import { subFieldService } from "../../services/subFieldsService";
import bookingService from "../../services/bookingService";
import fieldService from "../../services/fieldService";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";

interface BookingFieldProps {
  open: boolean;
  onClose: () => void;
  field: any;
}

const BookingField: React.FC<BookingFieldProps> = ({
  open,
  onClose,
  field,
}) => {
  if (!open) return null;

  const fieldId = field?.id;

  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedSlots, setSelectedSlots] = useState<
    { time: string; field: string; date: string; pricePerHour: number }[]
  >([]);
  const [weekIndex, setWeekIndex] = useState(0);
  const [subFields, setSubFields] = useState<any[]>([]);
  const [fieldSlots, setFieldSlots] = useState<string[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // Hàm pad để định dạng số
  const pad = (n: number) => n.toString().padStart(2, "0");

  // Ngày hiện tại
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); // 0-11
  const currentYear = today.getFullYear();

  // selectedDate ban đầu theo local time
  const initialDateString = `${currentYear}-${pad(currentMonth + 1)}-${pad(
    currentDay
  )}`;
  const [selectedDate, setSelectedDate] = useState<string>(initialDateString);

  // Tổng số ngày trong tháng
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Danh sách tất cả ngày còn lại trong tháng (local time)
  const allDates = Array.from(
    { length: daysInMonth - currentDay + 1 },
    (_, i) => {
      const date = new Date(currentYear, currentMonth, currentDay + i);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const weekday = date.toLocaleDateString("vi-VN", { weekday: "short" });
      const dateString = `${date.getFullYear()}-${pad(
        date.getMonth() + 1
      )}-${pad(date.getDate())}`;
      return { day, month, weekday, dateString };
    }
  );

  // Xác định 7-10 ngày hiển thị hiện tại
  const start = weekIndex * 10;
  const end = start + 10;
  const visibleDates = allDates.slice(start, end);

  const getSlotsByFieldId = async (fieldId: string) => {
    try {
      const response = await fieldService.getFieldById(fieldId);
      setFieldSlots(response.data?.slots || []);
    } catch (error) {
      console.error("Error fetching sub-fields:", error);
    }
  };

  useEffect(() => {
    getSlotsByFieldId(fieldId);
  }, [fieldId]);

  const handlePrev = () => {
    if (weekIndex > 0) setWeekIndex(weekIndex - 1);
  };

  const handleNext = () => {
    if (end < allDates.length) setWeekIndex(weekIndex + 1);
  };

  // Kiểm tra slot đã đặt
  const isBooked = (time: string, field: string) =>
    bookings.some(
      (b) =>
        b.duration === time && b.field === field && b.status === "confirmed"
    );

  // Kiểm tra slot đã chọn
  const isSelected = (time: string, field: string) =>
    selectedSlots.length > 0 &&
    selectedSlots[0].time === time &&
    selectedSlots[0].field === field &&
    selectedSlots[0].date === selectedDate;

  const toggleSlot = (time: string, field: string, pricePerHour: number) => {
    if (!selectedDate) return;
    if (isBooked(time, field)) return;

    const isSameSlot =
      selectedSlots.length > 0 &&
      selectedSlots[0].time === time &&
      selectedSlots[0].field === field &&
      selectedSlots[0].pricePerHour === pricePerHour &&
      selectedSlots[0].date === selectedDate;

    if (isSameSlot) {
      setSelectedSlots([]);
    } else {
      setSelectedSlots([{ time, field, pricePerHour, date: selectedDate }]);
    }
  };

  // Lấy subFields
  const getSubFieldsByFieldId = async (fieldId: string) => {
    try {
      const response = await subFieldService.getSubFieldsByFieldId(fieldId);

      if (response.success) {
        setSubFields(response.data || []);
      } else {
        console.error("Failed to fetch sub-fields:", response.message);
        setSubFields([]);
      }
    } catch (error) {
      console.error("Failed to fetch sub-fields:", error);
      setSubFields([]);
    }
  };

  // Lấy bookings
  const getBookings = async (subFieldId: string, day: string) => {
    try {
      const response = await bookingService.getBookings(subFieldId, day);
      if (response.success) {
        return response.data.data;
      } else {
        console.log("Booking API failed:", response.message);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      return [];
    }
  };

  const booking = async () => {
    if (selectedSlots.length === 0) {
      alert("Please select a slot to book.");
      return;
    }

    if (!phoneNumber.trim()) {
      alert("Vui lòng nhập số điện thoại.");
      return;
    }

    // Validate phone number format (simple validation for Vietnamese phone numbers)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      alert(
        "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại 10 chữ số bắt đầu bằng 03, 05, 07, 08 hoặc 09."
      );
      return;
    }

    if (subFields.length === 0) {
      alert(
        "Sub-fields are still loading. Please wait a moment and try again."
      );
      return;
    }

    const selectedSlot = selectedSlots[0];

    // Tìm subFieldId dựa vào tên sân
    const subField = subFields.find((f) => f.name === selectedSlot.field);

    if (!subField) {
      alert("Cannot find sub-field for selected slot.");
      return;
    }

    const bookingRequest = {
      day: selectedSlot.date,
      duration: selectedSlot.time,
      totalPrice: subField.pricePerHour,
      phone: phoneNumber.trim(),
    };

    try {
      const response = await bookingService.booking(
        subField.id,
        bookingRequest
      );

      if (response.success) {
        alert("Booking successful!");
        setBookings((prev) => [
          ...prev,
          {
            duration: selectedSlot.time,
            field: selectedSlot.field,
            subFieldId: subField._id,
            date: selectedSlot.date,
            status: "confirmed", // hiển thị ngay là đã đặt
          },
        ]);

        setSelectedSlots([]); // Xóa chọn sau khi booking
        setPhoneNumber(""); // Clear phone number after successful booking
        navigate("/booking-history");
      } else {
        alert("Booking failed: " + response.message);
      }
    } catch (error) {
      console.error("Failed to book slot:", error);
      alert("Booking error. Please try again.");
    }
  };

  useEffect(() => {
    if (field && field.id && fieldId) {
      getSubFieldsByFieldId(fieldId);
    } else {
      setSubFields([]);
    }
  }, [field, fieldId]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDate || subFields.length === 0) {
        setBookings([]);
        return;
      }

      console.log("Fetching bookings for date:", selectedDate);
      console.log(
        "SubFields:",
        subFields.map((f) => ({ id: f.id, name: f.name }))
      );

      const allBookingsPromises = subFields.map((subField) =>
        getBookings(subField.id, selectedDate).then((subFieldBookings) =>
          subFieldBookings.map((b: any) => ({
            ...b,
            field: subField.name,
            subFieldId: subField.id,
            date: selectedDate,
          }))
        )
      );

      const allSubFieldBookings = await Promise.all(allBookingsPromises);

      console.log("All subFieldBookings:", allSubFieldBookings);
      setBookings(allSubFieldBookings.flat());
    };

    fetchBookings();
  }, [selectedDate, subFields]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-[10000]">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Đặt Sân {field?.name || "ACE Pickleball Club"}
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Date Selection */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Chọn Ngày
            </h3>

            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={handlePrev}
                disabled={weekIndex === 0}
                className="p-2 rounded bg-white shadow hover:bg-gray-50 disabled:opacity-40"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="flex space-x-2 overflow-x-auto">
                {visibleDates.map((d) => (
                  <button
                    key={d.dateString}
                    onClick={() => setSelectedDate(d.dateString)}
                    className={`min-w-[70px] p-3 rounded border transition-colors ${
                      selectedDate === d.dateString
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="text-xs opacity-75">{d.month}</div>
                    <div className="text-lg font-bold">{d.day}</div>
                    <div className="text-xs">{d.weekday}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={end >= allDates.length}
                className="p-2 rounded bg-white shadow hover:bg-gray-50 disabled:opacity-40"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Chọn Khung Giờ
            </h3>

            <div className="overflow-x-auto">
              <div className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Khung Giờ
                      </th>
                      {subFields && subFields.length > 0 ? (
                        subFields.map((f) => (
                          <th
                            key={f._id}
                            className="px-4 py-3 text-center font-semibold text-gray-700"
                          >
                            {f.name}
                          </th>
                        ))
                      ) : (
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">
                          Đang tải...
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {fieldSlots && fieldSlots.length > 0 ? (
                      fieldSlots.map((t) => (
                        <tr key={t} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {t}
                          </td>
                          {subFields && subFields.length > 0 ? (
                            subFields.map((f) => {
                              const booked = isBooked(t, f.name);
                              const selected = isSelected(t, f.name);
                              return (
                                <td
                                  key={f._id}
                                  className="px-4 py-3 text-center"
                                >
                                  <button
                                    onClick={() =>
                                      toggleSlot(t, f.name, f.pricePerHour)
                                    }
                                    disabled={booked}
                                    className={`px-3 py-2 rounded font-medium transition-colors ${
                                      booked
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : selected
                                        ? "bg-blue-600 text-white"
                                        : "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                                    }`}
                                  >
                                    {booked
                                      ? "Đã Đặt"
                                      : selected
                                      ? "Đã Chọn"
                                      : "Trống"}
                                  </button>
                                </td>
                              );
                            })
                          ) : (
                            <td className="px-4 py-3 text-center text-gray-400">
                              Đang tải...
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={(subFields?.length || 0) + 1}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <svg
                              className="w-8 h-8 text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p>Đang tải khung giờ...</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Thông Tin Liên Hệ
            </h3>
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại (VD: 0987654321)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={10}
              />
              <p className="text-xs text-gray-500">
                Số điện thoại 10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09
              </p>
            </div>
          </div>

          {/* Selected Slots Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Tóm Tắt Đặt Sân
            </h3>

            {selectedSlots.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">Chưa chọn khung giờ nào</p>
                <p className="text-gray-400 text-sm">
                  Vui lòng chọn ngày và khung giờ để tiếp tục
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedSlots.map((s, idx) => {
                  const [year, month, day] = s.date.split("-").map(Number);
                  return (
                    <div key={idx} className="bg-white rounded p-3 border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
                            {day}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {s.field}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {day}/{month}/{year}
                            </p>
                            <p className="text-xs text-gray-500">{s.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">
                            {s.pricePerHour} VND
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full">
              <Gift className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Mỗi lần đặt sân bạn sẽ nhận được 1{" "}
                <span className="font-semibold text-green-600">
                  voucher 5.000&nbsp;VND
                </span>
                .
              </h3>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600"></div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={booking}
                disabled={
                  selectedSlots.length === 0 ||
                  subFields.length === 0 ||
                  !phoneNumber.trim()
                }
                className={`px-6 py-2 rounded font-medium ${
                  selectedSlots.length > 0 &&
                  subFields.length > 0 &&
                  phoneNumber.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {subFields.length === 0 ? "Đang tải..." : "Đặt Sân"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingField;
