import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import api from '../../api';
import { checkUserRole } from '../../utils/helper';
import { CONSTANTS } from '../../utils/CONSTANTS';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const api_url = import.meta.env.VITE_API_URL;
    const [hosteller, setHosteller] = useState([]);
    const hasAdmin = checkUserRole(CONSTANTS.ROLE_ADMIN);

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
    }

    useEffect(() => {
        getHostellerDetails();
    }, []);

    return (
        <div className="md:min-h-[240px] rounded-lg shadow-sm mt-4 bg-gray-50">
            <div className='border-b-2 border-red-500 min-h-[200px]'></div>
        </div>
    )
}

export default Profile
