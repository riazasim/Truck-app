import readXlsxFile from 'read-excel-file';
import { Row } from 'read-excel-file/types';
import { from, Observable } from 'rxjs';
import * as ExcelJS from 'exceljs';
import {LocationModel} from 'src/app/core/models/location.model';

export const parseExcelFile = (file: File): Observable<Row[]> => {
  return from(readXlsxFile(file));
}

export const convertExcelRowToBasicLocation = (row: Row): LocationModel => {
    return <LocationModel>{
        name: `${row[0]}`,
        addrCoordinates: row[1],
        addrStreet: row[2],
        addrNumber: row[3],
        addrCity: row[4],
        addrCountry: row[5],
        addrCounty: row[6],
        addrZipCode: row[7],
        addrTimezone: `${row[8]}`,
        contactFirstName: `${row[9]}`,
        contactLastName: row[10],
        contactPhone: row[11],
        contactPhoneRegionCode: row[12],
        contactEmail: row[13],
        comments: row[14]
    }
}

export const generateBasicExcel = async (lang: string): Promise<Blob> => {
  const workbook = new ExcelJS.Workbook();
  const list = workbook.addWorksheet('basic');
  list.getColumn(1).width = 15;
  list.getColumn(2).width = 25;
  list.getColumn(3).width = 25;
  list.getColumn(4).width = 15;
  list.getColumn(5).width = 15;
  list.getColumn(6).width = 30;
  list.getColumn(7).width = 15;
  list.getColumn(8).width = 25;
  list.getColumn(8).numFmt = '@';
  list.getColumn(9).width = 15;
  list.getColumn(10).width = 16;
  list.getColumn(10).numFmt = '@';
  list.getColumn(11).width = 10;
  list.getColumn(11).numFmt = '@';
  list.getColumn(12).width = 20;
  list.getColumn(12).numFmt = '@';
  list.getColumn(13).width = 20;
  list.getColumn(14).width = 20;


  const data = [
    lang === 'en' ?
    {
      'Name': '',
      'Address Coordinates': '',
      'Address Street': '',
      'Address Number': '',
      'Address City': '',
      'Address Country': '',
      'Address County': '',
      'Address Zip Code': '',
      'Address Timezone': '',
      'Contact First Name': '',
      'Contact Last Name': '',
      'Contact Phone': '',
      'contact Phone Region Code': '',
      'Contact Email': '',
      'Comments': ''
    } : {
        'Name': '',
        'Address Coordinates': '',
        'Address Street': '',
        'Address Number': '',
        'Address City': '',
        'Address Country': '',
        'Address County': '',
        'Address Zip Code': '',
        'Address Timezone': '',
        'Contact First Name': '',
        'Contact Last Name': '',
        'Contact Phone': '',
        'contact Phone Region Code': '',
        'Contact Email': '',
        'Comments': ''
    }
  ]

  // Add headers
  const headers = Object.keys(data[0]);
  list.addRow(headers);

  // Add data
  data.forEach((item: any) => {
    const row:any = [];
    headers.forEach((header) => {
      row.push(item[header]);
    });
    list.addRow(row);
  });

  list.getCell('L2').alignment = { wrapText: true };
  list.getCell('J2').dataValidation = {
    type: 'textLength',
    operator: 'equal',
    formulae: ['10']
  }
  list.getCell('K2').dataValidation = {
    type: 'textLength',
    operator: 'equal',
    formulae: ['8']
  }

  return workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: '.xlsx' });
    return blob;
  })
}
