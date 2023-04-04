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
// function search(nameKey, myArray) {
//   for (let i = 0; i < myArray.length; i++) {
//     if (myArray[i].name === nameKey) {
//       return myArray[i];
//     }
//   }
// }

//API
const sheetAllItems =
  "https://script.google.com/macros/s/AKfycbyxNSYJ0lgA531-aFDpAHkLzqYPTN5704In91zYom9DZ3n1mC0vHO39ooTwDUUZIQ4F/exec";
const sheetItems =
  "https://script.google.com/macros/s/AKfycbwa0GKgqsxhUHc5GiS_klE7JUN5hr5MD52CR91cv86I2hbReqKh2IrTSx6OY7wu2Y86/exec?item=";
const sheetItemsOS2W =
  "https://script.google.com/macros/s/AKfycby2ar2NDypZq7IybvolT26axCijjBdp-qdCfeAVg4hXdHzd3TWAGjsAGgURfhglAqzv/exec";
const sheet1 =
  "https://script.google.com/macros/s/AKfycbwvMuUIwKJCzmbGV61S9zG5DijC8dfqfkH8sf6yGC7UNZyljiVL8JodmsAJAB7U86qq/exec?whatsapp=";
const sheetFDR =
  "https://script.google.com/macros/s/AKfycbz62hnwLdv-t9oMqZ3L9F5t4b765T_4tjNX_M7rXoxCyM3083jEB8xiWsN8i9PNt9NQ/exec";
const codeFdr =
  "https://script.google.com/macros/s/AKfycbyQtsLYfQGg6rzqkrI8LEzd_fuKCSM0GXNrprqTZMSI02Wi_-ZcYEWnb4wr1gwxkxvf/exec?kode=";
