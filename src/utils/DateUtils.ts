import { 
    differenceInYears, 
    differenceInMonths, 
    differenceInDays, 
    differenceInHours, 
    differenceInMinutes, 
    parseISO 
} from 'date-fns';

export function ageOfRecord(value: string): string {
    const past = parseISO(value); 
    const now = new Date(); 

    // Calcula diferencias
    const years = Math.floor(differenceInYears(now, past));
    const months = Math.floor(differenceInMonths(now, past) - years * 12);
    const days = Math.floor(differenceInDays(now, past) - years * 365 - months * 30);
    const hours = Math.floor(differenceInHours(now, past));
    const minutes = Math.floor(differenceInMinutes(now, past));

    const duration: string[] = [];
    if (years >= 1) {
        duration.push(`${years} years`);
        duration.push(`${months} months`);
        duration.push(`${days} days`);
    } else if (months >= 1) {
        duration.push(`${months} months`);
        duration.push(`${days} days`);
        duration.push(`${hours % 24} hours`);
    } else if (hours >= 1) {
        duration.push(`${hours} hours`);
        duration.push(`${minutes % 60} minutes`);
    } else {
        duration.push(`${minutes} minutes`);
    }

    return duration.join(', ');
}



export function getCreatedDate(entity : any):string{
    const createdDate = entity.created_date instanceof Date 
    ? entity.created_date.toISOString() 
    : entity.created_date;

    return createdDate;
}