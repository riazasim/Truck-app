import * as XLSX from 'xlsx';

export function parseExcelToJson(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader: FileReader = new FileReader();

        reader.onload = (e: any) => {
            try {
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

                const wsname: string = wb.SheetNames[0]; // Assuming the first sheet
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                // Read the sheet as JSON (array of arrays)
                const excelData : any = XLSX.utils.sheet_to_json(ws, { header: 1 });

                // Convert Excel data to the required dynamic JSON structure
                const jsonData = transformToDynamicJSON(excelData);
                resolve(jsonData);  // Resolve the promise with the JSON data
            } catch (error) {
                reject(error);  // Reject the promise on error
            }
        };

        reader.onerror = (error) => {
            reject(error);  // Reject the promise if there's an error reading the file
        };

        reader.readAsBinaryString(file);  // Start reading the file
    });
}

function transformToDynamicJSON(excelData: any[][]) {
    // Define the initial structure
    const result: any = {
        data: {
            type: 'list',
            items: []
        }
    };

    // Loop through the Excel data rows (assuming data starts from row 2)
    excelData.slice(1).forEach((row) => {
        const shipment = {
            company: row[8],
            navigationType: row[9],
            ship: row[10],
            shipType: row[11],
            pavilion: row[12],
            enginePower: row[13],
            lengthOverall: row[14],
            width: row[15],
            maxDraft: row[16],
            maxQuantity: row[17],
            shipowner: row[18],
            purpose: row[19],
            operator: row[20],
            trafficType: row[21],
            operatonType: row[22],
            planningWaterShipmentProducts: row[23] ? row[23].split(',') : [],
            quantity: row[24],
            unitNo: row[25],
            observation: row[26],
            additionalOperator: row[27],
            clientComments: row[28],
            operatorComments: row[29],
            estimatedTimeArrival: row[30],
            departurePort: row[31],
            arrivalPort: row[32],
            operation: row[33],
            operationName: row[34]
        };

        const existingItem = result.data.items.find((item: any) => item.attributes.convoyType === row[0]);

        if (existingItem) {
            // If convoyType exists, append to the existing planningWaterShipments
            existingItem.attributes.planningWaterShipments.push(shipment);
        } else {
            // Otherwise, create a new item with a planningWaterShipments array
            const newItem = {
                type: 'planningWater',
                attributes: {
                    convoyType: row[0],
                    estimatedTimeArrival: row[1],
                    locationPort: row[2],
                    company: row[3],
                    ridCoordinates: row[4],
                    departurePort: row[5],
                    arrivalPort: row[6],
                    pilotCompany: row[7],
                    planningWaterShipments: [shipment]
                }
            };

            result.data.items.push(newItem);
        }
    });

    return result;
}
