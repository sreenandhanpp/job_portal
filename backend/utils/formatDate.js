function formatDateWithoutTimezone() {
    let date = new Date();
    // Check if the input is a valid Date object
    if (!(date instanceof Date) || isNaN(date)) {
      return null; // Return null if the input is not a valid Date
    }
  
    // Extract the year, month, and day components
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    
    console.log(`${year}/${month}/${day}`)
    return `${year}/${month}/${day}`;
  }

module.exports = formatDateWithoutTimezone;