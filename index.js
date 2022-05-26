const fs = require("fs/promises");

const createFilelistByAppending = (sourceDirectory, targetFileName) => {
  fs.readdir(sourceDirectory, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        fs.appendFile(`./${targetFileName}`, `"${file}",`, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`appended "${file}" to "${targetFileName}"`);
          }
        });
      });
    }
  });
};



/**
 * iterate over book list
 * find first book that contains creature
 * push value from key "source" of book to booksContainingCreature:[]
 * if this entry has key "otherSources" -> itherate over value:[] of otherSources and push value:string of key "source" to booksContainingCreature
 * done
 */
// const findCreatureInBestiaries = (creatureName) => {
//   const bestiaryBooktitles = [
//     "bestiary-ai.json",
//     "bestiary-aitfr-dn.json",
//     "bestiary-aitfr-fcd.json",
//     "bestiary-aitfr-isf.json",
//     "bestiary-aitfr-thp.json",
//     "bestiary-bgdia.json",
//     "bestiary-cm.json",
//     "bestiary-cos.json",
//     "bestiary-dc.json",
//     "bestiary-dip.json",
//     "bestiary-dmg.json",
//     "bestiary-egw.json",
//     "bestiary-erlw.json",
//     "bestiary-esk.json",
//     "bestiary-ggr.json",
//     "bestiary-gos.json",
//     "bestiary-hftt.json",
//     "bestiary-hol.json",
//     "bestiary-hotdq.json",
//     "bestiary-idrotf.json",
//     "bestiary-imr.json",
//     "bestiary-kkw.json",
//     "bestiary-llk.json",
//     "bestiary-lmop.json",
//     "bestiary-lr.json",
//     "bestiary-mff.json",
//     "bestiary-mm.json",
//     "bestiary-mot.json",
//     "bestiary-mtf.json",
//     "bestiary-oota.json",
//     "bestiary-oow.json",
//     "bestiary-phb.json",
//     "bestiary-pota.json",
//     "bestiary-ps-a.json",
//     "bestiary-ps-d.json",
//     "bestiary-ps-i.json",
//     "bestiary-ps-k.json",
//     "bestiary-ps-x.json",
//     "bestiary-ps-z.json",
//     "bestiary-rmbre.json",
//     "bestiary-rot.json",
//     "bestiary-sads.json",
//     "bestiary-sdw.json",
//     "bestiary-skt.json",
//     "bestiary-slw.json",
//     "bestiary-tce.json",
//     "bestiary-tftyp.json",
//     "bestiary-toa.json",
//     "bestiary-ttp.json",
//     "bestiary-ua-2020smt.json",
//     "bestiary-ua-2021do.json",
//     "bestiary-ua-2021mos.json",
//     "bestiary-ua-20s2.json",
//     "bestiary-ua-20s5.json",
//     "bestiary-ua-ar.json",
//     "bestiary-ua-cdw.json",
//     "bestiary-ua-cfv.json",
//     "bestiary-vgm.json",
//     "bestiary-vrgr.json",
//     "bestiary-wbtw.json",
//     "bestiary-wdh.json",
//     "bestiary-wdmm.json",
//     "bestiary-xge.json",
//   ];

//   let booksContainingCreature = [];

//   fs.readFile("./bestiary-testfile.json", "utf8", function (err, bestiaryData) {
//     if (err) {
//       console.log(err);
//     } else {
//       const bestiaryDataJson = JSON.parse(bestiaryData);

//       bestiaryDataJson.monster.forEach((statBlock) => {
//         if (statBlock.name === creatureName) {
//           booksContainingCreature.push(statBlock.source);
//         }
//       });
//     }
//   });

//   return booksContainingCreature;
// };

// 1. datei parsen ("./bestiary-testfile.json" -> string -> JSON)
// 2. JSON parsen (JSON -> booksContainingCreature)
// 3. ???

//function getJSON(filePath) {}
//function parseBooksContainingCreature(json) {}
//function main(booksContainingCreature) {}

// async function main () {
//   const json = await getJSON();
//   const booksContainingCreature = parseBooksContainingCreature(json);
//   const result = doMoreStuff(booksContainingCreature);
// }

const getJSON = (filePath) => {
  fs.readFile(filePath, { encoding: "utf-8" }).then((bestiaryData) => {
    return JSON.parse(bestiaryData);
  });
};

const getCreatureCr = (creatureName, bestiaryDataJson) => {
  bestiaryDataJson.monster.forEach((statBlock) => {
    if (statBlock.name === creatureName) {
      const creatureCr = statBlock.cr;
      return creatureCr;
    }
  });
};

const main = async () => {
  const filePath = "./bestiary-testfile.json";
  const bestiaryDataJson = await getJSON(filePath);
  const creatureCr = getCreatureCr("Aarakocra", bestiaryDataJson);
  return creatureCr;
};

main();

// const createBallOfMud = (creatureName) => {
//   try {
//     fs.readFile("./bestiary-testfile.json", { encoding: "utf-8" })
//       .then((bestiaryData) => {
//         return JSON.parse(bestiaryData);
//       })
//       .then((bestiaryDataJson) => {
//         let booksContainingCreature = [];
//         bestiaryDataJson.monster.forEach((statBlock) => {
//           if (statBlock.name === creatureName) {
//             booksContainingCreature.push(statBlock.source);
//             if (statBlock.otherSources !== undefined) {
//               statBlock.otherSources.forEach((otherSource) => {
//                 booksContainingCreature.push(otherSource.source);
//               });
//             }
//           }
//         });
//         return booksContainingCreature;
//       })
//       .then((booksContainingCreature) => {
//         console.log(booksContainingCreature);
//       });
//   } catch (err) {
//     console.log(err);
//   }
// };

// createBallOfMud("Aarakocra");
