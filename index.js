const { PDFDocument, StandardFonts, degrees, rgb } = require("pdf-lib");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const pdfText = require("pdf-text");

const util = require("util");
const path = require("path");
const watch = require("node-watch");

let pathWrite = path.join(__dirname, "DIAGNOZE");
pathWrite = path.join(pathWrite, "testoutput.pdf");

//const file = "print_diagnoze/testinput4_widelines_2pag.pdf";
//const file = "print_diagnoze/testinput3_widelines_1pag.pdf";
const file = "print_diagnoze/testinput5_3pag.pdf";

const dirPath = path.join(__dirname, "test");

const createPdf = async (
  chunks,
  systemDataNumber,
  reportId,
  testTime,
  carTitle,
  carDescription,
  odometerReading,
  vin,
  scanner,
  sn,
  version,
  repairOrderNumber
) => {
  const pdfDoc = await PDFDocument.create();

  const timesNewRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesNewRomanBoldFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanBold
  );

  const firstPage = pdfDoc.addPage();
  const { width, height } = firstPage.getSize();

  const headerFile = "images/header.png";
  const headerImageBuffer = await fs.readFileSync(headerFile);
  const headerImage = await pdfDoc.embedPng(headerImageBuffer);

  const headerLineImageFile = "images/header_line.png";
  const headerLineImageBuffer = await fs.readFileSync(headerLineImageFile);
  const headerLineImage = await pdfDoc.embedPng(headerLineImageBuffer);

  const logoImageFile = "images/logo.png";
  const logoImageBuffer = await fs.readFileSync(logoImageFile);
  const logoImage = await pdfDoc.embedPng(logoImageBuffer);

  const footer_page1File = "images/footer_pag1.png";
  const footer_page1Buffer = await fs.readFileSync(footer_page1File);
  const footer_page1Image = await pdfDoc.embedPng(footer_page1Buffer);

  const footer_page2File = "images/footer_pag2.png";
  const footer_page2Buffer = await fs.readFileSync(footer_page2File);
  const footer_page2Image = await pdfDoc.embedPng(footer_page2Buffer);

  const footer_page3File = "images/footer_pag3.png";
  const footer_page3Buffer = await fs.readFileSync(footer_page3File);
  const footer_page3Image = await pdfDoc.embedPng(footer_page3Buffer);

  const dtcGreenIconFile = "images/dtc_green.png";
  const dtcGreenIconBuffer = await fs.readFileSync(dtcGreenIconFile);
  const dtcGreenIconImage = await pdfDoc.embedPng(dtcGreenIconBuffer);

  const disclaimerFile = "images/disclaimer.png";
  const disclaimerBuffer = await fs.readFileSync(disclaimerFile);
  const disclaimerImage = await pdfDoc.embedPng(disclaimerBuffer);

  const technician_notesFile = "images/technician_notes.png";
  const technician_notesBuffer = await fs.readFileSync(technician_notesFile);
  const technician_notesImage = await pdfDoc.embedPng(technician_notesBuffer);

  const header_notFirstPageFile = "images/not_first_page_header.png";
  const header_notFirstPageBuffer = await fs.readFileSync(
    header_notFirstPageFile
  );
  const header_notFirstPageImage = await pdfDoc.embedPng(
    header_notFirstPageBuffer
  );

  const greenCheckMarkFile = "images/checkmark0.png";
  const greenCheckMarkBuffer = await fs.readFileSync(greenCheckMarkFile);
  const greenCheckMarkImage = await pdfDoc.embedPng(greenCheckMarkBuffer);

  const greenCheckMarkFileGrey = "images/checkmark0_grey.png";
  const greenCheckMarkBufferGrey = await fs.readFileSync(
    greenCheckMarkFileGrey
  );
  const greenCheckMarkImageGrey = await pdfDoc.embedPng(
    greenCheckMarkBufferGrey
  );

  let secondPageExists = false;
  let thirdPageExists = false;

  const lineImageY = height - 287;

  console.log("System Scanned: ", systemDataNumber);
  console.log("page height: ", height);

  firstPage.drawImage(headerImage, {
    x: 14,
    y: lineImageY,
    width: width - 26,
    height: 275,
  });

  //report id
  //cancel
  firstPage.drawRectangle({
    x: width - 110,
    y: height - 35,
    width: 100,
    height: 12,
    color: rgb(1, 1, 1),
  });

  //insert
  firstPage.drawText(reportId, {
    x: width - 105,
    y: height - 32.5,
    font: timesNewRomanFont,
    size: 8,
  });
  //end report id

  //testtime id
  //cancel
  firstPage.drawRectangle({
    x: width - 92,
    y: height - 48,
    width: 100,
    height: 12,
    color: rgb(1, 1, 1),
  });

  //insert
  firstPage.drawText(testTime, {
    x: width - 90,
    y: height - 45,
    font: timesNewRomanFont,
    size: 8,
  });
  //end testtime

  //car title
  //cancel
  firstPage.drawRectangle({
    x: 0,
    y: height - 110,
    width: width,
    height: 25,
    color: rgb(1, 1, 1),
  });

  //insert
  firstPage.drawText(carTitle, {
    x: 16,
    y: height - 105,
    font: timesNewRomanBoldFont,
    size: 18,
  });
  //end car title

  //car description
  //cancel

  firstPage.drawRectangle({
    x: 0,
    y: height - 145,
    width: width / 2 - 20,
    height: 15,
    color: rgb(1, 1, 1),
  });

  //insert
  firstPage.drawText(carDescription, {
    x: 16,
    y: height - 140,
    font: timesNewRomanFont,
    size: 8,
  });

  //end car description

  //odometer
  //cancel

  firstPage.drawRectangle({
    x: width / 2 + 100,
    y: height - 145,
    width: width / 2 - 20,
    height: 15,
    color: rgb(1, 1, 1),
  });

  //insert
  firstPage.drawText(odometerReading, {
    x: width / 2 + 110,
    y: height - 142,
    font: timesNewRomanFont,
    size: 10,
  });

  //end odometer

  //vin
  //cancel

  firstPage.drawRectangle({
    x: 16 + 20,
    y: height - 159,
    width: width / 2 - 50,
    height: 15,
    color: rgb(1, 1, 1),
  });

  //insert
  firstPage.drawText(vin, {
    x: 16 + 25,
    y: height - 156,
    font: timesNewRomanFont,
    size: 10,
  });

  //end vin

  // scanner
  // cancel
  firstPage.drawRectangle({
    x: 16 + 37,
    y: height - 217,
    width: width / 2 - 50,
    height: 15,
    color: rgb(1, 1, 1),
  });

  //insert
  firstPage.drawText(scanner, {
    x: 16 + 39,
    y: height - 216,
    font: timesNewRomanFont,
    size: 10,
  });

  //end scanner

  // sn
  // cancel
  firstPage.drawRectangle({
    x: width / 2 + 85,
    y: height - 217,
    width: width / 2 - 50,
    height: 15,
    color: rgb(1, 1, 1),
  });

  console.log("sn", sn);

  //insert
  firstPage.drawText(sn, {
    x: width / 2 + 87,
    y: height - 216,
    font: timesNewRomanFont,
    size: 10,
  });

  //end sn

  // version
  // cancel
  firstPage.drawRectangle({
    x: 16 + 37,
    y: height - 237,
    width: width / 2 - 50,
    height: 15,
    color: rgb(1, 1, 1),
  });

  //insert
  firstPage.drawText(version, {
    x: 16 + 39,
    y: height - 231,
    font: timesNewRomanFont,
    size: 10,
  });

  //end version

  // repair order number
  // cancel
  firstPage.drawRectangle({
    x: width / 2 + 115,
    y: height - 237,
    width: width / 2 - 50,
    height: 15,
    color: rgb(1, 1, 1),
  });

  console.log("repair order number", repairOrderNumber);

  //insert
  firstPage.drawText(repairOrderNumber, {
    x: width / 2 + 117,
    y: height - 231,
    font: timesNewRomanFont,
    size: 8,
  });

  //end repair order number

  // system data number
  // cancel
  firstPage.drawRectangle({
    x: 16 + 19,
    y: height - 261,
    width: 300,
    height: 17,
    color: rgb(1, 1, 1),
  });

  //insert

  const systemDataNumberText = "System Scanned(" + systemDataNumber + ")";

  firstPage.drawText(systemDataNumberText, {
    x: 16 + 21,
    y: height - 257,
    font: timesNewRomanBoldFont,
    size: 15,
  });

  //end system data number

  firstPage.drawRectangle({
    x: 16,
    y: lineImageY - 20,
    width: width - 31,
    height: 0.05,
    color: rgb(0.65, 0.65, 0.65),
  });

  let i = 0;
  let itemsArray = [];
  let startInsertIntoItemsArray = false;

  while (i < chunks.length) {
    //console.log(chunks[i], "length :", chunks[i].length, "| index:", i);

    if (chunks[i].includes("Status/DTC")) {
      startInsertIntoItemsArray = true;
      i = i + 1;
    }

    if (
      chunks[i].includes("DTC ( ")
      //   chunks[i].includes("www.autel.com") ||
      //   chunks[i].includes("Test Time:") ||
      //   (chunks[i].split(" ")[0].length == 4 && !isNaN(chunks[i].split(" ")[0]))
    ) {
      startInsertIntoItemsArray = false;
    }

    if (startInsertIntoItemsArray) {
      //if (!chunks[i].includes("0") || !chunks[i].length === 1)
      if (!(chunks[i].length === 1))
        if (!(chunks[i + 1].length === 1)) {
          //if (!chunks[i + 1].includes("0")) {
          let item = chunks[i] + " " + chunks[i + 1];

          if (chunks[i + 2] && !chunks[i + 2].includes("0")) {
            item = item + " " + chunks[i + 2];
            i++;
          }

          if (item.length > 70) {
            let itemWords = item.split(" ");
            let newItem = "";
            let separator = " ";

            while (newItem.length + itemWords[0].length < 70) {
              if (newItem.length == 0) {
                separator = "";
              } else {
                separator = " ";
              }

              newItem = newItem + separator + itemWords.shift();
            }

            newItem = newItem + "\n";
            separator = "";
            let bool = true;

            while (itemWords.length != 0) {
              if (bool) {
                separator = "";
              } else {
                separator = " ";
              }

              newItem = newItem + separator + itemWords.shift();
              if (bool === true) {
                bool = false;
              }
            }

            itemsArray.push(newItem);
          } else {
            itemsArray.push(item);
          }

          i++;
        } else {
          itemsArray.push(chunks[i]);
        }
    }

    i++;
  }

  //console.log(itemsArray);

  i = 0;
  let j = 0;
  let even = false;
  let y = lineImageY; // - 0.1;
  let itemsHeight = 494;

  while (i < itemsArray.length && itemsHeight > 26) {
    let bool = false;
    if (
      carDescription.replace(/\s+/g, "") === itemsArray[i].replace(/\s+/g, "")
    ) {
      bool = true;
    }

 
    if (
      itemsArray[i + 1] &&
      itemsArray[i].split("Page 2")[1] &&
      itemsArray[i].split("Page 2")[1].includes("(") &&
      !itemsArray[i].split("Page 2").includes(")")
    ) {
      console.log(
        "itemArray: ",
        i,
        ":",
        itemsArray[i].split("Page 2")[1].includes("(") &&
          !itemsArray[i].split("Page 2").includes(")")
      );
      //am ramas aici  - genereaza eroare la linia 577
      itemsArray[i] = (itemsArray[i].split("Page 2")[1] + "\n" + itemsArray[i + 1] + "nextI ").trim();
    }

    if (
      bool ||
      itemsArray[i].includes("www.autel.com") ||
      itemsArray[i].includes("Test Time:") ||
      itemsArray[i].includes("MaxiPro") ||
      itemsArray[i].includes("MaxiPRO") ||
      itemsArray[i].includes("page") ||
      (itemsArray[i].split(" ")[0].length == 4 &&
        !isNaN(itemsArray[i].split(" ")[0]))
    ) {
    } else {
      if (even) {
        y = y - 26;
        itemsHeight = itemsHeight - 26;

        if (itemsArray[i].length > 70) {
          y = y - 10;
          itemsHeight = itemsHeight - 10;
        }

        firstPage.drawRectangle({
          x: 16,
          y: y,
          width: width - 31,
          height: 26,
          color: rgb(0.97647, 0.97254, 0.96862),
        });

        if (itemsArray[i].length > 70) {
          let itemsArrayRows = itemsArray[i].split("\n");
          //console.log(itemsArrayRows);

          firstPage.drawRectangle({
            x: 16,
            y: y,
            width: width - 31,
            height: 36,
            color: rgb(0.97647, 0.97254, 0.96862),
          });

          firstPage.drawText(itemsArrayRows[0], {
            x: 16 + 5,
            y: y + 20,
            size: 12,
            font: timesNewRomanFont,
          });

          firstPage.drawText(itemsArrayRows[1], {
            x: 16 + 5,
            y: y + 7,
            size: 12,
            font: timesNewRomanFont,
          });

          firstPage.drawImage(greenCheckMarkImageGrey, {
            x: width - 98,
            y: y + 12,
            width: 31,
            height: 19,
          });
        } else {
          firstPage.drawText(itemsArray[i], {
            x: 16 + 5,
            y: y + 10,
            size: 12,
            font: timesNewRomanFont,
          });

          firstPage.drawImage(greenCheckMarkImageGrey, {
            x: width - 98,
            y: y + 7,
            width: 31,
            height: 19,
          });
        }

        y = y - 0.1;

        firstPage.drawRectangle({
          x: 16,
          y: y,
          width: width - 31,
          height: 0.5,
          color: rgb(0.65, 0.65, 0.65),
        });

        even = !even;
      } else {
        y = y - 26;
        itemsHeight = itemsHeight - 26;

        if (itemsArray[i].length > 70) {
          y = y - 10;
          itemsHeight = itemsHeight - 10;
        }

        firstPage.drawRectangle({
          x: 16,
          y: y,
          width: width - 31,
          height: 25,
          color: rgb(1, 1, 1),
        });

        if (itemsArray[i].length > 70) {
          
          
          let itemsArrayRows = itemsArray[i].split("\n");
          //console.log(itemsArrayRows);

          if(itemsArrayRows[1].includes("nextI")) {
            itemsArrayRows[1] = itemsArrayRows[1].split("nextI")[0];
            i = i + 1;
          }

          firstPage.drawText(itemsArrayRows[0], {
            x: 16 + 5,
            y: y + 20,
            size: 12,
            font: timesNewRomanFont,
          });


          firstPage.drawText(itemsArrayRows[1], {
            x: 16 + 5,
            y: y + 7,
            size: 12,
            font: timesNewRomanFont,
          });

          firstPage.drawImage(greenCheckMarkImage, {
            x: width - 100,
            y: y + 12,
            width: 33,
            height: 15,
          });
        } else {
          firstPage.drawText(itemsArray[i], {
            x: 16 + 5,
            y: y + 10,
            size: 12,
            font: timesNewRomanFont,
          });

          firstPage.drawImage(greenCheckMarkImage, {
            x: width - 100,
            y: y + 7,
            width: 33,
            height: 15,
          });
        }

        y = y - 0.1;

        firstPage.drawRectangle({
          x: 16,
          y: y,
          width: width - 31,
          height: 0.5,
          color: rgb(0.65, 0.65, 0.65),
        });

        even = !even;
      }
    }
    i++;
  }

  firstPage.drawImage(footer_page1Image, {
    x: 16,
    y: 16,
    width: width - 31,
    height: 25,
  });

  firstPage.drawRectangle({
    x: 130,
    y: 25,
    width: 200,
    height: 12,
    color: rgb(1, 1, 1),
  });

  firstPage.drawText(scanner, {
    x: 140,
    y: 30,
    size: 8,
    font: timesNewRomanFont,
  });

  let secondPage = null;
  let thirdPage = null;

  console.log("itemsArray ", itemsArray);

  if (itemsArray.length > 15) {
    secondPage = pdfDoc.addPage();

    secondPageExists = true;

    secondPage.drawImage(header_notFirstPageImage, {
      x: 16,
      y: height - 35,
      width: width - 31,
      height: 25,
    });

    secondPage.drawRectangle({
      x: 15,
      y: height - 30,
      width: width,
      height: 10,
      color: rgb(1, 1, 1),
    });

    // "Test Time: "
    // "Report ID: "

    secondPage.drawText(carDescription, {
      x: 18,
      y: height - 28,
      font: timesNewRomanFont,
      size: 7,
    });

    secondPage.drawText("Test Time: " + testTime, {
      x: 350,
      y: height - 28,
      font: timesNewRomanFont,
      size: 7,
    });

    secondPage.drawText("Report ID: " + reportId, {
      x: 480,
      y: height - 28,
      font: timesNewRomanFont,
      size: 7,
    });

    itemsHeight = height - 32;
    y = height - 36;

    let finalBool = false;

    while (i < itemsArray.length && itemsHeight > 100) {
      let bool = true;
      let boolCD = false;

      if (itemsArray[i].includes("DTC")) {
        finalBool = true;
        console.log("finalBool", finalBool);
      }

      if (itemsArray[i].includes("Page 2")) {
        console.log("page 2", itemsArray[i].split("Page 2")[1]);
        bool = false;
        itemsArray[i] = itemsArray[i].split("Page 2")[1].trim();
      }

      if (
        carDescription.replace(/\s+/g, "") === itemsArray[i].replace(/\s+/g, "")
      ) {
        boolCD = true;
      }

      if (
        itemsArray[i].trim() === "" ||
        finalBool ||
        (bool &&
          (boolCD ||
            itemsArray[i].includes("www.autel.com") ||
            itemsArray[i].includes("Test Time:") ||
            itemsArray[i].includes("MaxiPro") ||
            itemsArray[i].includes("MaxiPRO") ||
            itemsArray[i].includes(carDescription) ||
            itemsArray[i].includes("page") ||
            itemsArray[i].trim() === "" ||
            (itemsArray[i].split(" ")[0].length == 4 &&
              !isNaN(itemsArray[i].split(" ")[0]))))
      ) {
      } else {
        bool = false;
        if (even) {
          y = y - 26;
          itemsHeight = itemsHeight - 26;

          if (itemsArray[i].length > 70) {
            y = y - 10;
            itemsHeight = itemsHeight - 10;
          }

          secondPage.drawRectangle({
            x: 16,
            y: y,
            width: width - 31,
            height: 25,
            color: rgb(0.97647, 0.97254, 0.96862),
          });

          if (itemsArray[i].length > 70) {
            secondPage.drawText(itemsArray[i], {
              x: 16 + 5,
              y: y + 20,
              size: 12,
              font: timesNewRomanFont,
            });

            secondPage.drawImage(greenCheckMarkImageGrey, {
              x: width - 98,
              y: y + 12,
              width: 31,
              height: 19,
            });
          } else {
            secondPage.drawText(itemsArray[i], {
              x: 16 + 5,
              y: y + 7,
              size: 12,
              font: timesNewRomanFont,
            });
            secondPage.drawImage(greenCheckMarkImageGrey, {
              x: width - 98,
              y: y + 5,
              width: 31,
              height: 19,
            });
          }

          y = y - 0.1;

          secondPage.drawRectangle({
            x: 16,
            y: y,
            width: width - 31,
            height: 0.5,
            color: rgb(0.65, 0.65, 0.65),
          });

          even = !even;
        } else {
          y = y - 26;
          itemsHeight = itemsHeight - 26;

          if (itemsArray[i].length > 70) {
            y = y - 10;
            itemsHeight = itemsHeight - 10;
          }

          secondPage.drawRectangle({
            x: 16,
            y: y,
            width: width - 31,
            height: 25,
            color: rgb(1, 1, 1),
          });

          if (itemsArray[i].length > 70) {
            let itemsArrayRows = itemsArray[i].split("\n");
            //console.log(itemsArrayRows);

            secondPage.drawText(itemsArrayRows[0], {
              x: 16 + 5,
              y: y + 20,
              size: 12,
              font: timesNewRomanFont,
            });

            secondPage.drawText(itemsArrayRows[1], {
              x: 16 + 5,
              y: y + 7,
              size: 12,
              font: timesNewRomanFont,
            });

            secondPage.drawImage(greenCheckMarkImage, {
              x: width - 100,
              y: y + 12,
              width: 33,
              height: 15,
            });
          } else {
            secondPage.drawText(itemsArray[i], {
              x: 16 + 5,
              y: y + 10,
              size: 12,
              font: timesNewRomanFont,
            });
            secondPage.drawImage(greenCheckMarkImage, {
              x: width - 100,
              y: y + 7,
              width: 33,
              height: 15,
            });
          }

          y = y - 0.1;

          secondPage.drawRectangle({
            x: 16,
            y: y,
            width: width - 31,
            height: 0.5,
            color: rgb(0.65, 0.65, 0.65),
          });

          even = !even;
        }
      }

      i++;
    }
    console.log("itemsHeight after page 2: ", itemsHeight);
  }

  if (itemsHeight < 200 && secondPageExists) {
    thirdPage = pdfDoc.addPage();
    thirdPageExists = true;

    thirdPage.drawImage(header_notFirstPageImage, {
      x: 16,
      y: height - 35,
      width: width - 31,
      height: 25,
    });

    thirdPage.drawRectangle({
      x: 15,
      y: height - 30,
      width: width,
      height: 10,
      color: rgb(1, 1, 1),
    });

    // "Test Time: "
    // "Report ID: "

    thirdPage.drawText(carDescription, {
      x: 18,
      y: height - 28,
      font: timesNewRomanFont,
      size: 7,
    });

    thirdPage.drawText("Test Time: " + testTime, {
      x: 350,
      y: height - 28,
      font: timesNewRomanFont,
      size: 7,
    });

    thirdPage.drawText("Report ID: " + reportId, {
      x: 480,
      y: height - 28,
      font: timesNewRomanFont,
      size: 7,
    });

    y = height - 40;

    while (i < itemsArray.length) {
      if (even) {
        y = y - 26;
        itemsHeight = itemsHeight - 26;

        if (itemsArray[i].length > 70) {
          y = y - 10;
          itemsHeight = itemsHeight - 10;
        }

        thirdPage.drawRectangle({
          x: 16,
          y: y,
          width: width - 31,
          height: 26,
          color: rgb(0.97647, 0.97254, 0.96862),
        });

        if (itemsArray[i].length > 70) {
          let itemsArrayRows = itemsArray[i].split("\n");
          //console.log(itemsArrayRows);

          thirdPage.drawRectangle({
            x: 16,
            y: y,
            width: width - 31,
            height: 36,
            color: rgb(0.97647, 0.97254, 0.96862),
          });

          thirdPage.drawText(itemsArrayRows[0], {
            x: 16 + 5,
            y: y + 20,
            size: 12,
            font: timesNewRomanFont,
          });

          thirdPage.drawText(itemsArrayRows[1], {
            x: 16 + 5,
            y: y + 7,
            size: 12,
            font: timesNewRomanFont,
          });

          thirdPage.drawImage(greenCheckMarkImageGrey, {
            x: width - 98,
            y: y + 12,
            width: 31,
            height: 19,
          });
        } else {
          thirdPage.drawText(itemsArray[i], {
            x: 16 + 5,
            y: y + 10,
            size: 12,
            font: timesNewRomanFont,
          });

          thirdPage.drawImage(greenCheckMarkImageGrey, {
            x: width - 98,
            y: y + 7,
            width: 31,
            height: 19,
          });
        }

        y = y - 0.1;

        thirdPage.drawRectangle({
          x: 16,
          y: y,
          width: width - 31,
          height: 0.5,
          color: rgb(0.65, 0.65, 0.65),
        });

        even = !even;
      } else {
        y = y - 26;
        itemsHeight = itemsHeight - 26;

        if (itemsArray[i].length > 70) {
          y = y - 10;
          itemsHeight = itemsHeight - 10;
        }

        thirdPage.drawRectangle({
          x: 16,
          y: y,
          width: width - 31,
          height: 25,
          color: rgb(1, 1, 1),
        });

        if (itemsArray[i].length > 70) {
          let itemsArrayRows = itemsArray[i].split("\n");
          //console.log(itemsArrayRows);

          thirdPage.drawText(itemsArrayRows[0], {
            x: 16 + 5,
            y: y + 20,
            size: 12,
            font: timesNewRomanFont,
          });

          thirdPage.drawText(itemsArrayRows[1], {
            x: 16 + 5,
            y: y + 7,
            size: 12,
            font: timesNewRomanFont,
          });

          thirdPage.drawImage(greenCheckMarkImage, {
            x: width - 100,
            y: y + 7,
            width: 33,
            height: 15,
          });
        } else {
          thirdPage.drawText(itemsArray[i], {
            x: 16 + 5,
            y: y + 10,
            size: 12,
            font: timesNewRomanFont,
          });

          thirdPage.drawImage(greenCheckMarkImage, {
            x: width - 100,
            y: y + 7,
            width: 33,
            height: 15,
          });
        }

        y = y - 0.1;

        thirdPage.drawRectangle({
          x: 16,
          y: y,
          width: width - 31,
          height: 0.5,
          color: rgb(0.65, 0.65, 0.65),
        });

        even = !even;
      }
      i++;
    }
  }

  y = y - 25;

  if (thirdPageExists) {
    thirdPage.drawImage(dtcGreenIconImage, {
      x: 16,
      y: y,
      width: 75,
      height: 23,
    });
  }

  if (thirdPageExists) {
    y = y - 150;
    thirdPage.drawImage(technician_notesImage, {
      x: 16,
      y: y,
      width: width - 31,
      height: 150,
    });

    thirdPage.drawImage(disclaimerImage, {
      x: 16,
      y: 42,
      width: width - 31,
      height: 20,
    });
  }

  if (secondPageExists && itemsHeight > 30 && !thirdPageExists) {
    secondPage.drawImage(dtcGreenIconImage, {
      x: 16,
      y: y,
      width: 75,
      height: 23,
    });
  }

  if (!secondPageExists) {
    firstPage.drawImage(dtcGreenIconImage, {
      x: 16,
      y: y,
      width: 75,
      height: 23,
    });
  }

  console.log("items height", itemsHeight);

  if (!secondPageExists && itemsHeight > 197) {
    y = y - 150;
    firstPage.drawImage(technician_notesImage, {
      x: 16,
      y: y,
      width: width - 31,
      height: 150,
    });
  } else if (!secondPageExists && itemsHeight < 197) {
    secondPage = pdfDoc.addPage();
    secondPageExists = true;

    itemsHeight = height;

    secondPage.drawImage(header_notFirstPageImage, {
      x: 16,
      y: height - 35,
      width: width - 31,
      height: 25,
    });

    secondPage.drawRectangle({
      x: 15,
      y: height - 30,
      width: width,
      height: 10,
      color: rgb(1, 1, 1),
    });

    // "Test Time: "
    // "Report ID: "

    secondPage.drawText(carDescription, {
      x: 18,
      y: height - 28,
      font: timesNewRomanFont,
      size: 7,
    });

    secondPage.drawText("Test Time: " + testTime, {
      x: 350,
      y: height - 28,
      font: timesNewRomanFont,
      size: 7,
    });

    secondPage.drawText("Report ID: " + reportId, {
      x: 480,
      y: height - 28,
      font: timesNewRomanFont,
      size: 7,
    });
    y = height - 25;
  }

  if (secondPageExists && !thirdPageExists && itemsHeight > 197) {
    y = y - 200;
    secondPage.drawImage(technician_notesImage, {
      x: 16,
      y: y,
      width: width - 31,
      height: 150,
    });
  } else if (secondPageExists && !thirdPageExists && itemsHeight < 197) {
    thirdPage = pdfDoc.addPage();
    thirdPageExists = true;

    itemsHeight = height;

    thirdPage.drawImage(header_notFirstPageImage, {
      x: 16,
      y: height - 35,
      width: width - 31,
      height: 25,
    });

    thirdPage.drawRectangle({
      x: 15,
      y: height - 30,
      width: width,
      height: 10,
      color: rgb(1, 1, 1),
    });

    // "Test Time: "
    // "Report ID: "

    thirdPage.drawText(carDescription, {
      x: 18,
      y: height - 28,
      font: timesNewRomanFont,
      size: 7,
    });

    thirdPage.drawText("Test Time: " + testTime, {
      x: 350,
      y: height - 28,
      font: timesNewRomanFont,
      size: 7,
    });

    thirdPage.drawText("Report ID: " + reportId, {
      x: 480,
      y: height - 28,
      font: timesNewRomanFont,
      size: 7,
    });
    y = height - 25;
  }

  if (secondPageExists) {
    secondPage.drawImage(footer_page2Image, {
      x: 16,
      y: 16,
      width: width - 31,
      height: 25,
    });

    secondPage.drawRectangle({
      x: 130,
      y: 25,
      width: 200,
      height: 12,
      color: rgb(1, 1, 1),
    });

    secondPage.drawText(scanner, {
      x: 140,
      y: 30,
      size: 8,
      font: timesNewRomanFont,
    });
  }

  if (thirdPageExists) {
    thirdPage.drawImage(footer_page3Image, {
      x: 16,
      y: 16,
      width: width - 31,
      height: 25,
    });

    thirdPage.drawRectangle({
      x: 130,
      y: 25,
      width: 200,
      height: 12,
      color: rgb(1, 1, 1),
    });

    thirdPage.drawText(scanner, {
      x: 140,
      y: 30,
      size: 8,
      font: timesNewRomanFont,
    });
  }

  if (!secondPageExists) {
    firstPage.drawImage(disclaimerImage, {
      x: 16,
      y: 42,
      width: width - 31,
      height: 20,
    });
  }

  if (secondPageExists && !thirdPageExists) {
    secondPage.drawImage(disclaimerImage, {
      x: 16,
      y: 42,
      width: width - 34,
      height: 20,
    });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFile(pathWrite, pdfBytes, () => {
    console.log("done");
  });
};

