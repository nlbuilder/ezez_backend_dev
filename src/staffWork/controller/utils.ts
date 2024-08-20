// def function to get current date in YMD format
export const getCurrentDate = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// def a function to get a start of the week
export const getCurrentWeekStart = () => {
    const date = new Date();
    const dayOfWeek = date.getDay(); // Sunday - Saturday : 0 - 6
    const distanceToMonday = (dayOfWeek + 6) % 7; // Adjust so Monday is 0
    const monday = new Date(date);
    monday.setDate(date.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0); // Set time to midnight (start of the day)
    return monday;
};

// def a function to compute total hours of work from given checkin and checkout times
export const computeTotalHours = (checkin: Date, checkout: Date) => {
    const diff = checkout.getTime() - checkin.getTime();
    return diff / (1000 * 60 * 60);
};
