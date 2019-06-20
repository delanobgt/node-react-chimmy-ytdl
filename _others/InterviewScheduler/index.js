function printTitle(s) {
  console.log(s);
  console.log("-".repeat(s.length));
}

function defeatZero(i) {
  if (i === 0) return "-";
  else return i;
}

(async () => {
  const _ = require("lodash");
  const Excel = require("exceljs");
  const util = require("util");
  const fs = require("fs");
  const writeFile = util.promisify(fs.writeFile);
  const readFile = util.promisify(fs.readFile);
  const moment = require("moment");

  // const workbook = new Excel.Workbook();
  // await workbook.xlsx.readFile(
  //   String.raw`C:\Users\ASUS\Downloads\Data Pendaftar HMPSSI & HMPTIF.xlsx`
  // );
  // const worksheet = _.head(workbook.worksheets);
  // const { rowCount } = worksheet;
  // const gridValues = [];
  // for (let i = 1; i <= rowCount; i += 3) {
  //   const values1 = worksheet.getRow(i).values;
  //   const values2 = worksheet.getRow(i + 1).values;
  //   const values3 = worksheet.getRow(i + 2).values;
  //   gridValues.push({
  //     nim: values1[2],
  //     name: values1[3],
  //     classGroup: values1[4],
  //     lineId: values1[5],
  //     positions: _.chain([values1[6], values2[6], values3[6]])
  //       .compact()
  //       .uniq()
  //       .value()
  //   });
  // }

  // const stringified = JSON.stringify(gridValues, 2, 2);
  // await writeFile("candidates.txt", stringified);

  // console.log(stringified);
  // console.log(gridValues.length);

  const content = (await readFile("_candidates.txt")).toString();

  const students = JSON.parse(content);
  // console.log(students);

  const categories = [
    "programming",
    "internal",
    "external",
    "design",
    "president",
    "sekretaris",
    "bph"
  ];
  const studentsByCategory = _.chain(categories)
    .mapKeys(v => v)
    .mapValues(cat =>
      _.chain(students)
        .filter(std =>
          std.positions
            .join(";")
            .toLowerCase()
            .includes(cat)
        )
        .value()
    )
    .value();

  {
    console.log("There are", students.length, "students in total");
    const counts = _.groupBy(students, std => std.classGroup.slice(2));
    const it1 = `(${defeatZero((counts["TI1"] || []).length)})`;
    const it2 = `(${defeatZero((counts["TI2"] || []).length)})`;
    const it3 = `(${defeatZero((counts["TI3"] || []).length)})`;
    const is1 = `(${defeatZero((counts["SI1"] || []).length)})`;
    console.log("18TI1", ":", it1);
    console.log("18TI2", ":", it2);
    console.log("18TI3", ":", it3);
    console.log("18SI1", ":", is1);
    console.log();
  }

  {
    printTitle(
      "Number of Candidates per Department (1 student might appear in more than 1 department)"
    );
    for (let cat of categories) {
      const counts = _.groupBy(studentsByCategory[cat], std =>
        std.classGroup.slice(2)
      );
      const it1 = `TI1 (${defeatZero((counts["TI1"] || []).length)})`;
      const it2 = `TI2 (${defeatZero((counts["TI2"] || []).length)})`;
      const it3 = `TI3 (${defeatZero((counts["TI3"] || []).length)})`;
      const is1 = `SI1 (${defeatZero((counts["SI1"] || []).length)})`;
      console.log(
        _.startCase(cat).padEnd(25, " "),
        ":",
        (studentsByCategory[cat].length + "").padEnd(5, " "),
        "->",
        it1.padEnd(8, " "),
        it2.padEnd(8, " "),
        it3.padEnd(8, " "),
        is1.padEnd(8, " ")
      );
    }
    console.log();
  }

  {
    let total1Dept = 0;
    printTitle("Number of Candidates with 1 Department Only");
    for (let i = 0; i < categories.length; i++) {
      const jointStudents = _.chain(students)
        .filter(std => {
          const myCat = std.positions.join(";").toLowerCase();
          return std.positions.length === 1 && myCat.includes(categories[i]);
        })
        .value();

      total1Dept += jointStudents.length;
      if (jointStudents.length === 0) continue;

      const counts = _.groupBy(jointStudents, std => std.classGroup.slice(2));
      const it1 = `TI1 (${defeatZero((counts["TI1"] || []).length)})`;
      const it2 = `TI2 (${defeatZero((counts["TI2"] || []).length)})`;
      const it3 = `TI3 (${defeatZero((counts["TI3"] || []).length)})`;
      const is1 = `SI1 (${defeatZero((counts["SI1"] || []).length)})`;
      console.log(
        _.startCase(categories[i]).padEnd(25, " "),
        ":",
        (jointStudents.length + "").padEnd(5, " "),
        "->",
        it1.padEnd(8, " "),
        it2.padEnd(8, " "),
        it3.padEnd(8, " "),
        is1.padEnd(8, " ")
      );
    }
    console.log("Total".padEnd(25, " "), ":", total1Dept);
    console.log();
  }

  {
    printTitle("Number of Candidates with 2 Departments");
    let total2Dept = 0;
    for (let i = 0; i < categories.length; i++) {
      for (let j = i + 1; j < categories.length; j++) {
        const jointStudents = _.chain(students)
          .filter(std => {
            const myCat = std.positions.join(";").toLowerCase();
            return (
              myCat.includes(categories[i]) && myCat.includes(categories[j])
            );
          })
          .value();

        if (jointStudents.length === 0) continue;

        total2Dept += jointStudents.length;
        const counts = _.groupBy(jointStudents, std => std.classGroup.slice(2));
        const it1 = `TI1 (${defeatZero((counts["TI1"] || []).length)})`;
        const it2 = `TI2 (${defeatZero((counts["TI2"] || []).length)})`;
        const it3 = `TI3 (${defeatZero((counts["TI3"] || []).length)})`;
        const is1 = `SI1 (${defeatZero((counts["SI1"] || []).length)})`;
        console.log(
          (
            _.startCase(categories[i]) +
            " & " +
            _.startCase(categories[j])
          ).padEnd(25, " "),
          ":",
          (jointStudents.length + "").padEnd(5, " "),
          "->",
          it1.padEnd(8, " "),
          it2.padEnd(8, " "),
          it3.padEnd(8, " "),
          is1.padEnd(8, " ")
        );
      }
    }
    console.log("Total".padEnd(25, " "), ":", total2Dept);
    console.log();
  }

  {
    const programmings = _.chain(students)
      .filter(std =>
        std.positions
          .join(";")
          .toLowerCase()
          .includes("programming")
      )
      .groupBy(std =>
        std.classGroup.slice(2) === "TI1" ? "morning" : "evening"
      )
      .value();

    const others = _.chain(students)
      .filter(
        std =>
          !std.positions
            .join(";")
            .toLowerCase()
            .includes("programming")
      )
      .sortBy([std => (std.classGroup.slice(2) == "TI2" ? 0 : 999)])
      .groupBy(std =>
        std.classGroup.slice(2) === "TI1" ? "morning" : "evening"
      )
      .value();

    let orderNo = 1;
    let curM = moment("09:00", "HH:mm");
    function printCandidate(cand) {
      console.log(
        (orderNo++ + "").padStart(2, " ") + ".",
        curM.format("HH:mm"),
        "-",
        curM.add(14, "minutes").format("HH:mm"),
        "   ",
        cand.name.padEnd(20, " "),
        cand.classGroup.padEnd(8, " "),
        cand.positions.join(", ")
      );
      curM.add(1, "minutes");
    }

    printTitle("Possible Schedule");
    for (let i = 0; i < 7; i++) {
      printCandidate(_.head(others["evening"]));
      others["evening"].shift();
    }
    for (let i = 0; i < 5; i++) {
      printCandidate(_.head(programmings["evening"]));
      programmings["evening"].shift();
    }

    console.log("--. BREAK (12:00 - 12:59)");
    curM.add(1, "hours");
    for (let i = 0; i < 2; i++) {
      printCandidate(_.head(programmings["evening"]));
      programmings["evening"].shift();
    }
    for (let i = 0; i < 5; i++) {
      printCandidate(_.head(programmings["morning"]));
      programmings["morning"].shift();
    }
    for (let i = 0; i < 6; i++) {
      printCandidate(_.head(others["evening"]));
      others["evening"].shift();
    }
    for (let i = 0; i < 4; i++) {
      printCandidate(_.head(others["morning"]));
      others["morning"].shift();
    }
  }
})();
