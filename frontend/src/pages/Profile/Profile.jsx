import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import { checkUserRole, displayDateformat } from '../../utils/helper';
import { CONSTANTS } from '../../utils/CONSTANTS';
import cover_picture from '/cover-picture.png';
import user_png from '/user.png';
import ModalImage from "react-modal-image";
import PasswordModal from './PasswordModal';


const Profile = () => {
    const { user } = useContext(AuthContext);
    const api_url = import.meta.env.VITE_API_URL;
    const [hosteller, setHosteller] = useState([]);
    const hasAdmin = checkUserRole(CONSTANTS.ROLE_ADMIN);
    const [passwordModal, setPasswordModal] = useState(false);

    const cover_pictures = user.cover_picture
        ? `${api_url}/uploads/${user.cover_picture}`
        : cover_picture;

    const profile_picture = user.profile_picture
        ? `${api_url}/uploads/${user.profile_picture}`
        : user_png;

    const getHostellerDetails = async () => {
        const id = user._id;
        if (!hasAdmin) {
            try {
                const result = await api.get(`${api_url}/admin/master/hostellers/userId/${id}`);
                setHosteller(result.data.data);
            } catch (err) {
                console.log(err.message);
            }
        }
    };

    const handlePasswordChange = () => {
        setPasswordModal(!passwordModal)
    }
    const handleCoverPicture = () => {

    }
    const handleProfileImage = () => {

    }


    useEffect(() => {
        getHostellerDetails();
    }, []);

    const renderCard = (title, items, footer = null) => (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
            <h6 className="text-violet-600 font-semibold text-lg border-b pb-2">{title}</h6>
            {items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                    <span>{item.label}:</span>
                    <span>{item.value}</span>
                </div>
            ))}
            {footer && <div className="flex justify-between gap-3 mt-4">{footer}</div>}
        </div>
    );

    return (
        <>
            <div className="relative rounded-xl shadow-lg mt-6 bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <div className="w-full h-52 sm:h-64 md:h-72 overflow-hidden">

                    <ModalImage
                        small={cover_pictures}
                        large={cover_pictures}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />


                    <div className="absolute bottom-0 left-1/8 top-48 z-10">
                        <ModalImage
                            small={profile_picture}
                            large={profile_picture}
                            alt="Profile"
                            className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    </div>
                </div>

                <div className="mt-20 md:mt-18 px-6 pb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6">
                        {renderCard(
                            'Personal Details',
                            [
                                { label: 'Name', value: hosteller.name },
                                { label: 'Email', value: hosteller.email },
                                { label: 'Phone No', value: hosteller.phone_no },
                                { label: 'Address', value: hosteller.address },
                                { label: 'Date of Birth', value: displayDateformat(hosteller.dob) },
                            ],
                            <>
                                <button onClick={handleProfileImage} className="font-bold px-4 py-2 bg-violet-500 text-white rounded">
                                    Edit Profile Image
                                </button>
                                <button onClick={handleCoverPicture} className="font-bold px-4 py-2 bg-indigo-500 text-white rounded">
                                    Edit Cover Picture
                                </button>
                                <button onClick={handlePasswordChange} className="font-bold px-4 py-2 bg-green-500 text-white rounded">
                                    Change Password
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 h-full md:my-6">
                        <div className="flex-1">
                            {renderCard('Hostel Details', [
                                { label: 'Location', value: hosteller.location_id?.location_name },
                                { label: 'Hostel', value: hosteller.hostel_id?.hostel_name },
                                { label: 'Room No', value: hosteller.room_id?.room_no },
                            ])}
                        </div>
                        <div className="flex-1">
                            {renderCard('Family Details', [
                                { label: 'Parent Name', value: hosteller.parent_name },
                                { label: 'Emergency Contact', value: hosteller.emergency_contact_no },
                            ])}
                        </div>
                    </div>

                </div>
            </div>
            {passwordModal && (
                <PasswordModal close={() => setPasswordModal(false)} />
            )}

        </>

    );
};

export default Profile;
