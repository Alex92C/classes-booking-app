import { Injectable } from '@angular/core';

export interface IEncodedClassItem {
  date: string;
  time: string;
  classCode: string;
  instructorCode: string;
  statusCode: string;
}

export interface IEncodedBookingItem {
  date: string;
  time: string;
  statusCode: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class EncodingService {

  encodeClassItem(item: IEncodedClassItem): string {
    // convert date
    const dateParts = item.date.split('-');
    const encodedDate = dateParts[0].slice(-2) + dateParts[1] + dateParts[2];
    // convert time
    const encodedTime = item.time.replace(':', '');
    return `${encodedDate}${encodedTime}${item.classCode}${item.instructorCode}${item.statusCode}`;
  }

  decodeClassItem(customId: string): IEncodedClassItem {
    const date = customId.slice(0, 6);
    const decodedDate = '20' + date.slice(0, 2) + '-' + date.slice(2, 4) + '-' + date.slice(4, 6);

    const time = customId.slice(6, 10);
    const decodedTime = time.slice(0, 2) + ':' + time.slice(2, 4);

    return {
      date: decodedDate,
      time: decodedTime,
      classCode: customId.slice(10, 13),
      instructorCode: customId.slice(13, 16),
      statusCode: customId.slice(16, 17),
    };
  }

  encodeBookingItem(item: IEncodedBookingItem): string {
    // convert date
    const dateParts = item.date.split('-');
    const encodedDate = dateParts[0] + dateParts[1] + dateParts[2].slice(-2);
    // convert time
    const encodedTime = item.time.replace(':', '');
    return `${encodedDate}${encodedTime}${item.statusCode}?userId=${item.userId}`;
  }

  decodeBookingItem(customId: string): IEncodedBookingItem {
    const [encodedPart, userIdPart] = customId.split('?userId=');
    const date = customId.slice(0, 6);
    const decodedDate = date.slice(0, 2) + '-' + date.slice(2, 4) + '-20' + date.slice(4, 6);

    const time = customId.slice(6, 10);
    const decodedTime = time.slice(0, 2) + ':' + time.slice(2, 4);

    return {
      date: decodedDate,
      time: decodedTime,
      statusCode: customId.slice(10, 11),
      userId: userIdPart
    };
  }
}
