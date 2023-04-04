// desc package
const { default: makeWASocket } = require("@adiwajshing/baileys");
const {
  useSingleFileAuthState,
  DisconnectReason,
} = require("@adiwajshing/baileys");
const { default: axios } = require("axios");
const session = require("express-session");

// const app = express();

//API
const sheet1 =
  "https://script.google.com/macros/s/AKfycbwvMuUIwKJCzmbGV61S9zG5DijC8dfqfkH8sf6yGC7UNZyljiVL8JodmsAJAB7U86qq/exec?whatsapp=";
const sheetFDR =
  "https://script.google.com/macros/s/AKfycbz62hnwLdv-t9oMqZ3L9F5t4b765T_4tjNX_M7rXoxCyM3083jEB8xiWsN8i9PNt9NQ/exec";
const codeFdr =
  "https://script.google.com/macros/s/AKfycbyQtsLYfQGg6rzqkrI8LEzd_fuKCSM0GXNrprqTZMSI02Wi_-ZcYEWnb4wr1gwxkxvf/exec?kode=";
const route = [];
const cart = { data: [] };
const formatterRp = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumSignificantDigits: 3,
});

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

      // app.use(
      //   session({
      //     secret: "StarpartOrderBot",
      //     resave: false,
      //     saveUninitialized: true,
      //   })
      // );

      if (msg.key.remoteJid.includes("@s.whatsapp.net")) {
        if (msg.message) {
          // if (msg.message.buttonsResponseMessage.selectedButtonId =="b1") {
          // } else {

          let items = msg.message.buttonsResponseMessage?.selectedButtonId;
          console.log("items : " + items);
          console.log("Route : " + route);
          const botButton =
            msg.message.buttonsResponseMessage?.selectedButtonId;
          const listReplay = msg.message.listResponseMessage?.title;
          const code =
            msg.message.listResponseMessage?.singleSelectReply.selectedRowId;

          if (msg.message.conversation != "p") {
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
                case "e1":
                  //add to chart
                  console.log("ini cart ", cart);
                  l = cart.data.length;
                  let arr = [];
                  for (let i = 0; i < l; i++) {
                    str = `No. ${i + 1}\nItem : ${cart.data[i].pattern} | ${
                      cart.data[i].ukuran
                    } | ${cart.data[i].type}\nHarga : ${formatterRp.format(
                      cart.data[i].harga
                    )}\nJumlah : ${
                      cart.data[i].jumlah
                    }\nTotal : ${formatterRp.format(cart.data[i].total)}`;
                    arr.push(str);
                  }
                  arr = arr.join("\n\n");

                  // await sock.sendMessage(msg.key.remoteJid, {
                  //   text: "### Keranjang (Cart) ###\n\n" + arr.toString(),
                  // });
                  const button = [
                    {
                      buttonId: "c1",
                      buttonText: { displayText: "Continue Shopping" },
                      type: 1,
                    },
                    {
                      buttonId: "f1",
                      buttonText: { displayText: "Check out" },
                      type: 1,
                    },
                    {
                      buttonId: "f2",
                      buttonText: { displayText: "Cancel Order" },
                      type: 1,
                    },
                  ];
                  // str = `Silahkan pilih Menu yang tersedia dibawah ini:`;
                  const buttonMessagee = {
                    text: "### Keranjang 🛒 ###\n\n" + arr.toString(),
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: button,
                    headerType: 1,
                  };

                  const sendMsgi = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessagee
                  );
                  break;
                case "e2":
                  console.log(cart.data);
                  route.splice(0);
                  cart.data.splice(-1);
                  console.log(route, cart.data);
                  //cancel
                  const buttons = [
                    {
                      buttonId: "c1",
                      buttonText: { displayText: "Back to Shopping" },
                      type: 1,
                    },
                  ];
                  // str = `Silahkan pilih Menu yang tersedia dibawah ini:`;
                  const buttonMessage = {
                    text: "Item yang anda pilih telah dibatalkan",
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttons,
                    headerType: 1,
                  };

                  const sendMsg = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessage
                  );
                  break;
              }
              switch (items) {
                case "f1":
                  // FDR Part
                  // await sock.sendMessage(msg.key.remoteJid, {
                  //   text: "Mohon tunggu sebentar, data sedang disiapkan.",
                  // });
                  console.log("FDR");
                  axios.get(sheetFDR).then(async (res) => {
                    const data = [res.data];
                    // console.log(data);
                    let size = res.data.length;
                    // console.log(size);
                    let arr = [];
                    for (let f = 0; f < size; f++) {
                      // console.log(res.data[f].pattern);
                      if (res.data[f].type == "TL") {
                        p = res.data[f].pattern;
                        if (!arr.includes(p)) {
                          arr.push(p);
                        }
                      }
                    }
                    console.log(arr);

                    //push array to obj list massage
                    let sections = [{ rows: [] }];
                    arr.forEach(function (item) {
                      sections[0].rows.push({ title: item, rowId: item });
                    });

                    const listMessage = {
                      text: "Silahkan pilih list",
                      footer:
                        "StarPart Motor ~ The Bigest Supplier in West Java",
                      title: "List Kategori FDR Tubless Type",
                      buttonText: "FDR Tubeless Type",
                      sections,
                    };

                    const sendMsg = await sock.sendMessage(
                      msg.key.remoteJid,
                      listMessage
                    );
                  });

                  break;
                case "f2":
                  // FDR Part
                  // await sock.sendMessage(msg.key.remoteJid, {
                  //   text: "Mohon tunggu sebentar, data sedang disiapkan.",
                  // });
                  console.log("FDR");
                  axios.get(sheetFDR).then(async (res) => {
                    const data = [res.data];
                    // console.log(data);
                    let size = res.data.length;
                    // console.log(size);
                    const arr = [];
                    // let patterns = [];
                    for (let f = 0; f < size; f++) {
                      // console.log(res.data[f].pattern);
                      if (res.data[f].type == "TT") {
                        p = res.data[f].pattern;
                        if (!arr.includes(p)) {
                          arr.push(p);
                        }
                      }
                    }
                    // patterns = arr
                    //   .filter((x, i, a) => a.indexOf(x) == i)
                    //   .join("\n");
                    // console.log(patterns);
                    let sections = [{ rows: [] }];

                    arr.forEach(function (item) {
                      sections[0].rows.push({ title: item, rowId: item });
                    });

                    // console.log("sec " + sections);
                    const listMessage = {
                      text: "Silahkan pilih list",
                      footer:
                        "StarPart Motor ~ The Bigest Supplier in West Java",
                      title: "List Kategori FDR Tube Type",
                      buttonText: "FDR Tube Type",
                      sections,
                    };

                    const sendMsg = await sock.sendMessage(
                      msg.key.remoteJid,
                      listMessage
                    );
                  });
                  break;
              }

              // } else {
            } else if (code) {
              // console.log(listReplay);
              axios.get(codeFdr + code).then(async (res) => {
                console.log(res.data);
                console.log(code);
                //kirim data
                const { success, data, message } = res.data;
                let str;

                if (!success) {
                  axios.get(sheetFDR).then(async (r) => {
                    let data;
                    let fdr = [];
                    for (let key in r.data) {
                      data = r.data[key];
                      // console.log(data.pattern);
                      if (listReplay == data.pattern) {
                        console.log(data);
                        fdr.push(data);
                      }
                    }
                    console.log(fdr);
                    // Object.assign({}, data);
                    let sections = [{ rows: [] }];

                    fdr.forEach(function (item) {
                      let hrg = formatterRp.format(item.harga);
                      sections[0].rows.push({
                        title: item.pattern + " | " + item.ukuran + " | " + hrg,
                        rowId: item.kode,
                      });
                    });
                    // console.log("sec " + sections);
                    const listMessage = {
                      text: "Silahkan pilih list",
                      footer:
                        "StarPart Motor ~ The Bigest Supplier in West Java",
                      title: "List Kategori " + listReplay,
                      buttonText: "FDR " + listReplay,
                      sections,
                    };

                    const sendMsg = await sock.sendMessage(
                      msg.key.remoteJid,
                      listMessage
                    );
                    // r.forEach()
                  });
                } else {
                  console.log(formatterRp.format(data.harga));
                  str = `Code Item ${data.kode}! \n\nPattern : ${
                    data.pattern
                  } \nUkuran : ${data.ukuran} \nTipe : ${
                    data.type
                  } \nHarga : ${formatterRp.format(
                    data.harga
                  )}. \n\nMasukan jumlah barang yang ingin anda beli..`;
                  // console.log(str);
                  route.splice(0);
                  route.push("jumlah");

                  cart.data.push({
                    kode: data.kode,
                    pattern: data.pattern,
                    ukuran: data.ukuran,
                    type: data.type,
                    harga: data.harga,
                  });
                  // console.log("ini cart ", cart);
                  await sock.sendMessage(msg.key.remoteJid, {
                    text: str,
                  });
                }
              });
            } else if (route[0] == "jumlah") {
              console.log("masuk jumlah");
              console.log(route);
              l = cart.data.length - 1;
              // console.log(l);
              // cart.data.push({
              //   jumlah: msg.message.conversation,
              // });
              console.log(cart.data[0]["harga"]);
              jml = parseInt(msg.message.conversation);
              total = cart.data[l]["harga"] * jml;
              console.log(jml);
              if (isNaN(jml)) {
                await sock.sendMessage(msg.key.remoteJid, {
                  text: "Silahkan ini dengan benar, isi menggunakan angka.",
                });
              } else {
                cart.data[l]["jumlah"] = parseInt(msg.message.conversation);
                cart.data[l]["total"] = total;
                console.log("ini cart ", cart);

                str = `Code Item ${cart.data[l].kode}! \n\nPattern : ${
                  cart.data[l].pattern
                } \nUkuran : ${cart.data[l].ukuran} \nTipe : ${
                  cart.data[l].type
                } \nHarga : ${formatterRp.format(
                  cart.data[l].harga
                )}\nJumlah : ${
                  cart.data[l].jumlah
                } \n\nTotal : ${formatterRp.format(cart.data[l].total)}`;
                route.splice(0);
                const buttons = [
                  {
                    buttonId: "e1",
                    buttonText: { displayText: "Add to Cart" },
                    type: 1,
                  },
                  {
                    buttonId: "e2",
                    buttonText: { displayText: "Cancel" },
                    type: 1,
                  },
                ];
                // str = `Silahkan pilih Menu yang tersedia dibawah ini:`;
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
                // await sock.sendMessage(msg.key.remoteJid, {
                //   text: str,
                // });
              }
            } else {
              // let patterns = [];
              // console.log(patterns + "test");
              // let input = msg.message.conversation;
              // for (let i = 0; i < patterns.length; i++) {
              //   switch (input) {
              //     case i:
              //       console.log(i);
              //       break;
              //   }
              // }
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

  // const getSheet = function () {
  //   let patternsMenu = [];
  //   axios.get(sheetFDR).then(async (res) => {
  //     const data = [res.data];
  //     // console.log(data);
  //     let size = res.data.length;
  //     // console.log(size);
  //     const arr = [];
  //     for (let f = 0; f < size; f++) {
  //       // console.log(res.data[f].pattern);
  //       if (res.data[f].type == "TL") {
  //         p = res.data[f].pattern;
  //         if (!arr.includes(p)) {
  //           arr.push(p);
  //         }
  //       }
  //       // console.log(p);
  //     }
  //     // console.log(arr);
  //     const patterns = [];
  //     // let patternsMenu = [];
  //     for (let a = 0; a < arr.length; a++) {
  //       // console.log(arr[a]);
  //       tl = arr[a];
  //       if (!patterns.includes(tl)) {
  //         patterns.push(a + " . " + tl);
  //       }
  //     }
  //     // console.log(patterns);
  //     patternsMenu = patterns.join("\n");
  //     console.log(patternsMenu);
  //     // patterns = arr
  //     //   .filter((x, i, a) => a.indexOf(x) == i)
  //     //   .join("\n");
  //     // let patterns = [new Set(arr.map((element) => arr))];
  //     // console.log(patterns);
  //     // console.log(patterns.length);
  //     // arr = arr.join("\n");
  //     // console.log("arr = " + arr.toString());
  //     // await sock.sendMessage(msg.key.remoteJid, {
  //     //   text:
  //     //     "### FDR Pattern Tubless Type ###\nSilahkan ketik nomor pattern dibawah ini\n" +
  //     //     patternsMenu.toString(),
  //     // });
  //     // patternstmp = patterns;
  //     // patternstmp = patternsMenu;
  //     // return patternsMenu;
  //   });
  //   // return patterns;
  //   return patternsMenu;
  // };
};

startSock();
// list
// const sections = [
//   {
//     title: "Section 1",
//     rows: [
//       { title: "Option 1", rowId: "option1" },
//       {
//         title: "Option 2",
//         rowId: "option2",
//         description: "This is a description",
//       },
//       {
//         title: "Option 3",
//         rowId: "option3",
//         description: "This is a description",
//       },
//       {
//         title: "Option 4",
//         rowId: "option4",
//         description: "This is a description",
//       },
//       {
//         title: "Option 5",
//         rowId: "option5",
//         description: "This is a description",
//       },
//       {
//         title: "Option 6",
//         rowId: "option6",
//         description: "This is a description",
//       },
//     ],
//   },
//   {
//     title: "Section 2",
//     rows: [
//       { title: "Option 3", rowId: "option3" },
//       {
//         title: "Option 4",
//         rowId: "option4",
//         description: "This is a description V2",
//       },
//     ],
//   },
// ];

// const listMessage = {
//   text: "This is a list",
//   footer: "nice footer, link: https://google.com",
//   title: "Amazing boldfaced list title",
//   buttonText: "Required, text on the button to view the list",
//   sections,
// };

// const sendMsg = await sock.sendMessage(
//   msg.key.remoteJid,
//   listMessage
// );
