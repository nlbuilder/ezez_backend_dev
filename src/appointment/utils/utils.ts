import { ITime } from "../types/typeAppointmentInfo";

// function to round time into the hour and minute format
export function roundTime0(timeString: string): ITime {
    // Parse the time part of the string (ignore the GMT offset for now)
    const [timePart] = timeString.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid time format");
    }

    // If minutes are less than 45, round to the previous hour
    if (minutes < 45) {
        return {
            hours: hours, // Keep the same hour
            minutes: 0, // Set minutes to 0
        };
    }
    // If minutes are 45 or more, round to the next hour
    else {
        return {
            hours: (hours + 1) % 24, // Increment the hour, ensuring it stays within 24 hours
            minutes: 0, // Set minutes to 0
        };
    }
}

// function to round time based on minutes and return it as a string in HH:MM:SS format
export function roundTime1(timeString: string): string {
    // Parse the time part of the string (ignore the GMT offset for now)
    const [timePart] = timeString.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid time format");
    }

    let roundedHours = hours;
    let roundedMinutes = 0;

    // If minutes are 45 or more, round to the next hour
    if (minutes >= 45) {
        roundedHours = (hours + 1) % 24; // Increment the hour and ensure it stays within 24 hours
    }

    // Format the rounded hours and minutes as a string in HH:MM:SS
    const formattedHours = String(roundedHours).padStart(2, "0"); // Ensures two-digit format
    const formattedMinutes = String(roundedMinutes).padStart(2, "0"); // Always 00 after rounding
    const formattedSeconds = "00"; // Set seconds to 00

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
