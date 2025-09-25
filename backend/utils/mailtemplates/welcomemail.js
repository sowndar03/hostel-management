const { generatePassword, getHostelName, getRoomName } = require("../helper");

const welcomeEmail = async (hosteller) => {
    const hostelName = await getHostelName(hosteller.hostel_id);
    const roomName = await getRoomName(hosteller.room_id); // use room_id instead of room_no if needed

    return `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4F46E5; color: #fff; padding: 20px; text-align: center;">
          <h1>Welcome to Hostel Management</h1>
        </div>

        <div style="padding: 20px;">
          <p>Hi <strong>${hosteller.name}</strong>,</p>

          <p>We are excited to have you on board! Your hostel accommodation details and portal access are as follows:</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; font-weight: bold;">Hostel Name:</td>
              <td style="padding: 8px;">${hostelName}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 8px; font-weight: bold;">Room Number:</td>
              <td style="padding: 8px;">${roomName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Username:</td>
              <td style="padding: 8px;">${hosteller.name}</td>
            </tr>
          </table>

          <p>If you have any questions, feel free to contact the hostel management team.</p>

          <p style="margin-top: 30px;">Regards,<br><strong>Hostel Management Team</strong></p>
        </div>

        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          &copy; ${new Date().getFullYear()} Hostel Management. All rights reserved.
        </div>
      </div>
    `;
};

module.exports = welcomeEmail;
