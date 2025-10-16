import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import { checkUserRole, displayDateformat, getImageUrl } from '../../utils/helper';
import { CONSTANTS } from '../../utils/CONSTANTS';
import cover_picture from '/cover-picture.png';
import user_png from '/user.png';
import ModalImage from "react-modal-image";
import PasswordModal from './PasswordModal';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const api_url = import.meta.env.VITE_API_URL;
    const [hosteller, setHosteller] = useState({});
    const hasAdmin = checkUserRole(CONSTANTS.ROLE_ADMIN);
    const [passwordModal, setPasswordModal] = useState(false);
    const [users, setUsers] = useState(user);

    const cover_pictures = users.cover_image ? getImageUrl(users.cover_image) : cover_picture;
    const profile_picture = users.profile_picture ? getImageUrl(users.profile_picture) : user_png;

    // Fetch hosteller details
    const getHostellerDetails = async () => {
        if (!hasAdmin) {
            try {
                const id = user._id;
                const result = await api.get(`${api_url}/admin/master/hostellers/userId/${id}`);
                setHosteller(result.data.data);
            } catch (err) {
                console.error(err.message);
            }
        }
    };

    useEffect(() => {
        getHostellerDetails();
    }, []);

    const handlePasswordChange = () => setPasswordModal(!passwordModal);
    const handleCoverPicture = () => document.getElementById('coverFileInput').click();
    const handleProfileImage = () => document.getElementById('profileInput').click();

    const handleProfileUpload = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('profile_picture', file);
            const result = await api.post(`${api_url}/login/profileImageUpload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const updatedProfile = result.data.data.profile_picture;
            setUsers(prev => ({ ...prev, profile_picture: updatedProfile }));
            setUser(prev => ({ ...prev, profile_picture: updatedProfile }));
            toast.success('Profile Image Updated Successfully');
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile image");
        }
    };

    const handleCoverUpload = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('cover_image', file);
            const result = await api.post(`${api_url}/login/coverImageUplaod`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const updatedCover = result.data.data.cover_image;
            setUsers(prev => ({ ...prev, cover_image: updatedCover }));
            setUser(prev => ({ ...prev, cover_image: updatedCover }));
            toast.success('Cover Image Updated Successfully');
        } catch (err) {
            console.error(err);
            toast.error("Failed to update cover image");
        }
    };

    const renderCard = (title, data, footer = null) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col gap-2 w-full">
            <h6 className="text-violet-600 font-semibold text-lg border-b pb-2">{title}</h6>
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                    <span className="capitalize">{key.replace('_', ' ')}:</span>
                    <span>{value || 'N/A'}</span>
                </div>
            ))}
            {footer && <div className="flex flex-wrap gap-2 mt-4">{footer}</div>}
        </div>
    );
    return (
        <>
            <div className="relative rounded-xl shadow-lg mt-6 bg-gray-50 dark:bg-gray-900 overflow-hidden min-h-screen">

                <div className="w-full h-52 sm:h-64 md:h-72 overflow-hidden">
                    <ModalImage
                        small={cover_pictures}
                        large={cover_pictures}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute left-1/8 md:top-48 z-10">
                        <ModalImage
                            small={profile_picture}
                            large={profile_picture}
                            alt="Profile"
                            className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    </div>
                </div>

                <div className="md:mt-24 px-4 sm:px-6 pb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                    <div className="flex flex-col gap-4">
                        {renderCard(
                            'Personal Details',
                            !hasAdmin
                                ? {
                                    Name: hosteller.name,
                                    Email: hosteller.email,
                                    Phone: hosteller.phone_no,
                                    Address: hosteller.address,
                                    'Date of Birth': displayDateformat(hosteller.dob),
                                }
                                : {
                                    Name: user.name,
                                    Email: user.email,
                                },
                            <>
                                <button
                                    onClick={handleProfileImage}
                                    className="font-bold px-4 py-2 bg-violet-500 text-white rounded"
                                >
                                    Edit Profile Image
                                </button>
                                <button
                                    onClick={handleCoverPicture}
                                    className="font-bold px-4 py-2 bg-indigo-500 text-white rounded"
                                >
                                    Edit Cover Picture
                                </button>
                                <button
                                    onClick={handlePasswordChange}
                                    className="font-bold px-4 py-2 bg-green-500 text-white rounded"
                                >
                                    Change Password
                                </button>

                                <input
                                    type="file"
                                    id="profileInput"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleProfileUpload}
                                />

                                <input
                                    type="file"
                                    id="coverFileInput"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleCoverUpload}
                                />
                            </>
                        )}
                    </div>

                    {/* Hostel & Family Details */}
                    <div className="flex flex-col gap-4">
                        {!hasAdmin ? (
                            <>
                                {renderCard('Hostel Details', {
                                    Location: hosteller.location_id?.location_name,
                                    Hostel: hosteller.hostel_id?.hostel_name,
                                    'Room No': hosteller.room_id?.room_no,
                                })}
                                {renderCard('Family Details', {
                                    'Parent Name': hosteller.parent_name,
                                    'Emergency Contact': hosteller.emergency_contact_no,
                                })}
                            </>
                        ) : (
                            <>
                                {renderCard('Hostel Details', { Info: 'No Hostel Detail' })}
                                {renderCard('Family Details', { Info: 'No Family Details' })}
                            </>
                        )}
                    </div>
                </div>
            </div >

            {passwordModal && (
                <PasswordModal close={() => setPasswordModal(false)} />
            )
            }
        </>
    );
};

export default Profile;
