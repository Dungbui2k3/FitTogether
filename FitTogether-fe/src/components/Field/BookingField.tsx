import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { subFieldService } from "../../services/subFieldsService";
import bookingService from "../../services/bookingService";

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

  const fieldId = field.id;

  const [selectedSlots, setSelectedSlots] = useState<
    { time: string; field: string; date: string }[]
  >([]);
  const [weekIndex, setWeekIndex] = useState(0);
  const [subFields, setSubFields] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

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

  const handlePrev = () => {
    if (weekIndex > 0) setWeekIndex(weekIndex - 1);
  };

  const handleNext = () => {
    if (end < allDates.length) setWeekIndex(weekIndex + 1);
  };

  const timeSlots = [
    "5:00 - 6:30",
    "6:40 - 8:10",
    "8:20 - 9:50",
    "10:00 - 11:30",
  ];

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

  const toggleSlot = (time: string, field: string) => {
    if (!selectedDate) return;
    if (isBooked(time, field)) return;

    const isSameSlot =
      selectedSlots.length > 0 &&
      selectedSlots[0].time === time &&
      selectedSlots[0].field === field &&
      selectedSlots[0].date === selectedDate;

    if (isSameSlot) {
      setSelectedSlots([]);
    } else {
      setSelectedSlots([{ time, field, date: selectedDate }]);
    }
  };

  // Lấy subFields
  const getSubFieldsByFieldId = async (fieldId: string) => {
    try {
      const response = await subFieldService.getSubFieldsByFieldId(fieldId);
      if (response.success) {
        setSubFields(response.data.data);
      } else {
        console.error("Failed to fetch sub-fields:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch sub-fields:", error);
    }
  };

  // Lấy bookings
  const getBookings = async (subFieldId: string, day: string) => {
    try {
      const response = await bookingService.getBookings(subFieldId, day);
      if (response.success) {
        console.log(
          "Bookings fetched successfully for subfield",
          subFieldId,
          day,
          ":",
          response.data
        );
        return response.data;
      } else {
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

    const selectedSlot = selectedSlots[0];

    // Tìm subFieldId dựa vào tên sân
    const subField = subFields.find((f) => f.name === selectedSlot.field);
    if (!subField) {
      alert("Cannot find sub-field for selected slot.");
      return;
    }

    console.log("Selected subField:", subField._id);

    const bookingRequest = {
      day: selectedSlot.date,
      duration: selectedSlot.time,
      totalPrice: subField.pricePerHour,
    };

    try {
      const response = await bookingService.booking(
        subField._id,
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
      } else {
        alert("Booking failed: " + response.message);
      }
    } catch (error) {
      console.error("Failed to book slot:", error);
      alert("Booking error. Please try again.");
    }
  };

  useEffect(() => {
    if (field && field.id) getSubFieldsByFieldId(fieldId);
    else setSubFields([]);
  }, [field]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDate || subFields.length === 0) {
        setBookings([]);
        return;
      }

      const allBookingsPromises = subFields.map((subField) =>
        getBookings(subField._id, selectedDate).then((subFieldBookings) =>
          subFieldBookings.map((b: any) => ({
            ...b,
            field: subField.name,
            subFieldId: subField._id,
            date: selectedDate,
          }))
        )
      );

      const allSubFieldBookings = await Promise.all(allBookingsPromises);
      setBookings(allSubFieldBookings.flat());
    };

    fetchBookings();
  }, [selectedDate, subFields]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-6 relative animate-fadeIn">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-300">
          Đặt {field?.name || "ACE Pickleball Club – Pullman Hanoi"}
        </h2>

        {/* Chọn ngày */}
        <div>
          <h3 className="font-medium mb-2">Chọn ngày đặt sân</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrev}
              disabled={weekIndex === 0}
              className="px-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            >
              &lt;
            </button>

            <div className="flex space-x-3">
              {visibleDates.map((d) => (
                <button
                  key={d.dateString}
                  onClick={() => setSelectedDate(d.dateString)}
                  className={`w-26 p-3 rounded-lg border transition ${
                    selectedDate === d.dateString
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-xs">Tháng {d.month}</div>
                  <div className="text-lg font-semibold">{d.day}</div>
                  <div className="text-sm">{d.weekday}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={end >= allDates.length}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Chọn loại sân */}
        <div className="mt-6">
          <h3 className="font-medium mb-2">Chọn loại sân</h3>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            Sân Pickleball <span className="ml-2 font-semibold">220.000 ₫</span>
          </button>
        </div>

        {/* Chọn khung giờ */}
        <div className="mt-6">
          <h3 className="font-medium mb-3">Chọn khung giờ</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-center">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 border">Khung giờ</th>
                  {subFields.map((f) => (
                    <th key={f._id} className="p-2 border font-medium">
                      {f._id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((t) => (
                  <tr key={t}>
                    <td className="p-2 border font-medium">{t}</td>
                    {subFields.map((f) => {
                      const booked = isBooked(t, f.name);
                      const selected = isSelected(t, f.name);
                      return (
                        <td key={f._id} className="p-2 border">
                          <button
                            onClick={() => toggleSlot(t, f.name)}
                            disabled={booked}
                            className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                              booked
                                ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50"
                                : selected
                                ? "bg-orange-500 text-white border-orange-500"
                                : "text-green-600 border-green-500 hover:bg-green-50"
                            }`}
                          >
                            {booked ? "Đã đặt" : selected ? "Đã chọn" : "Trống"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Danh sách đã chọn */}
        <div className="border-t pt-3 mt-4">
          <h3 className="font-medium mb-2">Đã chọn:</h3>
          {selectedSlots.length === 0 ? (
            <p className="text-gray-500">Chưa chọn khung giờ nào</p>
          ) : (
            <ul className="list-disc list-inside text-gray-700">
              {selectedSlots.map((s, idx) => {
                const [year, month, day] = s.date.split("-").map(Number);
                return (
                  <li key={idx}>
                    {day}/{month}/{year} – {s.field} – Thời gian: {s.time}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end space-x-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={booking}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
          >
            Xác nhận đặt sân
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingField;