const route = [];
const cart = { data: [] };
const catalogid = [];
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
          console.log("Route : " + JSON.stringify(route));
          // const botButton =
          //   msg.message.buttonsResponseMessage?.selectedButtonId;
          const listReplay = msg.message.listResponseMessage?.title;
          const code =
            msg.message.listResponseMessage?.singleSelectReply.selectedRowId;
          // const wa = msg.message.remoteJid;
          if (items == "a") {
            route.push({
              wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
            });
            // route.push(msg.key.remoteJid.replace("@s.whatsapp.net", ""));
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
            // route.includes(msg.key.remoteJid.replace("@s.whatsapp.net", ""))
            route.some(
              (route) =>
                route.wa === msg.key.remoteJid.replace("@s.whatsapp.net", "")
            )
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
                // switch 4
                case "d1":
                  console.log("FDR");
                  axios.get(sheetItems + "FDR").then(async (res) => {
                    const d = res.data;
                    catalogid.length = 0;
                    // console.log("ini 1 ", d);
                    let size = d.data.length;
                    console.log(size);
                    let arr = [];
                    for (let f = 0; f < size; f++) {
                      console.log("-", d.data[f].item_desc);
                      // if (res.data[f].type == "TL") {
                      p = d.data[f].sub_fix;
                      u = d.data[f].item_desc;
                      q = d.data[f].type;
                      id = d.data[f].item_no;
                      // if (!arr.includes(p)) {
                      n = arr.length + 1;
                      arr.push(n + " . " + p + " | " + u + " | " + q);
                      catalogid.push(id);
                      // }
                      // }
                    }
                    console.log(arr);
                    console.log("catalog id " + catalogid);
                    arr = arr.join("\n");
                    // route.push("order"); //masukin sesuai nomer wa nya
                    m = route.findIndex(
                      (x) =>
                        x.wa ===
                        msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    );
                    route[m].data = "orderItems";
                    // cart.data.push({
                    //   wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
                    // });
                    await sock.sendMessage(
                      msg.key.remoteJid,
                      { text: "----- Catalog Items -----\n" + arr.toString() }
                      // listMessagef3
                    );
                    await sock.sendMessage(
                      msg.key.remoteJid,
                      {
                        text: "Silahkan kirim chat untuk memesan barang dengan format \n\n[nomer item]=[jumlah barang] \n\ncontoh : 10=25 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25) \n\nketik 0 untuk menyelesaikan pemesanan.",
                      }
                      // listMessagef3
                    );
                  });

                  break;
                case "d2":
                  // OSRAM 2W
                  console.log("OSRAM 2W");
                  axios.get(sheetItems + "OSRAM 2W").then(async (res) => {
                    const d = res.data;
                    catalogid.length = 0;
                    // console.log("ini 1 ", d);
                    let size = d.data.length;
                    console.log(size);
                    let arr = [];
                    for (let f = 0; f < size; f++) {
                      console.log("-", d.data[f].item_desc);
                      // if (res.data[f].type == "TL") {
                      p = d.data[f].sub_fix;
                      u = d.data[f].item_desc;
                      q = d.data[f].type;
                      id = d.data[f].item_no;
                      // if (!arr.includes(p)) {
                      n = arr.length + 1;
                      arr.push(n + " . " + p + " | " + u + " | " + q);
                      catalogid.push(id);
                      // }
                      // }
                    }
                    console.log(arr);
                    console.log("catalog id " + catalogid);
                    arr = arr.join("\n\n");
                    // route.push("order"); //masukin sesuai nomer wa nya
                    m = route.findIndex(
                      (x) =>
                        x.wa ===
                        msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    );
                    route[m].data = "orderItems";
                    // cart.data.push({
                    //   wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
                    // });
                    await sock.sendMessage(
                      msg.key.remoteJid,
                      { text: "----- Catalog Items -----\n" + arr.toString() }
                      // listMessagef3
                    );
                    await sock.sendMessage(
                      msg.key.remoteJid,
                      {
                        text: "Silahkan kirim chat untuk memesan barang dengan format \n\n[nomer item]=[jumlah barang] \n\ncontoh : 10=25 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25) \n\nketik 0 untuk menyelesaikan pemesanan.",
                      }
                      // listMessagef3
                    );
                  });
                  break;
                case "d3":
                  //OSRAM 4W
                  break;
                case "d4":
                  console.log("FDR plan B");
                  axios.get(sheetFDR).then(async (res) => {
                    const data = [res.data];
                    // console.log(data);
                    let size = res.data.length;
                    catalogid.length = 0;
                    // console.log(size);
                    let arr = [];
                    for (let f = 0; f < size; f++) {
                      // console.log(res.data[f].pattern);
                      // if (res.data[f].type == "TL") {
                      p = res.data[f].pattern;
                      u = res.data[f].ukuran;
                      id = res.data[f].kode;
                      // if (!arr.includes(p)) {
                      n = arr.length + 1;
                      arr.push(n + " . " + p + " | " + u);
                      catalogid.push(id);
                      // }
                      // }
                    }
                    console.log(arr);
                    console.log("catalog id " + catalogid);
                    arr = arr.join("\n");
                    // route.push("order"); //masukin sesuai nomer wa nya
                    m = route.findIndex(
                      (x) =>
                        x.wa ===
                        msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    );
                    route[m].data = "orderItems";
                    // cart.data.push({
                    //   wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
                    // });
                    await sock.sendMessage(
                      msg.key.remoteJid,
                      { text: "----- Catalog Items -----\n" + arr.toString() }
                      // listMessagef3
                    );
                    await sock.sendMessage(
                      msg.key.remoteJid,
                      {
                        text: "Silahkan kirim chat untuk memesan barang dengan format \n\n[nomer item]=[jumlah barang] \n\ncontoh : 10=25 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25) \n\nketik 0 untuk menyelesaikan pemesanan.",
                      }
                      // listMessagef3
                    );
                  });
                  break;
                // switch 5
                case "f3":
                  console.log("FDR Tubeless");
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
                        u = res.data[f].ukuran;
                        id = res.data[f].kode;
                        // if (!arr.includes(p)) {
                        n = arr.length + 1;
                        arr.push(n + " . " + p + " | " + u);
                        catalogid.push(id);
                        // }
                      }
                    }
                    console.log(arr);
                    console.log("catalog id " + catalogid);
                    arr = arr.join("\n");
                    // route.push("order"); //masukin sesuai nomer wa nya
                    m = route.findIndex(
                      (x) =>
                        x.wa ===
                        msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    );
                    route[m].data = "order";
                    // cart.data.push({
                    //   wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
                    // });
                    await sock.sendMessage(
                      msg.key.remoteJid,
                      { text: "------ Catalog Items ------\n" + arr.toString() }
                      // listMessagef3
                    );
                    await sock.sendMessage(
                      msg.key.remoteJid,
                      {
                        text: "Silahkan kirim chat untuk memesan barang dengan format \n\n[nomer item]=[jumlah barang] \n\ncontoh : 10=25 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25) \n\nketik 0 untuk menyelesaikan pemesanan.",
                      }
                      // listMessagef3
                    );
                  });
                  break;

                case "f1":
                  // FDR Part
                  // await sock.sendMessage(msg.key.remoteJid, {
                  //   text: "Mohon tunggu sebentar, data sedang disiapkan.",
                  // });
                  console.log("FDR Tubeless");
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
                  //confirm cart
                  //cancel order question
                  console.log(cart.data);
                  // route.splice(0);
                  // cart.data.splice(-1);
                  // console.log(route, cart.data);
                  m = route.findIndex(
                    (x) =>
                      x.wa === msg.key.remoteJid.replace("@s.whatsapp.net", "")
                  );
                  delete route[m].data;

                  const buttonsg1 = [
                    {
                      buttonId: "c1",
                      buttonText: { displayText: "Continue Shopping" },
                      type: 1,
                    },
                    {
                      buttonId: "g",
                      buttonText: { displayText: "Check Out" },
                      type: 1,
                    },
                  ];
                  // str = `Silahkan pilih Menu yang tersedia dibawah ini:`;
                  const buttonMessageg1 = {
                    text: "Silahkan pilih menu dibawah ini.",
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttonsg1,
                    headerType: 1,
                  };

                  const sendMsgg1 = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessageg1
                  );
                  break;
                case "g2":
                  await sock.sendMessage(
                    msg.key.remoteJid,
                    {
                      text: "#EDIT CART#\n Silahkan kirim chat untuk memesan barang dengan format \n\n[nomer item]=[jumlah barang] \n\ncontoh : 10=25 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25) \n\nketik 0 untuk menyelesaikan pemesanan.",
                    }
                    // listMessagef3
                  );
                  //change route
                  m = route.findIndex(
                    (x) =>
                      x.wa === msg.key.remoteJid.replace("@s.whatsapp.net", "")
                  );
                  route[m].data = "EditCart";
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
            } else if (
              route.some(
                (route) =>
                  route.wa ===
                    msg.key.remoteJid.replace("@s.whatsapp.net", "") &&
                  route.data === "order"
              )
            ) {
              console.log("---order---");
              console.log("route : ", route);
              console.log("cart : ", cart.data);
              no = msg.message.conversation;
              nos = msg.message.conversation.search;
              let ns,
                n = [];
              // if (cart.data.length === 0) {
              //   n = no.split("=");
              //   let idx = parseInt(n[0]) - 1;
              //   let qty = parseInt(n[1]);
              //   cart.data.push({
              //     wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
              //     item: catalogid[idx],
              //     qty: qty,
              //   });
              // }
              if (no.includes(",")) {
                ns = no.split(",");
                console.log(ns);
                for (let m = 0; m < ns.length; m++) {
                  // let n = [];
                  n = ns[m].split("=");
                  idx = parseInt(n[0]) - 1;
                  qty = parseInt(n[1]);
                  if (!isNaN(idx && qty)) {
                    o = cart.data.findIndex((e) => e.item === catalogid[idx]);
                    if (o != -1) {
                      console.log("ini apa nih");
                      console.log(o);
                      qtys = cart.data[o].qty + qty;
                      console.log("ini qtys " + qtys + "ini M " + o);
                      cart.data[o].qty = qtys;
                    } else {
                      console.log(o);
                      cart.data.push({
                        wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
                        item: catalogid[idx],
                        qty: qty,
                        idx: idx + 1,
                      });
                    }
                    // cart.data.push({
                    //   wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
                    //   item: catalogid[idx],
                    //   qty: qty,
                    // });
                  }
                }
              } else {
                n = no.split("=");
                let idx = parseInt(n[0]) - 1;
                let qty = parseInt(n[1]);
                if (!isNaN(idx && qty)) {
                  m = cart.data.findIndex((e) => e.item === catalogid[idx]);
                  if (m != -1) {
                    console.log("ini apa nih");
                    console.log(m);
                    qtys = cart.data[m].qty + qty;
                    console.log("ini qtys " + qtys + "ini M " + m);
                    cart.data[m].qty = qtys;
                  } else {
                    console.log(m);
                    cart.data.push({
                      wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
                      item: catalogid[idx],
                      qty: qty,
                      idx: idx + 1,
                    });
                  }
                  // console.log(e);

                  // } else {
                  //   console.log("masuk ini");
                  //   cart.data.push({
                  //     wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
                  //     item: catalogid[idx],
                  //     qty: qty,
                  //   });
                }
                if (qty == 00) {
                  m = cart.data.findIndex((e) => e.item === catalogid[idx]);
                  // delete cart.data[m];
                  cart.data.splice(m, 1);
                }
              }

              // q = cart.data.length;
              // console.log(catalogid[idx]);

              // carts = cart.data.filter((data) => data.item == catalogid[idx]);
              // console.log("ini carts = ", carts);

              // if (
              //   cart.data.some(
              //     (cart) =>
              //       cart.wa ===
              //         msg.key.remoteJid.replace("@s.whatsapp.net", "") &&
              //       cart.data === catalogid[idx]
              //   )
              // ) {
              //   m = cart.data.findIndex(
              //     (cart) =>
              //       cart.wa ===
              //         msg.key.remoteJid.replace("@s.whatsapp.net", "") &&
              //       cart.data === catalogid[idx]
              //   );
              //   console.log("ini m ="+m);
              //   qtys = cart.data[m].qty + qty;
              //   cart.data[m].qty = qtys;
              // }

              // for (let p = 0; p < q; p++) {
              //   console.log("test cart " + cart.data[p].item);
              //   cartitem = cart.data[p].item;
              //   if (
              //     cart.data[p].wa ==
              //     msg.key.remoteJid.replace("@s.whatsapp.net", "")
              //   ) {
              //     if (cartitem == catalogid[idx]) {
              //       qtys = cart.data[p].qty + qty;
              //       console.log(qtys);
              //       cart.data[p].qty = qtys;
              //       break;
              //     } else {

              //       // }
              //     }
              //   }
              //   // if ( == cart.data[p].item) {
              // }
              // if (msg.message.conversation.toUpperCase() === "SELESAI") {
              if (msg.message.conversation === "0") {
                axios.get(sheetFDR).then(async (resp) => {
                  console.log("Keranjang!");
                  l = cart.data.length;
                  j = resp.data.length;
                  keranjang = [];
                  subtotal = 0;
                  for (let i = 0; i < l; i++) {
                    if (
                      cart.data[i].wa ==
                      msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    ) {
                      for (let k = 0; k < j; k++)
                        if (cart.data[i].item == resp.data[k].kode) {
                          console.log("masuk");
                          console.log(resp.data[k]);
                          str = `${keranjang.length + 1} . ITEM : [${
                            cart.data[i].idx
                          }] ${resp.data[k].pattern} | ${
                            resp.data[k].ukuran
                          } | QTY : ${cart.data[i].qty}`;
                          // @ ${formatterRp.format(
                          // resp.data[k].harga)}
                          // subtotal =
                          //   subtotal + resp.data[k].harga * cart.data[i].qty;
                          keranjang.push(str);
                        }
                    }
                  }
                  keranjang = keranjang.join("\n\n");
                  console.log(keranjang);

                  const buttonord = [
                    {
                      buttonId: "g1",
                      buttonText: { displayText: "Confirm Cart" },
                      type: 1,
                    },
                    {
                      buttonId: "g2",
                      buttonText: { displayText: "Add to Cart" },
                      type: 1,
                    },
                  ];
                  const buttonMessageord = {
                    text: "### Keranjang 🛒 ###\n\n" + keranjang.toString(),
                    // "\n\nSubtotal : " +
                    // formatterRp.format(subtotal),
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttonord,
                    headerType: 1,
                  };

                  const sendMsgord = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessageord
                  );
                });
              }
              // cart.data[m].item = catalogid[idx];
              // if(text.search("/") != -1){
              //   console.log("true");
              // }else{
              // console.log("false");
              // }
              // console.log(no.split("/"));
            } else if (
              route.some(
                (route) =>
                  route.wa ===
                    msg.key.remoteJid.replace("@s.whatsapp.net", "") &&
                  route.data === "orderItems"
              )
            ) {
              console.log("---Order Items---");
              console.log("route : ", route);
              console.log("cart : ", cart.data);
              no = msg.message.conversation;
              nos = msg.message.conversation.search;
              let ns,
                n = [];
              if (no.includes(",")) {
                ns = no.split(",");
                console.log(ns);
                for (let m = 0; m < ns.length; m++) {
                  // let n = [];
                  n = ns[m].split("=");
                  idx = parseInt(n[0]) - 1;
                  qty = parseInt(n[1]);
                  if (!isNaN(idx && qty)) {
                    o = cart.data.findIndex(
                      (e) =>
                        e.item === catalogid[idx] &&
                        e.wa == msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    );
                    if (o != -1) {
                      console.log("ini apa nih");
                      console.log(o);
                      qtys = cart.data[o].qty + qty;
                      console.log("ini qtys " + qtys + "ini M " + o);
                      cart.data[o].qty = qtys;
                    } else {
                      console.log(o);
                      cart.data.push({
                        wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
                        item: catalogid[idx].toString(),
                        idx: idx + 1,
                        qty: qty,
                      });
                    }
                  }
                }
              } else {
                n = no.split("=");
                let idx = parseInt(n[0]) - 1;
                let qty = parseInt(n[1]);
                if (!isNaN(idx && qty)) {
                  m = cart.data.findIndex(
                    (e) =>
                      e.item == catalogid[idx] &&
                      e.wa == msg.key.remoteJid.replace("@s.whatsapp.net", "")
                  );
                  if (m != -1) {
                    console.log("ini apa nih");
                    console.log(m);
                    qtys = cart.data[m].qty + qty;
                    console.log("ini qtys " + qtys + "ini M " + m);
                    cart.data[m].qty = qtys;
                  } else {
                    console.log(m);
                    cart.data.push({
                      wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
                      item: catalogid[idx].toString(),
                      idx: idx + 1,
                      qty: qty,
                    });
                  }
                }
                if (qty == 00) {
                  m = cart.data.findIndex(
                    (e) =>
                      e.item === catalogid[idx] &&
                      e.wa == msg.key.remoteJid.replace("@s.whatsapp.net", "")
                  );
                  // delete cart.data[m];
                  cart.data.splice(m, 1);
                }
              }
              if (msg.message.conversation === "0") {
                axios.get(sheetAllItems).then(async (resp) => {
                  console.log("Keranjang!");
                  // console.log("data s + ", resp.data);
                  const d = resp.data;
                  l = cart.data.length;
                  j = d.data.length;
                  keranjang = [];
                  subtotal = 0;
                  for (let i = 0; i < l; i++) {
                    if (
                      cart.data[i].wa ==
                      msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    ) {
                      for (let k = 0; k < j; k++)
                        if (cart.data[i].item == d.data[k].item_no) {
                          console.log("masuk");
                          console.log(d.data[k]);
                          str = `${keranjang.length + 1} . [${
                            d.data[k].item_group
                          }] : [${cart.data[i].idx}] ${d.data[k].sub_fix} | ${
                            d.data[k].item_desc
                          } | QTY : ${cart.data[i].qty}`;
                          // @ ${formatterRp.format(
                          // resp.data[k].harga)}
                          // subtotal =
                          //   subtotal + resp.data[k].harga * cart.data[i].qty;
                          keranjang.push(str);
                        }
                    }
                  }
                  keranjang = keranjang.join("\n\n");
                  console.log(keranjang);

                  const buttonord = [
                    {
                      buttonId: "g1",
                      buttonText: { displayText: "Confirm Cart" },
                      type: 1,
                    },
                    {
                      buttonId: "g2",
                      buttonText: { displayText: "Edit Cart" },
                      type: 1,
                    },
                  ];
                  const buttonMessageord = {
                    text: "### Keranjang 🛒 ###\n\n" + keranjang.toString(),
                    // "\n\nSubtotal : " +
                    // formatterRp.format(subtotal),
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttonord,
                    headerType: 1,
                  };

                  const sendMsgord = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessageord
                  );
                });
              }
            } else if (
              route.some(
                (route) =>
                  route.wa ===
                    msg.key.remoteJid.replace("@s.whatsapp.net", "") &&
                  route.data === "EditCart"
              )
            ) {
              //edit chart
              console.log("---Edit Cart---");
              console.log("route : ", route);
              console.log("cart : ", cart.data);
              l = cart.data.length;

              for (let i = 0; i < l; i++) {
                if (
                  cart.data[i].wa ==
                  msg.key.remoteJid.replace("@s.whatsapp.net", "")
                ) {
                  console.log(i + " . " + cart.data[i].item);
                }
              }
              no = msg.message.conversation;
              n = no.split("=");
              let idx = parseInt(n[0]) - 1;
              let qty = parseInt(n[1]);
              if (!isNaN(idx && qty)) {
                console.log("ini apa nih");
                // console.log(m);
                qtys = cart.data[idx].qty + qty;
                console.log("ini qtys " + qtys + "ini M " + m);
                cart.data[idx].qty = qtys;
                if (m != -1) {
                }
              }
              if (qty == 00) {
                m = cart.data.findIndex(
                  (e) =>
                    e.item === catalogid[idx] &&
                    e.wa == msg.key.remoteJid.replace("@s.whatsapp.net", "")
                );
                // delete cart.data[m];
                cart.data.splice(m, 1);
              }
              if (msg.message.conversation === "0") {
                axios.get(sheetAllItems).then(async (resp) => {
                  console.log("Keranjang!");
                  // console.log("data s + ", resp.data);
                  const d = resp.data;
                  l = cart.data.length;
                  j = d.data.length;
                  keranjang = [];
                  subtotal = 0;
                  for (let i = 0; i < l; i++) {
                    if (
                      cart.data[i].wa ==
                      msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    ) {
                      for (let k = 0; k < j; k++)
                        if (cart.data[i].item == d.data[k].item_no) {
                          console.log("masuk");
                          console.log(d.data[k]);
                          str = `${keranjang.length + 1} . [${
                            d.data[k].item_group
                          }] : [${cart.data[i].idx}] ${d.data[k].sub_fix} | ${
                            d.data[k].item_desc
                          } | QTY : ${cart.data[i].qty}`;
                          // @ ${formatterRp.format(
                          // resp.data[k].harga)}
                          // subtotal =
                          //   subtotal + resp.data[k].harga * cart.data[i].qty;
                          keranjang.push(str);
                        }
                    }
                  }
                  keranjang = keranjang.join("\n\n");
                  console.log(keranjang);

                  const buttonord = [
                    {
                      buttonId: "g1",
                      buttonText: { displayText: "Confirm Cart" },
                      type: 1,
                    },
                    {
                      buttonId: "g2",
                      buttonText: { displayText: "Edit Cart" },
                      type: 1,
                    },
                  ];
                  const buttonMessageord = {
                    text: "### Keranjang 🛒 ###\n\n" + keranjang.toString(),
                    // "\n\nSubtotal : " +
                    // formatterRp.format(subtotal),
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttons: buttonord,
                    headerType: 1,
                  };

                  const sendMsgord = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessageord
                  );
                });
              }
            }
          } else if (
            route.some(
              (route) =>
                route.wa === msg.key.remoteJid.replace("@s.whatsapp.net", "") &&
                route.data === "Cart"
            )
          ) {
            axios.get(sheetAllItems).then(async (resp) => {
              console.log("Keranjang!");
              // console.log("data s + ", resp.data);
              const d = resp.data;
              l = cart.data.length;
              j = d.data.length;
              keranjang = [];
              subtotal = 0;
              for (let i = 0; i < l; i++) {
                if (
                  cart.data[i].wa ==
                  msg.key.remoteJid.replace("@s.whatsapp.net", "")
                ) {
                  for (let k = 0; k < j; k++)
                    if (cart.data[i].item == d.data[k].item_no) {
                      console.log("masuk");
                      console.log(d.data[k]);
                      str = `${keranjang.length + 1} . [${
                        d.data[k].item_group
                      }] : [${cart.data[i].idx}] ${d.data[k].sub_fix} | ${
                        d.data[k].item_desc
                      } | QTY : ${cart.data[i].qty}`;
                      // @ ${formatterRp.format(
                      // resp.data[k].harga)}
                      // subtotal =
                      //   subtotal + resp.data[k].harga * cart.data[i].qty;
                      keranjang.push(str);
                    }
                }
              }
              keranjang = keranjang.join("\n\n");
              console.log(keranjang);

              const buttonord = [
                {
                  buttonId: "g1",
                  buttonText: { displayText: "Confirm Cart" },
                  type: 1,
                },
                {
                  buttonId: "g2",
                  buttonText: { displayText: "Edit Cart" },
                  type: 1,
                },
              ];
              const buttonMessageord = {
                text: "### Keranjang 🛒 ###\n\n" + keranjang.toString(),
                // "\n\nSubtotal : " +
                // formatterRp.format(subtotal),
                footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                buttons: buttonord,
                headerType: 1,
              };

              const sendMsgord = await sock.sendMessage(
                msg.key.remoteJid,
                buttonMessageord
              );
            });
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