const parsePdftoText = (fileName) => {
  const pathToPdf = fileName;
  path.join(__dirname, file);
  let systemDataNumber = 0;
  let oversizedLineArray = [];

  pdfText(pathToPdf, (err, chunks) => {
    let startTableIndex = 0;
    let finishTableIndex = 0;

    console.log("chunks", chunks);

    let j = 0;

    while (j < chunks.length) {
      if (chunks[j] === "Status/DTC") {
        startTableIndex = j;
      }
      if (chunks[j].includes("DTC ( ")) {
        finishTableIndex = j;
      }
      j++;
    }

    let reportId = "";
    let testTime = "";
    let carTitle = "";
    let carDescription = "";
    let vin = "";
    let odometerReading = "";
    let scanner = "";
    let version = "";
    let sn = "";
    let repairOrderNumber = "";

    let i = 0;
    let k = 0;
    while (i < chunks.length) {
      if (chunks[i].includes("Report ID")) {
        let cols = chunks[i].split(":");
        reportId = cols[1].trim();
      }

      //console.log("reportId: ", reportId);

      if (chunks[i].includes("Test Time")) {
        let cols = chunks[i].split(":");
        testTime = cols[1].trim() + ":" + cols[2] + ":" + cols[3];
      }

      //console.log("testTime: ", testTime);

      if (
        chunks[i].includes("Vehicle Diagnostic Report") ||
        chunks[i].includes("VEHICLE DIAGNOSTIC REPORT")
      ) {
        carTitle = chunks[i];
      }

      //console.log("car title: ", carTitle);

      if (i > 0 && chunks[i - 1].includes("Vehicle Information")) {
        carDescription = chunks[i];
      }

      //console.log("car description: ", carDescription);

      if (chunks[i].includes("Odometer Reading")) {
        let cols = chunks[i].split(":");
        odometerReading = cols[1].trim();
      }

      //console.log("odometerReading: ", odometerReading);

      if (chunks[i].includes("VIN")) {
        let cols = chunks[i].split(":");
        vin = cols[1].trim();
      }

      //console.log("vin: ", vin);

      if (chunks[i].includes("Scanner")) {
        let cols = chunks[i].split(":");
        scanner = cols[1].trim();
      }

      //console.log("scanner: ", scanner);

      if (chunks[i].includes("Serial Number")) {
        let cols = chunks[i].split(":");
        sn = cols[1].trim();
      }

      if (chunks[i].includes("Version")) {
        let cols = chunks[i].split(":");
        version = cols[1].trim();
      }

      //console.log("version: ", version);

      if (i > 0 && chunks[i - 1].includes("Repair Order Number")) {
        repairOrderNumber = chunks[i].split(":")[0];
        if (chunks[i - 1].includes("--")) {
          repairOrderNumber = "--";
        }
      }

      //console.log("repair order number: ", repairOrderNumber);

      if (i > startTableIndex && i < finishTableIndex) {
        // console.log(chunks[i], "length :",chunks[i].length, "| index:", i);

        if (chunks[i].length > 1) {
          k = k + 1;
          if (i + 1 < finishTableIndex && chunks[i + 1].length !== 1) {
            oversizedLineArray.push(k);
            k = k - 1;
          }
        }
      }

      if (chunks[i].includes("System Scanned")) {
        const items = chunks[i].split("(");
        systemDataNumber = items[1].split(")")[0];
      }
      i++;
    }

    createPdf(
      chunks,
      systemDataNumber,
      reportId,
      testTime,
      carTitle,
      carDescription,
      odometerReading,
      vin,
      scanner,
      sn,
      version,
      repairOrderNumber
    );
  });
};

const watchDir = () => {
  watch(dirPath, { recursive: true }, async (evt, name) => {
    console.log(evt);
    console.log(evt === "remove");
    if (evt === "remove") {
    } else {
      parsePdftoText(name);
    }
  });
};

watchDir();
