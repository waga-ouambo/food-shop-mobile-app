import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)

// Plugins
import advancedFormat from "dayjs/plugin/advancedFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";


// Load plugins
dayjs.extend(advancedFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(calendar);

class Order {
    constructor(id, items, totalAmount, date) {
        this.id= id;
        this.items= items;
        this.totalAmount= totalAmount;
        // this.date= Date.now();
        this.date= date ;
    }

    get readableDate() {
    //        return this.date.toLocaleDateString('en-EN', {
    //       year: 'numeric',
    //       month: 'long',
    //       day: 'numeric',
    //       hour: '2-digit',
    //       minute: '2-digit'
    //   });
        return dayjs(this.date).tz('Europe/Paris').format("ddd, Do MMM YYYY, hh:mm") ;
        // return dayjs().format("dddd, D MMMM YYYY, h:mm:ss a") ;
        // return dayjs().toString();
    }
}

export default Order;