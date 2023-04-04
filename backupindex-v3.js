// desc package
const { default: makeWASocket } = require("@adiwajshing/baileys");
const {
  useSingleFileAuthState,
  DisconnectReason,
} = require("@adiwajshing/baileys");
const { default: axios } = require("axios");

//API
const sheet1 =
  "https://script.google.com/macros/s/AKfycbwvMuUIwKJCzmbGV61S9zG5DijC8dfqfkH8sf6yGC7UNZyljiVL8JodmsAJAB7U86qq/exec?whatsapp=";
const sheetFDR =
  "https://script.google.com/macros/s/AKfycbwbdl8eRz_YRh_1Y1cUtrMI1rbFjZj6sHZSMjkE2PhU049nxXbJ7gdI2VX_YtEmy0Wl/exec";

const startSock = () => {
  const { state, saveState } = useSingleFileAuthState("./auth.json");
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });

  // conn n qr code
  sock.ev.on("connection.update", function (update, connection2) {
    let _a, _b;
    let connection = update.connection,
      lastDisconnect = update.lastDisconnect;
    if (connection == "close") {
      if (
        ((_b =
          (_a = lastDisconnect.error) === null || _a === void 0
            ? void 0
            : _a.output) === null || _b === void 0
          ? void 0
          : _b.statusCode) !== DisconnectReason.loggedOut
      ) {
        startSock();
      }
    } else {
      console.log("connction closed");
    }

    console.log("connection update", update);
  });
  sock.ev.on("creds.update", saveState);

  //Process chat
  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg.key.fromMe && m.type === "notify") {
      //validasi wa from phone or web
      console.log("GET Phone : " + msg.key.remoteJid);
      console.log("data jason" + JSON.stringify(msg));
      // kalo web get data nya ini let order = msg.message.extendedTextMessage.text.toUpperCase();
      // var orders =
      //   msg.message.conversation == ""
      //     ? msg.message.extendedTextMessage.text.toUpperCase()
      //     : msg.message.conversation.toLocaleUpperCase();
      // console.log("data jason" + JSON.stringify(msg));
      if (msg.key.remoteJid.includes("@s.whatsapp.net")) {
        if (msg.message) {
          // if (msg.message.buttonsResponseMessage.selectedButtonId =="b1") {
          // } else {

          let items = msg.message.buttonsResponseMessage?.selectedButtonId;
          console.log("items = " + items);
          const botButton =
            msg.message.buttonsResponseMessage?.selectedButtonId;
          if (msg.message.conversation != "hai") {
            if (botButton) {
              // switch 1
              switch (items) {
                case "a":
                  axios
                    .get(
                      sheet1 + msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    )
                    .then(async (response) => {
                      // console.log(response.data);
                      const { success, data } = response.data;
                      if (success) {
                        // items part
                        const buttons = [
                          {
                            buttonId: "b1",
                            buttonText: { displayText: "Order" },
                            type: 1,
                          },
                          {
                            buttonId: "b2",
                            buttonText: { displayText: "Daftar Toko Baru" },
                            type: 1,
                          },
                        ];
                        str = `Hallo ${data.nama}! \n\nSilahkan pilih Menu yang tersedia dibawah ini:`;
                        const buttonMessage = {
                          text: str,
                          footer:
                            "StarPart Motor ~ The Bigest Supplier in West Java",
                          buttons: buttons,
                          headerType: 1,
                        };

                        const sendMsg = await sock.sendMessage(
                          msg.key.remoteJid,
                          buttonMessage
                        );
                        // break;
                      } else {
                        await sock.sendMessage(msg.key.remoteJid, {
                          text: "Mohon maaf nomor anda belum terdaftar di aplikasi ini, \nsilahkan menghubungi sales kami.",
                        });
                      }
                    });
                  break;
              }
              //switch 2
              switch (items) {
                case "b1":
                  //order
                  const buttons = [
                    {
                      buttonId: "c1",
                      buttonText: { displayText: "Catalog" },
                      type: 1,
                    },
                    {
                      buttonId: "c2",
                      buttonText: { displayText: "Orderan Favorit" },
                      type: 1,
                    },
                    {
                      buttonId: "c3",
                      buttonText: { displayText: "Orderan Terakhir" },
                      type: 1,
                    },
                  ];
                  str = `Silahkan pilih Menu yang tersedia dibawah ini:`;
                  const buttonMessage = {
                    text: str,
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttons,
                    headerType: 1,
                  };

                  const sendMsg = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessage
                  );
                  break;
                case "b2":
                  //daftar toko baru
                  axios
                    .get(
                      sheet1 + msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    )
                    .then(async (resp) => {
                      const { data } = resp.data;
                      let sales = data.ket;
                      // console.log(sales);
                      if (sales.toUpperCase() == "SALES") {
                        await sock.sendMessage(msg.key.remoteJid, {
                          text: "anda sales.",
                        });
                      } else {
                        const buttons = [
                          {
                            buttonId: "a",
                            buttonText: { displayText: "Kembali" },
                            type: 1,
                          },
                        ];
                        str = `Maaf menu ini hanya bisa diaksess oleh Sales kami.`;
                        const buttonMessage = {
                          text: str,
                          footer:
                            "StarPart Motor ~ The Bigest Supplier in West Java",
                          buttons: buttons,
                          headerType: 1,
                        };
                        const sendMsg = await sock.sendMessage(
                          msg.key.remoteJid,
                          buttonMessage
                        );
                      }
                    });

                  break;
              }
              //switch 3
              switch (items) {
                case "c1":
                  const buttons = [
                    {
                      buttonId: "d1",
                      buttonText: { displayText: "FDR" },
                      type: 1,
                    },
                    {
                      buttonId: "d2",
                      buttonText: { displayText: "OSRAM 2W" },
                      type: 1,
                    },
                    {
                      buttonId: "d3",
                      buttonText: { displayText: "OSRAM 4W" },
                      type: 1,
                    },
                  ];
                  str = `Silahkan pilih Product kami yang tersedia dibawah ini:`;
                  const buttonMessage = {
                    text: str,
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttons,
                    headerType: 1,
                  };

                  const sendMsg = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessage
                  );
                  break;
                case "c2":
                  // OSRAM 2W
                  break;
                case "c3":
                  //OSRAM 4W
                  break;
              }
              // switch 4
              switch (items) {
                case "d1":
                  const buttons = [
                    {
                      buttonId: "f1",
                      buttonText: { displayText: "TL : Tubeless Type" },
                      type: 1,
                    },
                    {
                      buttonId: "f2",
                      buttonText: { displayText: "TT : Tube Type" },
                      type: 1,
                    },
                  ];
                  str = `Silahkan pilih Product kami yang tersedia dibawah ini:`;
                  const buttonMessage = {
                    text: str,
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttons,
                    headerType: 1,
                  };

                  const sendMsg = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessage
                  );

                  break;
                case "d2":
                  // OSRAM 2W
                  break;
                case "d3":
                  //OSRAM 4W
                  break;
              }
              // switch 5
              switch (items) {
                case "f1":
                  // FDR Part
                  await sock.sendMessage(msg.key.remoteJid, {
                    text: "Mohon tunggu sebentar, data sedang disiapkan.",
                  });
                  console.log("FDR");
                  // axios.get(sheetFDR).then(async (res) => {
                  //   const data = [res.data];
                  //   // console.log(data);
                  //   let size = res.data.length;
                  //   // console.log(size);
                  //   const arr = [];
                  //   for (let f = 0; f < size; f++) {
                  //     // console.log(res.data[f].pattern);
                  //     if (res.data[f].type == "TL") {
                  //       p = res.data[f].pattern;
                  //       if (!arr.includes(p)) {
                  //         arr.push(p);
                  //       }
                  //     }
                  //     // console.log(p);
                  //   }
                  //   // console.log(arr);
                  //   const patterns = [];
                  //   let patternsMenu = [];
                  //   for (let a = 0; a < arr.length; a++) {
                  //     console.log(arr[a]);
                  //     tl = arr[a];
                  //     if (!patterns.includes(tl)) {
                  //       patterns.push(a + " . " + tl);
                  //     }
                  //   }
                  //   console.log(patterns);
                  //   patternsMenu = patterns.join("\n");
                  //   // patterns = arr
                  //   //   .filter((x, i, a) => a.indexOf(x) == i)
                  //   //   .join("\n");
                  //   // let patterns = [new Set(arr.map((element) => arr))];
                  //   // console.log(patterns);
                  //   // console.log(patterns.length);
                  //   // arr = arr.join("\n");
                  //   // console.log("arr = " + arr.toString());

                  // });
                  // const patterns = getSheet();

                  // let patternsMenu = getSheet();
                  patternsMenu = getSheet();
                  console.log("func" + getSheet());
                  // console.log("menu " + patternsMenu);
                  await sock.sendMessage(msg.key.remoteJid, {
                    text:
                      "### FDR Pattern Tubless Type ###\nSilahkan ketik nomor pattern dibawah ini\n" +
                      patternsMenu,
                  });

                  // if (msg.message.conversation == 0) {
                  //   await sock.sendMessage(msg.key.remoteJid, {
                  //     text: "masuk 0",
                  //   });
                  // }
                  break;
                case "f2":
                  // FDR Part
                  await sock.sendMessage(msg.key.remoteJid, {
                    text: "Mohon tunggu sebentar, data sedang disiapkan.",
                  });
                  console.log("FDR");
                  axios.get(sheetFDR).then(async (res) => {
                    const data = [res.data];
                    // console.log(data);
                    let size = res.data.length;
                    // console.log(size);
                    const arr = [];
                    let patterns = [];
                    for (let f = 0; f < size; f++) {
                      // console.log(res.data[f].pattern);
                      p = res.data[f].pattern;
                      arr.push(p);
                      // console.log(p);
                    }
                    patterns = arr
                      .filter((x, i, a) => a.indexOf(x) == i)
                      .join("\n");
                    console.log(arr[0]);
                    // console.log(pattern.length);
                    // arr = arr.join("");
                    // console.log("arr = " + arr.toString());
                    await sock.sendMessage(msg.key.remoteJid, {
                      // text: "### FDR Pattern ###",
                      text:
                        "### FDR Pattern Tubless Type ###\nSilahkan ketik nomor pattern dibawah ini\n" +
                        patterns.toString(),
                    });
                  });
                  break;
              }
              // } else {
            } else {
              // let patterns = [];
              console.log(patterns + "test");
              let input = msg.message.conversation;
              for (let i = 0; i < patterns.length; i++) {
                switch (input) {
                  case i:
                    console.log(i);
                    break;
                }
              }
              // console.log("tes console " + msg.message.conversation);
            }
          } else {
            const buttons = [
              {
                buttonId: "a",
                buttonText: { displayText: "Mulai" },
                type: 1,
              },
            ];
            const buttonMessage = {
              text: "Selamat Datang di StarPart. \n\nIni Robot Order. \n\nSilahkan pilih button dibawah ini untuk melakukan pemesanan.",
              footer: "StarPart Motor ~ The Bigest Supplier in West Java",
              buttons: buttons,
              headerType: 1,
            };
            const sendMsg = await sock.sendMessage(
              msg.key.remoteJid,
              buttonMessage
            );
          }
        }
      }
    }
  });

  const getSheet = function () {
    let patternsMenu = [];
    axios.get(sheetFDR).then(async (res) => {
      const data = [res.data];
      // console.log(data);
      let size = res.data.length;
      // console.log(size);
      const arr = [];
      for (let f = 0; f < size; f++) {
        // console.log(res.data[f].pattern);
        if (res.data[f].type == "TL") {
          p = res.data[f].pattern;
          if (!arr.includes(p)) {
            arr.push(p);
          }
        }
        // console.log(p);
      }
      // console.log(arr);
      const patterns = [];
      // let patternsMenu = [];
      for (let a = 0; a < arr.length; a++) {
        // console.log(arr[a]);
        tl = arr[a];
        if (!patterns.includes(tl)) {
          patterns.push(a + " . " + tl);
        }
      }
      // console.log(patterns);
      patternsMenu = patterns.join("\n");
      console.log(patternsMenu);
      // patterns = arr
      //   .filter((x, i, a) => a.indexOf(x) == i)
      //   .join("\n");
      // let patterns = [new Set(arr.map((element) => arr))];
      // console.log(patterns);
      // console.log(patterns.length);
      // arr = arr.join("\n");
      // console.log("arr = " + arr.toString());
      // await sock.sendMessage(msg.key.remoteJid, {
      //   text:
      //     "### FDR Pattern Tubless Type ###\nSilahkan ketik nomor pattern dibawah ini\n" +
      //     patternsMenu.toString(),
      // });
      // patternstmp = patterns;
      // patternstmp = patternsMenu;
      // return patternsMenu;
    });
    // return patterns;
    return patternsMenu;
  };
};

startSock();
