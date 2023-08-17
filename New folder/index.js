const { PDFDocument, StandardFonts, degrees, rgb } = require("pdf-lib");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const pdfText = require("pdf-text");

const util = require("util");
const path = require("path");


const file = "print_diagnoze/testinput3_widelines_1pag.pdf";

const parsePdftoText = () => {

  const pathToPdf = path.join(__dirname, file);
  let systemDataNumber = 0
  let oversizedLineArray = [];

  pdfText(pathToPdf, (err, chunks) => {
    
    let startTableIndex = 0;
    let finishTableIndex = 0;

    let j = 0;

    while(j<chunks.length) {
      if(chunks[j] === "Status/DTC") {
        startTableIndex = j;
      }
      if(chunks[j].includes("DTC ( ")) {
        finishTableIndex = j;
      }
      j++;
    }


    let i = 0;
    let k = 0;
    while(i<chunks.length) {
      if(i > startTableIndex && i < finishTableIndex) {
        // console.log(chunks[i], "length :",chunks[i].length, "| index:", i);

        if(chunks[i].length > 1) {
          k = k + 1;
          if(i+1 < finishTableIndex && chunks[i+1].length !== 1) {
            oversizedLineArray.push(k);
            k = k - 1;
          }
          
        }
      }

      if(chunks[i].includes('System Scanned')) {
        const items = chunks[i].split("(");
        systemDataNumber = items[1].split(")")[0];
       
      }
      i++;
    }

    modifyPdf(systemDataNumber, oversizedLineArray);
  });

  

  if(systemDataNumber !==0) {
    console.log(systemDataNumber)
   
  }

  return systemDataNumber;
};



