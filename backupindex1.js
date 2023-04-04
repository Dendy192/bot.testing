// desc package
const { default: makeWASocket } = require("@adiwajshing/baileys");
const {
  useSingleFileAuthState,
  DisconnectReason,
} = require("@adiwajshing/baileys");
const { default: axios } = require("axios");
const session = require("express-session");

// const app = express();
Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

//search
function search(nameKey, myArray) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].name === nameKey) {
      return myArray[i];
    }
  }
}

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
          // const botButton =
          //   msg.message.buttonsResponseMessage?.selectedButtonId;
          const listReplay = msg.message.listResponseMessage?.title;
          const code =
            msg.message.listResponseMessage?.singleSelectReply.selectedRowId;
          // const wa = msg.message.remoteJid;
          if (items == "a") {
            route.push(msg.key.remoteJid.replace("@s.whatsapp.net", ""));
            axios
              .get(sheet1 + msg.key.remoteJid.replace("@s.whatsapp.net", ""))
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
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
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
          }
          if (
            route.includes(msg.key.remoteJid.replace("@s.whatsapp.net", ""))
          ) {
            // if (msg.message.conversation) {
            if (items) {
              switch (items) {
                //switch 2
                case "b1":
                  //order
                  // route.remove(
                  //   msg.key.remoteJid.replace("@s.whatsapp.net", "")
                  // );
                  const buttonsb1 = [
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
                  const buttonMessageb1 = {
                    text: str,
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttonsb1,
                    headerType: 1,
                  };

                  const sendMsgb1 = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessageb1
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
                        const buttonsb2 = [
                          {
                            buttonId: "a",
                            buttonText: { displayText: "Kembali" },
                            type: 1,
                          },
                        ];
                        str = `Maaf menu ini hanya bisa diaksess oleh Sales kami.`;
                        const buttonMessageb2 = {
                          text: str,
                          footer:
                            "StarPart Motor ~ The Bigest Supplier in West Java",
                          buttons: buttonsb2,
                          headerType: 1,
                        };
                        const sendMsgb2 = await sock.sendMessage(
                          msg.key.remoteJid,
                          buttonMessageb2
                        );
                      }
                    });

                  break;
                //switch 3
                case "c1":
                  const buttonsc1 = [
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
                  const buttonMessagec1 = {
                    text: str,
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttonsc1,
                    headerType: 1,
                  };

                  const sendMsgc1 = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessagec1
                  );
                  break;
                case "c2":
                  // OSRAM 2W
                  break;
                case "c3":
                  //OSRAM 4W
                  break;
                // switch 4
                case "d1":
                  const buttonsd1 = [
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
                  const buttonMessaged1 = {
                    text: str,
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttonsd1,
                    headerType: 1,
                  };

                  const sendMsgd1 = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessaged1
                  );

                  break;
                case "d2":
                  // OSRAM 2W
                  break;
                case "d3":
                  //OSRAM 4W
                  break;
                // switch 5
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

                    const listMessagef1 = {
                      text: "Silahkan pilih list",
                      footer:
                        "StarPart Motor ~ The Bigest Supplier in West Java",
                      title: "List Kategori FDR Tubless Type",
                      buttonText: "FDR Tubeless Type",
                      sections,
                    };

                    const sendMsg = await sock.sendMessage(
                      msg.key.remoteJid,
                      listMessagef1
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
                    const listMessagef2 = {
                      text: "Silahkan pilih list",
                      footer:
                        "StarPart Motor ~ The Bigest Supplier in West Java",
                      title: "List Kategori FDR Tube Type",
                      buttonText: "FDR Tube Type",
                      sections,
                    };

                    const sendMsg = await sock.sendMessage(
                      msg.key.remoteJid,
                      listMessagef2
                    );
                  });
                  break;
                //switch 6
                case "e1":
                  //add to chart
                  console.log("ini cart ", cart);
                  l = cart.data.length;
                  let arr = [];
                  // cari = search(
                  //   msg.key.remoteJid.replace("@s.whatsapp.net", ""),
                  //   cart.data
                  // );
                  // console.log(cari);
                  for (let i = 0; i < l; i++) {
                    if (
                      cart.data[i].wa ==
                      msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    ) {
                      hrg = formatterRp.format(cart.data[i].harga);
                      ttl = formatterRp.format(cart.data[i].total);
                      str = `No. ${arr.length + 1}\nItem : ${
                        cart.data[i].pattern
                      } | ${cart.data[i].ukuran} | ${
                        cart.data[i].type
                      }\nHarga : ${hrg}\nJumlah : ${
                        cart.data[i].jumlah
                      }\nTotal : ${ttl}`;
                      arr.push(str);
                    }
                  }
                  arr = arr.join("\n\n");

                  const buttone1 = [
                    {
                      buttonId: "c1",
                      buttonText: { displayText: "Continue Shopping" },
                      type: 1,
                    },
                    {
                      buttonId: "g1",
                      buttonText: { displayText: "Check out" },
                      type: 1,
                    },
                    {
                      buttonId: "g2",
                      buttonText: { displayText: "Cancel Order" },
                      type: 1,
                    },
                  ];
                  const buttonMessagee1 = {
                    text: "### Keranjang 🛒 ###\n\n" + arr.toString(),
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttone1,
                    headerType: 1,
                  };

                  const sendMsge1 = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessagee1
                  );
                  break;
                case "e2":
                  //cancel
                  console.log(cart.data);
                  // route.splice(-1);
                  cart.data.splice(-1);
                  console.log(route, cart.data);

                  const buttonse2 = [
                    {
                      buttonId: "c1",
                      buttonText: { displayText: "Back to Shopping" },
                      type: 1,
                    },
                  ];
                  // str = `Silahkan pilih Menu yang tersedia dibawah ini:`;
                  const buttonMessagee2 = {
                    text: "Item yang anda pilih telah dibatalkan",
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttonse2,
                    headerType: 1,
                  };

                  const sendMsge2 = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessagee2
                  );
                  break;
                // switch 7
                case "g1":
                  //check out
                  break;
                case "g2":
                  //cancel order question
                  console.log(cart.data);
                  // route.splice(0);
                  // cart.data.splice(-1);
                  // console.log(route, cart.data);

                  const buttonsg2 = [
                    {
                      buttonId: "g3",
                      buttonText: { displayText: "Ya" },
                      type: 1,
                    },
                    {
                      buttonId: "e1",
                      buttonText: { displayText: "Tidak" },
                      type: 1,
                    },
                  ];
                  // str = `Silahkan pilih Menu yang tersedia dibawah ini:`;
                  const buttonMessageg2 = {
                    text: "Apakah anda yakin untuk membatalkan orderan ini?",
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttonsg2,
                    headerType: 1,
                  };

                  const sendMsgg2 = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessageg2
                  );
                  break;
                case "g3":
                  //cancel order question
                  console.log(cart.data);
                  // route.splice(0);
                  route.remove(
                    msg.key.remoteJid.replace("@s.whatsapp.net", "")
                  );
                  // cart.data.wa.remove(
                  //   msg.key.remoteJid.replace("@s.whatsapp.net", "")
                  // );
                  cart.data = cart.data.filter(
                    (data) =>
                      data.wa !=
                      msg.key.remoteJid.replace("@s.whatsapp.net", "")
                  );
                  // cart.data.splice(0);
                  console.log(route, cart.data);

                  await sock.sendMessage(msg.key.remoteJid, {
                    text: "Orderan anda telah berhasil dibatalkan!\n\nTerimakasih telah menggunakan Bot ini.\n\nStarPart Motor ~ The Bigest Supplier in West Java.",
                  });
                  break;
                case "g4":
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
                      hrg = formatterRp.format(item.harga);
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
                  hrg = formatterRp.format(data.harga);
                  str = `Code Item ${data.kode}! \n\nPattern : ${data.pattern} \nUkuran : ${data.ukuran} \nTipe : ${data.type} \nHarga : ${hrg}. \n\nMasukan jumlah barang yang ingin anda beli...`;
                  // console.log(str);
                  // route.splice(0);
                  route.push("jumlah");

                  cart.data.push({
                    wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
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
            } else if (
              route.includes("jumlah")
              // .includes(msg.key.remoteJid.replace(("@s.whatsapp.net", "")))
              // route.includes(msg.key.remoteJid.replace(("@s.whatsapp.net", "")))
            ) {
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
                  text: "Silahkan isi dengan benar, isi menggunakan angka.",
                });
              } else {
                cart.data[l]["jumlah"] = parseInt(msg.message.conversation);
                cart.data[l]["total"] = total;
                console.log("ini cart ", cart);
                hrg = formatterRp.format(cart.data[l].harga);
                ttl = formatterRp.format(cart.data[l].total);
                str = `Code Item ${cart.data[l].kode}! \n\nPattern : ${cart.data[l].pattern} \nUkuran : ${cart.data[l].ukuran} \nTipe : ${cart.data[l].type} \nHarga : ${hrg}\nJumlah : ${cart.data[l].jumlah} \n\nTotal : ${ttl}`;
                // route.splice(-1);
                route.remove("jumlah");
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
};

startSock();
