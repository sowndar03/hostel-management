import React, { useContext, useEffect, useState } from 'react'
import api from '../../../api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ThemeContext } from '../../../context/ThemeContext';
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select';
import { displayDateformat, getImageUrl, getWorkingProfessional } from '../../../utils/helper';
import DatePicker from "react-datepicker";

const Edit = () => {
  const { setValue, getValues, register, reset, handleSubmit, control, formState: { errors, isSubmitting } } = useForm();
  const [hosteller, setHosteller] = useState([]);
  const [locations, setLocations] = useState([]);
  const [hostels, setHostel] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(theme === "dark");
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const { id } = useParams();
  const api_url = import.meta.env.VITE_API_URL;

  const getHostellers = async () => {
    try {
      const result = await api.get(`${api_url}/admin/master/hostellers/getHosteller/${id}`);
      setHosteller(result.data.data);
      const location_id = result.data.data.location_id._id;
      const hostel_id = result.data.data.hostel_id._id;
      const building_id = result.data.data.building_id._id;
      const room_id = result.data.data.room_id._id;
      const seat_no = result.data.data.seat_no._id;
      const name = result.data.data.name;
      const phone_no = result.data.data.phone_no;
      const dob = result.data.data.dob;
      const parent_name = result.data.data.parent_name;
      const emergency_contact_no = result.data.data.emergency_contact_no;
      const working_professional = result.data.data.working_professional;
      const working_place = result.data.data.working_place;
      const address = result.data.data.address;
      const photo = result.data.data.photo;
      const id_proof = result.data.data.id_proof;
      const advance_amount = result.data.data.advance_amount;
      const total_advance_amount = result.data.data.total_advance_amount;
      const rent = result.data.data.rent;
      setValue('location_id', location_id);
      setValue('hostel_id', hostel_id);
      setValue('building_id', building_id);
      setValue('room_id', room_id);
      setValue('seat_no', seat_no);
      setValue('name', name);
      setValue('phone_no', phone_no);
      setValue('dob', dob);
      setValue('parent_name', parent_name);
      setValue('emergency_contact_no', emergency_contact_no);
      setValue('working_professional', working_professional);
      setValue('working_place', working_place);
      setValue('id', result.data.data._id);
      setValue('address', address);
      setValue('advance_amount', advance_amount);
      setValue('total_advance_amount', total_advance_amount);
      setValue('rent', rent);
      setPreview(getImageUrl(photo));
      setIdProof(getImageUrl(id_proof));
      getAllHostels(location_id);
      getBuildings(location_id, hostel_id);
      getRooms(location_id, hostel_id, building_id);
      getAvailableSeats(room_id, seat_no);

    } catch (err) {
      console.log(err);
    }
  }

  const getallLocation = async () => {
    try {
      const res = await api.get(`${api_url}/master/location/list`);
      setLocations(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllHostels = async (location_id) => {
    try {
      const res = await api.get(`${api_url}/master/hostel/getHostel/${location_id}`);
      setHostel(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getBuildings = async (location_id, hostel_id) => {
    try {
      const res = await api.get(`${api_url}/master/building/getBuilding/${location_id}/${hostel_id}`);
      setBuildings(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getRooms = async (location_id, hostel_id, building_id) => {
    try {
      const res = await api.get(`${api_url}/master/rooms/getRooms/${location_id}/${hostel_id}/${building_id}`);
      setRooms(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAvailableSeats = async (room_id, seat_no) => {
    try {
      const res = await api.get(`${api_url}/master/rooms/availableSeats/${room_id}/${seat_no}`);
      setAvailableSeats(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleIdProof = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdProof(URL.createObjectURL(file));
    }
  }

  const working_professional = [
    { value: "1", label: "Job Seeker" },
    { value: "2", label: "Job" },
    { value: "3", label: "College" },
  ];

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (data.photo && data.photo[0]) formData.append("photo", data.photo[0]);
      if (data.id_proof && data.id_proof[0]) formData.append("id_proof", data.id_proof[0]);

      const res = await api.post(
        `${api_url}/admin/master/hostellers/updates/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data.message);
      navigate("/admin/master/hostellers/list");
    } catch (err) {
      if (err.response && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        console.error(err);
        toast.error("Something went wrong while saving");
      }
    }
  };

  const handleReset = () => {
    reset();
    setIdProof(null);
    setPreview(null);
  };

  useEffect(() => {
    getHostellers();
    getallLocation();
    setIsDark(theme === "dark");
  }, [theme]);

  return (
    <div className='min-h-screen bg-white dark:bg-[#101828]'>
      <form onSubmit={handleSubmit(onSubmit)} className='rounded shadow-lg p-6'>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white">Hostellers Add</h2>
          <button
            type="button"
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            onClick={() => navigate('/admin/master/hostellers/list')}
          >
            Back
          </button>
        </div>
        <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 mb-4 shadow-sm">
          <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
            Hostel Details
          </h6>
          <input type="hidden" name="id" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   gap-6 mb-4">
            <div className="">
              <label htmlFor="location_id" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Location <span className='text-red-500'>*</span></label>
              <Controller
                name='location_id'
                defaultValue={null}
                control={control}
                rules={{ required: "Location is required" }}
                render={({ field }) => (
                  <Select
                    options={locations.map((location) => ({
                      value: location.id,
                      label: location.name
                    }))}
                    placeholder="Select Location"
                    value={
                      locations
                        .map((loc) => ({ value: loc.id, label: loc.name }))
                        .find((option) => option.value === field.value) || null
                    }
                    onChange={(option) => {
                      field.onChange(option?.value || "");
                      if (option?.value) {
                        getAllHostels(option.value);
                      }
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: isDark ? "#1f2937" : "#fff",
                        borderColor: isDark ? "#374151" : "#d1d5db",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: isDark ? "#f9fafb" : "#111827",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: isDark ? "#111827" : "#fff",
                        color: isDark ? "#f9fafb" : "#111827",
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isFocused
                          ? (isDark ? "#374151" : "#e5e7eb")
                          : isSelected
                            ? (isDark ? "#4b5563" : "#d1d5db")
                            : "transparent",
                        color: isDark ? '#fff' : '#1f2937',
                        cursor: "pointer",
                      }),
                    }}
                  />
                )}
              />
              {errors.location_id && (
                <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.location_id.message}
                </p>
              )}
            </div>
            <div className="">
              <label htmlFor="hostel_id" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Hostel <span className='text-red-500'>*</span></label>
              <Controller
                name='hostel_id'
                defaultValue={null}
                control={control}
                rules={{ required: "Hostel is required" }}
                render={({ field }) => (
                  <Select
                    options={hostels.map((hostel) => ({
                      value: hostel.id,
                      label: hostel.hostel_name
                    }))}
                    placeholder="Select Hostel"
                    value={
                      hostels
                        .map((hostel) => ({ value: hostel.id, label: hostel.hostel_name }))
                        .find((option) => option.value === field.value) || null
                    }
                    onChange={(option) => {
                      field.onChange(option?.value || "");
                      const location_id = getValues('location_id');
                      if (option?.value) {
                        getBuildings(location_id, option.value);
                      }
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: isDark ? "#1f2937" : "#fff",
                        borderColor: isDark ? "#374151" : "#d1d5db",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: isDark ? "#f9fafb" : "#111827",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: isDark ? "#111827" : "#fff",
                        color: isDark ? "#f9fafb" : "#111827",
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isFocused
                          ? (isDark ? "#374151" : "#e5e7eb")
                          : isSelected
                            ? (isDark ? "#4b5563" : "#d1d5db")
                            : "transparent",
                        color: isDark ? '#fff' : '#1f2937',
                        cursor: "pointer",
                      }),
                    }}
                  />
                )}
              />
              {errors.hostel_id && (
                <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.hostel_id.message}
                </p>
              )}
            </div>

            <div className="">
              <label htmlFor="hostel_id" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Building <span className='text-red-500'>*</span></label>
              <Controller
                name='building_id'
                defaultValue={null}
                control={control}
                rules={{ required: "Building is required" }}
                render={({ field }) => (
                  <Select
                    options={buildings.map((building) => ({
                      value: building._id,
                      label: building.building_name
                    }))}
                    placeholder="Select Building"
                    value={
                      buildings
                        .map((building) => ({ value: building._id, label: building.building_name }))
                        .find((option) => option.value === field.value) || null
                    }
                    onChange={(option) => {
                      field.onChange(option?.value || "");
                      const location_id = getValues('location_id');
                      const hostel_id = getValues('hostel_id');
                      if (option?.value) {
                        getRooms(location_id, hostel_id, option.value);
                      }
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: isDark ? "#1f2937" : "#fff",
                        borderColor: isDark ? "#374151" : "#d1d5db",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: isDark ? "#f9fafb" : "#111827",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: isDark ? "#111827" : "#fff",
                        color: isDark ? "#f9fafb" : "#111827",
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isFocused
                          ? (isDark ? "#374151" : "#e5e7eb")
                          : isSelected
                            ? (isDark ? "#4b5563" : "#d1d5db")
                            : "transparent",
                        color: isDark ? '#fff' : '#1f2937',
                        cursor: "pointer",
                      }),
                    }}
                  />
                )}
              />
              {errors.building_id && (
                <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.building_id.message}
                </p>
              )}
            </div>
            <div className="">
              <label htmlFor="room_id" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Room No. <span className='text-red-500'>*</span></label>
              <Controller
                name='room_id'
                defaultValue={null}
                control={control}
                rules={{ required: "Room No is required" }}
                render={({ field }) => (
                  <Select
                    options={rooms.map((room) => ({
                      value: room._id,
                      label: room.room_no
                    }))}
                    placeholder="Select Room"
                    value={
                      rooms
                        .map((room) => ({ value: room._id, label: room.room_no }))
                        .find((option) => option.value === field.value) || null
                    }
                    onChange={(option) => {
                      field.onChange(option?.value || "");
                      if (option?.value) {
                        getAvailableSeats(option.value);
                      }
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: isDark ? "#1f2937" : "#fff",
                        borderColor: isDark ? "#374151" : "#d1d5db",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: isDark ? "#f9fafb" : "#111827",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: isDark ? "#111827" : "#fff",
                        color: isDark ? "#f9fafb" : "#111827",
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isFocused
                          ? (isDark ? "#374151" : "#e5e7eb")
                          : isSelected
                            ? (isDark ? "#4b5563" : "#d1d5db")
                            : "transparent",
                        color: isDark ? '#fff' : '#1f2937',
                        cursor: "pointer",
                      }),
                    }}
                  />
                )}
              />
              {errors.room_id && (
                <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.room_id.message}
                </p>
              )}
            </div>
            <div className="">
              <label htmlFor="seat_no" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Select Seat<span className='text-red-500'>*</span></label>
              <Controller
                name='seat_no'
                defaultValue={null}
                control={control}
                rules={{ required: "Seta No. is required" }}
                render={({ field }) => (
                  <Select
                    options={availableSeats.map((availablSeat) => ({
                      value: availablSeat._id,
                      label: availablSeat.seat_no
                    }))}
                    placeholder="Select Seat No."
                    value={
                      availableSeats
                        .map((availablSeat) => ({ value: availablSeat._id, label: availablSeat.seat_no }))
                        .find((option) => option.value === field.value) || null
                    }
                    onChange={(option) => field.onChange(option?.value || "")}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: isDark ? "#1f2937" : "#fff",
                        borderColor: isDark ? "#374151" : "#d1d5db",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: isDark ? "#f9fafb" : "#111827",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: isDark ? "#111827" : "#fff",
                        color: isDark ? "#f9fafb" : "#111827",
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isFocused
                          ? (isDark ? "#374151" : "#e5e7eb")
                          : isSelected
                            ? (isDark ? "#4b5563" : "#d1d5db")
                            : "transparent",
                        color: isDark ? '#fff' : '#1f2937',
                        cursor: "pointer",
                      }),
                    }}
                  />
                )}
              />
              {errors.seat_no && (
                <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.seat_no.message}
                </p>
              )}
            </div>

            <div className="">
              <label htmlFor="total_advance_amount" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Total Advance Amount<span className='text-red-500'>*</span></label>
              <input
                type="text"
                placeholder='Enter Total Advance Amount'
                className='w-full input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition' {
                ...register('total_advance_amount', {
                  required: "Total Advance Amount is Required",
                })

                } />
              {
                errors.total_advance_amount && <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.total_advance_amount.message}
                </p>
              }
            </div>
            <div className="">
              <label htmlFor="advance_amount" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Advance Amount(Paid)<span className='text-red-500'>*</span></label>
              <input
                type="text"
                placeholder='Enter Advance Amount'
                className='w-full input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition' {
                ...register('advance_amount', {
                  required: "Advance Amount is Required",
                })

                } />
              {
                errors.advance_amount && <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.advance_amount.message}
                </p>
              }
            </div>

            <div className="">
              <label htmlFor="rent" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Rent<span className='text-red-500'>*</span></label>
              <input
                type="text"
                placeholder='Enter Rent'
                className='w-full input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition' {
                ...register('rent', {
                  required: "Rent is Required",
                })

                } />
              {
                errors.rent && <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.rent.message}
                </p>
              }
            </div>


          </div>
          <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
            Personal Details
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   gap-6 mb-4">
            <div className="">
              <label htmlFor="name" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Name<span className='text-red-500'>*</span></label>
              <input
                type="text"
                placeholder='Enter Name'
                className='w-full input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition' {
                ...register('name', {
                  required: "Name is Required",
                })

                } />
              {
                errors.name && <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.name.message}
                </p>
              }
            </div>
            <div className="">
              <label htmlFor="phone_no" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Phone No.<span className='text-red-500'>*</span></label>
              <input
                type="text"
                placeholder='Enter Phone Number'
                className='w-full input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition' {
                ...register('phone_no', {
                  required: "Phone Number is Required",
                })
                } />
              {
                errors.phone_no && <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.phone_no.message}
                </p>
              }
            </div>
            <div className="">
              <label htmlFor="dob" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Date of Birth<span className='text-red-500'>*</span></label>
              <Controller
                control={control}
                name="dob"
                rules={{ required: "DOB is Required" }}
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Select your DOB"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    className="w-full input-style h-[42px] px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition"
                  />
                )}
              />
              {
                errors.dob && <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.dob.message}
                </p>
              }
            </div>
            <div className="">
              <label htmlFor="parent_name" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Parent Name<span className='text-red-500'>*</span></label>
              <input
                type="text"
                placeholder='Enter Father Name'
                className='w-full input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition' {
                ...register('parent_name', {
                  required: "Father Name is Required",
                })
                } />
              {
                errors.parent_name && <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.parent_name.message}
                </p>
              }
            </div>
            <div className="">
              <label htmlFor="emergency_contact_no" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Emergency Contact Number<span className='text-red-500'>*</span></label>
              <input
                type="text"
                placeholder='Emergency Contact Number'
                className='w-full input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition' {
                ...register('emergency_contact_no', {
                  required: "Emergency Contact Number is Required",
                })
                } />
              {
                errors.emergency_contact_no && <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.emergency_contact_no.message}
                </p>
              }
            </div>

            <div className="">
              <label
                htmlFor="working_professional"
                className="block mb-2 text-gray-700 dark:text-white font-semibold"
              >
                Working Professional<span className='text-red-500'>*</span>
              </label>
              <Controller
                name="working_professional"
                control={control}
                rules={{ required: "Working Professional is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={working_professional}
                    placeholder="Select Working Professional"
                    className="w-full"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: isDark ? "#1f2937" : "#fff",
                        borderColor: state.isFocused
                          ? "#a78bfa"
                          : isDark
                            ? "#374151"
                            : "#d1d5db",
                        boxShadow: state.isFocused
                          ? "0 0 0 2px rgba(167, 139, 250, 0.5)"
                          : "none",
                        "&:hover": { borderColor: "#a78bfa" },
                        color: isDark ? "#f9fafb" : "#111827",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: isDark ? "#f9fafb" : "#111827",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: isDark ? "#111827" : "white",
                        color: isDark ? "#f9fafb" : "black",
                        zIndex: 20,
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "#a78bfa"
                          : state.isFocused
                            ? isDark
                              ? "#374151"
                              : "#ede9fe"
                            : "transparent",
                        color: state.isSelected
                          ? "white"
                          : isDark
                            ? "#f9fafb"
                            : "#111827",
                        cursor: "pointer",
                      }),
                    }}
                    onChange={(option) => field.onChange(option?.value)}
                    value={working_professional.find((opt) => opt.value === field.value) || null}
                  />
                )}
              />

              {errors.working_professional && (
                <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.working_professional.message}
                </p>
              )}
            </div>

            <div className="">
              <label htmlFor="working_place" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Working Place/College</label>
              <input
                type="text"
                placeholder='Enter Working Place'
                className='w-full input-style  focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition'
                {
                ...register('working_place')
                }
              />
              {
                errors.working_place && <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.working_place.message}
                </p>
              }
            </div>

            <div className="">
              <label htmlFor="address" className='block mb-2 text-gray-700 dark:text-white font-semibold'>Address<span className='text-red-500'>*</span></label>
              <textarea
                placeholder="Enter Address"
                className="w-full input-style focus:outline-none focus:ring-2 focus:ring-[#f1f0ff] focus:border-[#f1f0ff] transition"
                rows={4}
                {...register('address', {
                  required: "Address is Required",
                })}
              />
              {
                errors.address && <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.address.message}
                </p>
              }
            </div>

          </div>
          <h6 className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold p-2 rounded-lg mb-3">
            Identity Verification
          </h6>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
            <div className="">
              <label
                htmlFor="photo"
                className="block mb-2 text-gray-700 dark:text-white font-semibold"
              >
                Photo <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  id="photo"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-100 file:text-indigo-700
                     hover:file:bg-indigo-200 cursor-pointer"
                  {...register("photo")}
                  onChange={handleFileChange}
                />

                {preview && (
                  <div className="w-90 h-32 border border-gray-400 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {errors.photo && (
                <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.photo.message}
                </p>
              )}
            </div>
            <div className="">
              <label
                htmlFor="id_proof"
                className="block mb-2 text-gray-700 dark:text-white font-semibold"
              >
                Government Id Proof <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  id="id_proof"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-100 file:text-indigo-700
                     hover:file:bg-indigo-200 cursor-pointer"
                  {...register("id_proof")}
                  onChange={handleIdProof}
                />

                {idProof && (
                  <div className="w-90 h-32 border border-gray-400 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={idProof}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {errors.id_proof && (
                <p className="text-red-500 text-sm mt-1 font-bold">
                  {errors.id_proof.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            type="reset"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default Edit