const modifyPdf = async (rowNumber, oversizedLineArray) => {

  console.log(rowNumber);

  let pathWrite = path.join(__dirname, "DIAGNOZE");
  pathWrite = path.join(pathWrite, "testoutput.pdf");
  
  const okImageFile = "images/checkmark.png";

  const systemScannedIconFile = "images/system_scanned_icon.png";
  const dtcGreenFile = "images/dtc_green.png";
  const footerFile = "images/footer.png";
  const technicianNotesFile = "images/technician_notes.jpg";

  const okImageBuffer = await fs.readFileSync(okImageFile);

  const systemScannedIconBuffer = await fs.readFileSync(systemScannedIconFile);
  const dtcGreenIconBuffer = await fs.readFileSync(dtcGreenFile);
  const footerBuffer = await fs.readFileSync(footerFile);
  const technicianNotesBuffer = await fs.readFileSync(technicianNotesFile);



  /// read pdf file
 

  const dataBuffer = await fs.readFileSync(file);

  const data = await pdfParse(dataBuffer);

  //console.log(data);

  /// END - read pdf file //////////////////////////////////

  const pdfDoc = await PDFDocument.load(dataBuffer);
  const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  
  let secondPage = null;

  if(pages.length > 1) {
    secondPage = pages[1];
  }
  

  const { width, height } = firstPage.getSize();


  const okImage = await pdfDoc.embedPng(okImageBuffer);

  const systemScannedIcon = await pdfDoc.embedPng(systemScannedIconBuffer);
  
  firstPage.drawImage(systemScannedIcon, {
    x: 16,
    y: 584,
    width: 16.5,
    height: 16.5,
    font: timesNewRoman,
  });
  
  const dtcGreenIcon = await pdfDoc.embedPng(dtcGreenIconBuffer);
  const footer = await pdfDoc.embedPng(footerBuffer);

  if(rowNumber <= 17) {
    const { width, height } = firstPage.getSize();
    const dtc_green_y =  height - (rowNumber) * 28 - 450 -oversizedLineArray.length * 8; // page offset for green icon = 250



    firstPage.drawImage(footer, {
      x: 14,
      y: dtc_green_y,
      width: 562,
      height: 162
    })

    // firstPage.drawImage(dtcGreenIcon, {
    //   x: 15,
    //   y: dtc_green_y,
    //   width: 18,
    //   height: 18,
    //   font: timesNewRoman,
    // });

    // firstPage.drawRectangle( {
    //   x: 75,
    //   y: dtc_green_y,
    //   width: 13,
    //   height: 18,
    //   color: rgb(1, 1, 1),
    //   font: timesNewRoman,
    // });

    // firstPage.drawText("0", {
    //   x: 77,
    //   y: dtc_green_y + 1,
    //   size: 16,
    //   font: timesNewRoman,
    // })
  } else  if (rowNumber> 17 && secondPage !== null) {
    const { width, height } = secondPage.getSize();
    const dtc_green_y =  height - (rowNumber - 17) * 28 - 180; // page offset = 36

    secondPage.drawImage(footer, {
      x: 14,
      y: dtc_green_y,
      width: 566,
      height: 162
    });

    secondPage.drawRectangle({
      x: 14,
      y: 50,
      width: 566,
      color: rgb(1, 1, 1),
      height: dtc_green_y - 50
    });

    // secondPage.drawImage(dtcGreenIcon, {
    //   x: 15,
    //   y: dtc_green_y,
    //   width: 18,
    //   height: 18,
    //   font: timesNewRoman,
    // });

    // secondPage.drawRectangle( {
    //   x: 75,
    //   y: dtc_green_y,
    //   width: 13,
    //   height: 18,
    //   color: rgb(1, 1, 1),
    //   font: timesNewRoman,
    // });

    // secondPage.drawText("0", {
    //   x: 77,
    //   y: dtc_green_y + 1,
    //   size: 16,
    //   font: timesNewRoman,
    // })
  }
 

  const technicianNotes = await pdfDoc.embedJpg(technicianNotesBuffer);

  console.log(height, width);

  // // line 1

  // firstPage.drawRectangle({
  //   x: 400,
  //   y: 526,
  //   width: 100,
  //   height: 15,
  //   color: rgb(1, 1, 1),
  // });

  // firstPage.drawText("Pass | No fault", {
  //   x: 410,
  //   y: 529,
  //   size: 10,
  //   font: timesNewRoman,
  // });

  // /// end line 1

  // // line 2 // - 20px on y axis

  // firstPage.drawRectangle({
  //   x: 400,
  //   y: 506,
  //   width: 100,
  //   height: 15,
  //   color: rgb(0.97647, 0.97254, 0.96862), // for pare lines color is light grey
  // });

  // firstPage.drawText("Pass | No fault", {
  //   x: 410,
  //   y: 509,
  //   size: 10,
  //   font: timesNewRoman,
  // });

  // //// end line 2

  // // line 3 // - 20px on y axis

  // firstPage.drawRectangle({
  //   x: 400,
  //   y: 486,
  //   width: 100,
  //   height: 15,
  //   color: rgb(1, 1, 1),
  // });

  // firstPage.drawText("Pass | No fault", {
  //   x: 410,
  //   y: 489,
  //   size: 10,
  //   font: timesNewRoman,
  // });

  // //// end line 3

  let x = 483;
  let y = 536;
  let even = false;
  let color = rgb(1, 1, 1);

  let x_second = 483;
  let y_second = 776;

  for (let i = 0; i < rowNumber; i++) {
    if (even) {
      color = rgb(0.97647, 0.97254, 0.96862);
    } else {
      color = rgb(1, 1, 1);
    }
    
    if(i < 17) {
      console.log(i+1, oversizedLineArray.includes(i + 1));
      

      firstPage.drawRectangle({
        x: x,
        y: y,
        width: 100,
        height: 15,
        color: color,
      });

      firstPage.drawImage(okImage, {
        x: x + 10,
        y: y + 3,
        width: 12,
        height: 12,
        font: timesNewRoman,
      });

      firstPage.drawText("0", {
        x: x + 30,
        y: y + 5,
        size: 12,
        font: timesNewRoman,
      })
    } else if( i > 17 && secondPage !== undefined ) {

      secondPage.drawRectangle({
        x: x_second,
        y: y_second,
        width: 100,
        height: 15,
        color: color,
      });

      secondPage.drawImage(okImage, {
        x: x_second + 10,
        y: y_second + 3,
        width: 12,
        height: 12,
        font: timesNewRoman,
      });

      secondPage.drawText("0", {
        x: x_second + 30,
        y: y_second + 5,
        size: 12,
        font: timesNewRoman,
      })

      if(oversizedLineArray.includes(i+2) && !oversizedLineArray.includes(i+1) ) {
        y_second = y_second - 35;
        //console.log(i+2, "not i+1", 35 );
      }  
      if(oversizedLineArray.includes(i+1) && oversizedLineArray.includes(i+2)) {
        y_second = y_second - 39;
        //console.log(i+1, i+2, 39);
      }
      if(oversizedLineArray.includes(i+1) && !oversizedLineArray.includes(i+2)) {
        y_second = y_second - 34;
        //console.log(i+1, i+2, 34);
      }
  
      if(!oversizedLineArray.includes(i+2) && !oversizedLineArray.includes(i+1)) {
        y_second = y_second - 28;
        //console.log("not i+2", 28);
      } 

      //y_second = y_second - 28;

    }
    even = !even;
    if(oversizedLineArray.includes(i+2) && !oversizedLineArray.includes(i+1) ) {
      y = y - 35;
      //console.log(i+2, "not i+1", 35 );
    }  
    if(oversizedLineArray.includes(i+1) && oversizedLineArray.includes(i+2)) {
      y = y - 39;
      //console.log(i+1, i+2, 39);
    }
    if(oversizedLineArray.includes(i+1) && !oversizedLineArray.includes(i+2)) {
      y = y - 34;
      //console.log(i+1, i+2, 34);
    }

    if(!oversizedLineArray.includes(i+2) && !oversizedLineArray.includes(i+1)) {
      y = y - 28;
      //console.log("not i+2", 28);
    } 
 
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFile(pathWrite, pdfBytes, () => {
    console.log("done");
  });
};

const splitPdf = async () => {
  const file = "202352518657.pdf";

  const dataBuffer = await fs.readFileSync(file);

  const readPdf = await PDFDocument.load(dataBuffer);
  const { length } = readPdf.getPages();

  for (let i = 0; i < length; i++) {
    let pathWrite = path.join(__dirname, "DIAGNOZE");
    const writePdf = await PDFDocument.create();
    const [page] = await writePdf.copyPages(readPdf, [i]);
    writePdf.addPage(page);
    const pdfBytes = await writePdf.save();
    pathWrite = path.join(pathWrite, `page_${i + 1}.pdf`);
    await fs.promises.writeFile(pathWrite, pdfBytes);
    console.log(`Added ${pathWrite}`);
  }
};

//splitPdf();


//modifyPdf();

parsePdftoText();
