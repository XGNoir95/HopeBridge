import axios from "axios";
import { useEffect, useState } from "react";

export default function ReportIncident() {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axios.get(
          "https://bdapis.com/api/v1.2/divisions"
        );
        setDivisions(response.data.data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };

    fetchDivisions();
  }, []);

  const fetchDistricts = async (division) => {
    const disticts = await axios.get(
      `https://bdapis.com/api/v1.2/division/${division}`
    );
    const districtNames = disticts.data.data.map((item) => item.district);
    setDistricts(districtNames);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10); // Limit to 10 files
    setSelectedFiles(files);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[550px] max-w-[550px] py-5 max-w-[960px] flex-1">
            {/* Title */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="tracking-light text-[32px] font-bold leading-tight min-w-72 text-gray-900">
                Report an Incident
              </p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col">
              {/* Title */}
              <h3 className="text-lg font-bold px-4 pb-2 pt-4">Title</h3>
              <div className="px-4 py-3">
                <input
                  placeholder="Title"
                  className="form-input w-full rounded-xl bg-gray-100 h-14 p-[15px] text-base"
                />
              </div>

              {/* Description */}
              <h3 className="text-lg font-bold px-4 pb-2 pt-4">Description</h3>
              <div className="px-4 py-3">
                <textarea
                  placeholder="The description of the incident"
                  className="form-input w-full resize-none rounded-xl bg-gray-100 p-[15px] text-base min-h-36"
                ></textarea>
              </div>

              {/* Location */}
              <h3 className="text-lg font-bold px-4 pb-2 pt-4">Location</h3>
              <div className="flex px-4 py-3 gap-4">
                <select
                  className="form-input flex-1 rounded-lg bg-gray-100 h-14 p-[15px] text-base"
                  value={selectedDivision}
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                    setSelectedDistrict("");
                    fetchDistricts(e.target.value);
                  }}
                >
                  <option value="">Select Division</option>
                  {divisions.map((division, index) => (
                    <option key={index} value={division.division}>
                      {division.division}
                    </option>
                  ))}
                </select>

                <select
                  className="form-input flex-1 rounded-xl bg-gray-100 h-14 p-[15px] text-base"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedDivision}
                >
                  <option value="">Select District</option>
                  {selectedDivision &&
                    districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                </select>
              </div>

              {/* Date and Time */}
              <h3 className="text-lg font-bold px-4 pb-2 pt-4">Date and Time</h3>
              <div className="flex px-4 py-3 gap-4">
                <input
                  type="date"
                  className="form-input flex-1 rounded-xl bg-gray-100 h-14 p-[15px] text-base"
                />
                <input
                  type="time"
                  className="form-input flex-1 rounded-xl bg-gray-100 h-14 p-[15px] text-base"
                />
              </div>
            </div>

            {/* Upload Evidence Section */}
            <h3 className="text-lg font-bold px-4 pb-2 pt-4 text-gray-900">
              Upload Evidence
            </h3>
            <p className="text-base text-gray-600 pb-3 px-4">
              Upload videos, photos, or audio files. (Max 10 files)
            </p>

            {/* Styled Upload Box */}
            <div className="px-4 py-3 flex justify-center">
              <label className="w-full cursor-pointer">
                <div className="border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-blue-600 font-medium">
                    Drag & Drop or Click to Upload
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*, video/*, audio/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </label>
            </div>

            {/* Preview Selected Images */}
            <div className="px-4 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="w-28 h-28 border rounded-lg p-1 bg-white shadow-md">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex px-4 py-5 justify-center">
              <button className="text-white flex w-[220px] h-14 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-lg font-bold hover:scale-105 transition-all">
                <span className="truncate">Submit Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
