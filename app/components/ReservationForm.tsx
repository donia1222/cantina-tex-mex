// app/components/ReservationForm.tsx
import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_red.css";
import ConfirmationModal from "./ConfirmationModal";

interface BlockedDates {
  [date: string]: string[];
}

const ReservationForm: React.FC = () => {
  const [blockedDates, setBlockedDates] = useState<BlockedDates>({});
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para formatear la fecha a YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Función para parsear una cadena de fecha "YYYY-MM-DD" como fecha local
  const parseLocalDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Función para obtener las fechas bloqueadas
  const fetchBlockedDates = async () => {
    try {
      console.log("Fetching blocked dates...");
      const res = await fetch("https://reservierung.cantinatexmex.ch/get_blocked_dates.php");
      console.log("Response status:", res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const text = await res.text();
      console.log("Raw response text:", text);
      const data = JSON.parse(text);
      console.log("Parsed blocked dates data:", data);
      setBlockedDates(data);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching blocked dates:", error.message || error);
      setError(`Error al cargar las fechas bloqueadas: ${error.message || 'Desconocido'}`);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      console.log("Selected date changed:", selectedDate);
      const dateString = formatDate(selectedDate);
      fetchAvailableTimes(dateString);
    } else {
      console.log("No date selected.");
      setAvailableTimes([]);
    }
  }, [selectedDate]);

  const fetchAvailableTimes = async (date: string) => {
    try {
      console.log("Fetching available times for:", date);
      const day = new Date(date).getDay();

      let times: string[] = [];

      if (day === 2 || day === 3 || day === 6) { // Martes (2), Miércoles (3), Sábado (6)
        times = ["18:00", "18:30", "19:00", "19:30", "20:00"];
      } else if (day === 4 || day === 5) { // Jueves (4), Viernes (5)
        times = [
          "11:30",
          "12:00",
          "12:30",
          "13:00",
          "18:00",
          "18:30",
          "19:00",
          "19:30",
          "20:00",
        ];
      }

      const blockedTimes = blockedDates[date] || [];
      const filteredTimes = times.filter((time) => !blockedTimes.includes(time));

      console.log("Available times:", filteredTimes);
      setAvailableTimes(filteredTimes);
    } catch (error) {
      console.error("Error fetching available times:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Resetear errores anteriores
  
    console.log("Form submitted.");
    const form = e.currentTarget;
    const formData = new FormData(form);
  
    // Validar si la cantidad de personas es mayor a 14
    const personas = parseInt(formData.get("personas") as string, 10);
    if (personas >= 15) {
      alert("Ab 15 Personen bitte telefonisch reservieren: 081 750 19 11");
      return;
    }
  
    console.log("Sending reservation data to backend...");
  
    try {
      const response = await fetch(
        "https://reservierung.cantinatexmex.ch/enviar_confirmacion.php",
        {
          method: "POST",
          body: formData,
          // Asegúrate de que las credenciales estén manejadas correctamente si es necesario
          // credentials: 'include', 
        }
      );
  
      console.log("Response status:", response.status);
  
      // Verifica si la respuesta es JSON válida
      const text = await response.text();
      console.log("Raw response text:", text);
  
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        throw new Error("Respuesta del servidor no es JSON válido.");
      }
  
      console.log("Parsed backend response:", result);
  
      if (response.ok && result.success) {
        // Mostrar modal de confirmación
        const details: any = {};
        formData.forEach((value, key) => {
          details[key] = value;
        });
        setReservationDetails(details);
        setShowModal(true);
      } else {
        throw new Error(result.message || "Error al procesar la reserva.");
      }
    } catch (err) {
      console.error("Error al enviar la reserva:", err);
      setError(
        "Hubo un problema al enviar la reserva. Por favor, intenta nuevamente más tarde."
      );
    }
  };
  

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray rounded-lg shadow-md">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fecha"
                className="block text-lg font-medium text-gray-100"
              >
                Datum
              </label>
              <Flatpickr
                id="fecha"
                name="fecha"
                value={selectedDate || undefined} // Manejar null correctamente
                onChange={(dates: Date[]) => {
                  console.log("Selected date:", dates[0]);
                  setSelectedDate(dates[0] || null);
                }}
                options={{
                  dateFormat: "d.m.Y",
                  minDate: "today",
                  disable: [
                    // Deshabilitar Domingo (0) y Lunes (1)
                    (date: Date) => [0, 1].includes(date.getDay()),
                    // Deshabilitar fechas específicas desde blockedDates
                    ...Object.keys(blockedDates).map((dateStr) => parseLocalDate(dateStr))
                  ],
                  locale: {
                    firstDayOfWeek: 1,
                    weekdays: {
                      shorthand: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                      longhand: [
                        "Sonntag",
                        "Montag",
                        "Dienstag",
                        "Mittwoch",
                        "Donnerstag",
                        "Freitag",
                        "Samstag",
                      ],
                    },
                    months: {
                      shorthand: [
                        "Jan",
                        "Feb",
                        "Mär",
                        "Apr",
                        "Mai",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Okt",
                        "Nov",
                        "Dez",
                      ],
                      longhand: [
                        "Januar",
                        "Februar",
                        "März",
                        "April",
                        "Mai",
                        "Juni",
                        "Juli",
                        "August",
                        "September",
                        "Oktober",
                        "November",
                        "Dezember",
                      ],
                    },
                  },
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="TT.MM.JJJJ"
              />
            </div>

            <div>
              <label
                htmlFor="hora"
                className="block text-lg font-medium text-gray-100"
              >
                Uhrzeit
              </label>
              <select
                id="hora"
                name="hora"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Wählen Sie die Uhrzeit</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="personas"
                className="block text-lg font-medium text-gray-100"
              >
                Anzahl der Personen
              </label>
              <select
                id="personas"
                name="personas"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Wählen Sie die Anzahl der Personen</option>
                {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              {/* Mensaje para reservas de 15 o más personas */}
              <p className=" text-sm text-gray-400 text-center mt-5">
                Ab 15 Personen bitte telefonisch reservieren{" "}
                <a
                  href="tel:0817501911"
                  className="text-indigo-600 underline"
                >
                  081 750 19 11
                </a>
              </p>
            </div>

            <div>
              <label
                htmlFor="nombre"
                className="block text-lg font-medium text-gray-100"
              >
                Name
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ihr Name"
              />
            </div>

            <div>
              <label
                htmlFor="telefono"
                className="block text-lg font-medium text-gray-100"
              >
                Telefon
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ihre Telefonnummer"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-100"
              >
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ihre E-Mail-Adresse"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Reservierung bestätigen
            </button>
            
          </form>
        </>
      )}
      {showModal && reservationDetails && (
        <ConfirmationModal
          details={reservationDetails}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ReservationForm;
