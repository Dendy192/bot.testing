// desc package
const {
  default: makeWASocket,
  updateMessageWithReaction,
} = require("@adiwajshing/baileys");
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

//padding func number
function pad(number, length) {
  var str = "" + number;
  while (str.length < length) {
    str = "0" + str;
  }

  return str;
}
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
const sheetOrder =
  "https://script.google.com/macros/s/AKfycby8BtWs_EOk3GZLlDHZVB3cXf17Rfld2zUyTlkwQn1oprRaHYFJkj_KRNZsfdBpoMoR/exec";
const sheetInsertOrder =
  "https://script.google.com/macros/s/AKfycbwoSY3yq-U3g5MMCn0rRAV8A7R0d4kAbn04XxDlP4U7Lag0AzUr2AjXOcqE3Pix-2ec/exec?action=";
const sheetInsertOrderDetail =
  "https://script.google.com/macros/s/AKfycbz6IdQVNHzyqBKbmKpM5YMZL3soJnQcMLrCyTQxT_yO9QM50xjsweKcgMnDQiva8FOo/exec?action=";
const sheet1 =
  "https://script.google.com/macros/s/AKfycbwvMuUIwKJCzmbGV61S9zG5DijC8dfqfkH8sf6yGC7UNZyljiVL8JodmsAJAB7U86qq/exec?whatsapp=";
const sheetFDR =
  "https://script.google.com/macros/s/AKfycbz62hnwLdv-t9oMqZ3L9F5t4b765T_4tjNX_M7rXoxCyM3083jEB8xiWsN8i9PNt9NQ/exec";
const codeFdr =
  "https://script.google.com/macros/s/AKfycbyQtsLYfQGg6rzqkrI8LEzd_fuKCSM0GXNrprqTZMSI02Wi_-ZcYEWnb4wr1gwxkxvf/exec?kode=";
const APIoutlet = "http://103.150.93.164:8080/api/outlet?phone=";
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

      // clear();

      // clear();

      //cart function
      function cartFunc() {
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
            text: "##### Keranjang 🛒 #####\n\n" + keranjang.toString(),
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
      function oid() {
        axios.get(sheetOrder).then(async (resp) => {
          const id = resp.data.data;
          console.log(pad(id.length + 1, 4));
          const today = new Date();
          dd = pad(today.getDate(), 2);
          mm = pad(today.getMonth() + 1, 2);
          yy = today.getFullYear().toString().substr(-2);
          const orderid = `STPO-${yy}${mm}-${dd}${pad(id.length + 1, 4)}`;
          console.log("orderid", orderid);
          // return;
        });
      }
      // app.use(
      //   session({
      //     secret: "StarpartOrderBot",
      //     resave: false,
      //     saveUninitialized: true,
      //   })
      // );

      if (msg.key.remoteJid.includes("@s.whatsapp.net")) {
        // console.log(myTime);

        if (msg.message) {
          // if (msg.message.buttonsResponseMessage.selectedButtonId =="b1") {
          // } else {

          // timeout;
          // const myTime = setTimeout(timeouts, 5000);
          // function timeouts() {
          //   // clear();
          //   route.length = 0;
          //   // console.log(myTime);
          //   console.log("closed");
          //   sock.sendMessage(msg.key.remoteJid, {
          //     text: "Sesi anda telah berakhir",
          //   });
          // }
          // function clear() {
          //   clearTimeout(myTime);
          // }
          // console.log(myTime._idleTimeout);
          // clearTimeout(myTime);
          let items = msg.message.buttonsResponseMessage?.selectedButtonId;
          console.log("items : " + items);
          console.log("Route : " + JSON.stringify(route));
          // const botButton =
          //  msg.message.buttonsResponseMessage?.selectedButtonId;
          const listReplay = msg.message.listResponseMessage?.title;
          const code =
            msg.message.listResponseMessage?.singleSelectReply.selectedRowId;
          // const wa = msg.message.remoteJid;
          if (items == "a") {
            route.push({
              wa: msg.key.remoteJid.replace("@s.whatsapp.net", ""),
            });
            // Order ID: STPO-2302-020001
            // route.push(msg.key.remoteJid.replace("@s.whatsapp.net", ""));
            const myTime = setTimeout(timeouts, 60 * 60000);
            function timeouts() {
              // clear();
              route.length = 0;
              // console.log(myTime);
              console.log("closed");
              sock.sendMessage(msg.key.remoteJid, {
                text: "Sesi anda telah berakhir",
              });
            }
            function clear() {
              clearTimeout(myTime);
            }
            axios
              // .get(APIoutlet + msg.key.remoteJid.replace("@s.whatsapp.net", ""))
              .get(sheet1 + msg.key.remoteJid.replace("@s.whatsapp.net", ""))
              .then(async (response) => {
                console.log(response.data);
                // const { success, data } = response.data.data;
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
                      buttonText: { displayText: "Cetak AR" },
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

                  oid();
                  const sendMsg = await sock.sendMessage(
                    msg.key.remoteJid,
                    buttonMessage
                  );
                  // break;
                } else {
                  await sock.sendMessage(msg.key.remoteJid, {
                    text: "Mohon maaf nomor anda belum terdaftar di aplikasi ini, \nsilahkan menghubungi sales kami.",
                  });
                  clear();
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
                case "b2":
                  axios
                    .get(
                      "http://103.150.93.164:8080/api/AR?id=BDG000024&name=ALEX SPORT RACING&phone=" +
                        msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    )
                    // )
                    .then(async (response) => {
                      console.log(response.data);
                      const { success, data } = response.data;
                      // console.log(data.COMPANY_NAME);
                    });
                  // axios
                  //   .post("http://103.150.93.164:8080/api/AR?", {
                  //     id: "BDG000024",
                  //     name: "ALEX SPORT RACING",
                  //     phone: 628872034137,
                  //   })
                  //   .then(async (response) => {
                  //     // console.log("respon ", response);
                  //     await sock.sendMessage(
                  //       msg.key.remoteJid,
                  //       { text: "Terimakasih Banyak Atas Orderan anda" }
                  //       // listMessagef3
                  //     );
                  //   });
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
                        text: "Silahkan kirim chat untuk memesan barang dengan format \n\n[nomer item]=[jumlah barang] \n\ncontoh : 10=25 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25) \n\ncontoh : 10=25,15=20 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25 dan item nomer 15, dengan jumlah barang 20)",
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
                        text: "Silahkan kirim chat untuk memesan barang dengan format \n\n[nomer item]=[jumlah barang] \n\ncontoh : 10=25 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25) \n\ncontoh : 10=25,15=20 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25 dan item nomer 15, dengan jumlah barang 20)",
                      }
                      // listMessagef3
                    );
                  });
                  break;
                case "d3":
                  //OSRAM 4W
                  console.log("OSRAM 4W");
                  const sections = [
                    {
                      rows: [
                        { title: "HALOGEN", rowId: "Halogen" },
                        { title: "HID", rowId: "HID" },
                        { title: "SIGNAL LAMP/LED", rowId: "Signal" },
                        { title: "LED", rowId: "LED" },
                        { title: "WIPER", rowId: "Wiper" },
                      ],
                    },
                  ];

                  const listMessage = {
                    text: "Silahkan pilih list",
                    title: "List Kategori OSRAM 4W",
                    footer: "StarPart Motor ~ The Bigest Supplier in West Java",
                    buttonText: "Osram 4W",
                    sections,
                  };

                  const sendMsg = await sock.sendMessage(
                    msg.key.remoteJid,
                    listMessage
                  );
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
                        text: "Silahkan kirim chat untuk memesan barang dengan format \n\n[nomer item]=[jumlah barang] \n\ncontoh : 10=25 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25) \n\ncontoh : 10=25,15=20 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25 dan item nomer 15, dengan jumlah barang 20)",
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
                        text: "Silahkan kirim chat untuk memesan barang dengan format \n\n[nomer item]=[jumlah barang] \n\ncontoh : 10=25 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25) \n\ncontoh : 10=25,15=20 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25 dan item nomer 15, dengan jumlah barang 20)",
                      }
                      // listMessagef3
                    );
                  });
                  break;
                  //switch 6

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
                  console.log(cart.data);
                  // route.splice(0);
                  // cart.data.splice(-1);
                  // console.log(route, cart.data);
                  m = route.findIndex(
                    (x) =>
                      x.wa === msg.key.remoteJid.replace("@s.whatsapp.net", "")
                  );
                  // route[m].total_item = cart[m].data.length;
                  delete route[m].data;

                  const buttonsg1 = [
                    {
                      buttonId: "c1",
                      buttonText: { displayText: "Continue Shopping" },
                      type: 1,
                    },
                    {
                      buttonId: "h1",
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
                      text: "###### EDIT CART ######\n Silahkan kirim chat untuk mengubah barang yang telah dipesan dengan format \n\n[nomer cart]=[jumlah barang yang ingin ditambah/dikurang/dihapus] \n\ncontoh : 2=-5 *-mengurangi barang* \n(anda mengubah cart nomer 2, dengan mengurangi jumlah barang 5) \n\ncontoh : 1=10 *-menambah barang* \n(anda mengubah cart nomer 1, dengan menambah jumlah barang 10) \n\ncontoh : 3=00 *-menghapus barang* \n(anda akan menghapus cart nomor 3 dari keranjang).",
                    }
                    // listMessagef3
                  );
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
                  // cart
                  cartFunc();
                  break;
                // switch
                case "h1":
                  //check out
                  axios.get(sheetAllItems).then(async (resp) => {
                    console.log("Keranjang!");
                    // console.log("data s + ", resp.data);
                    const d = resp.data;
                    l = cart.data.length;
                    j = d.data.length;
                    keranjang = [];
                    subtotal = 0;
                    total_item = 0;
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
                            } | QTY : ${
                              cart.data[i].qty
                            } @ ${formatterRp.format(d.data[k].harga)}`;
                            subtotal =
                              subtotal + d.data[k].harga * cart.data[i].qty;
                            keranjang.push(str);
                            console.log("asik" + keranjang.length);
                            total_item = keranjang.length;
                          }
                      }
                    }
                    m = route.findIndex(
                      (x) =>
                        x.wa ===
                        msg.key.remoteJid.replace("@s.whatsapp.net", "")
                    );
                    route[m].subtotal = subtotal;
                    route[m].total_item = total_item;
                    keranjang = keranjang.join("\n\n\n");
                    console.log(keranjang);

                    const buttonord = [
                      {
                        buttonId: "h2",
                        buttonText: { displayText: "Ya" },
                        type: 1,
                      },
                      {
                        buttonId: "g4",
                        buttonText: { displayText: "Cancel" },
                        type: 1,
                      },
                    ];
                    const buttonMessageord = {
                      text:
                        "##### Check Out 🛒 #####\n\n" +
                        keranjang.toString() +
                        "\n\nSubtotal : " +
                        formatterRp.format(subtotal) +
                        "\n\nApakah anda yakin akan melakukan orderan ini?",
                      footer:
                        "StarPart Motor ~ The Bigest Supplier in West Java",
                      buttons: buttonord,
                      headerType: 1,
                    };

                    const sendMsgord = await sock.sendMessage(
                      msg.key.remoteJid,
                      buttonMessageord
                    );
                  });
                  break;
                case "h2":
                  console.log("send data to db..");
                  m = route.findIndex(
                    (x) =>
                      x.wa === msg.key.remoteJid.replace("@s.whatsapp.net", "")
                  );
                  console.log(route[m].subtotal);
                  console.log(route[m].total_item);
                  const wa = msg.key.remoteJid.replace("@s.whatsapp.net", "");
                  // const orderid
                  axios.get(sheetOrder).then((resp) => {
                    const id = resp.data.data;
                    console.log(pad(id.length + 1, 4));
                    const today = new Date();
                    dd = pad(today.getDate(), 2);
                    mm = pad(today.getMonth() + 1, 2);
                    yy = today.getFullYear().toString().substr(-2);
                    const orderid = `STPO-${yy}${mm}-${dd}${pad(
                      id.length + 1,
                      4
                    )}`;
                    console.log("orderid", orderid);

                    axios.get(sheetAllItems).then((resp) => {
                      console.log("Keranjang!");
                      // console.log("data s + ", resp.data);
                      const d = resp.data;
                      const ord = { data: [] };
                      l = cart.data.length;
                      j = d.data.length;
                      keranjang = [];
                      subtotal = 0;
                      for (let i = 0; i < l; i++) {
                        if (
                          cart.data[i].wa ==
                          msg.key.remoteJid.replace("@s.whatsapp.net", "")
                        ) {
                          // for (let k = 0; k < j; k++)
                          //   if (cart.data[i].item == d.data[k].item_no) {
                          // console.log("masuk");
                          // console.log(d.data[k]);
                          // str = `${keranjang.length + 1} . [${
                          //   d.data[k].item_group
                          // }] : [${cart.data[i].idx}] ${d.data[k].sub_fix} | ${
                          //   d.data[k].item_desc
                          // } | QTY : ${cart.data[i].qty}`;
                          // @ ${formatterRp.format(
                          // resp.data[k].harga)}
                          // subtotal =
                          //   subtotal + resp.data[k].harga * cart.data[i].qty;
                          // keranjang.push(str);
                          //order detail
                          ord.orderid = orderid;
                          ord.wa = wa;
                          ord.total_item = route[m].total_item;
                          ord.total = route[m].subtotal;
                          ord.times = Date.now();
                          ord.data.push({
                            orderid: orderid,
                            wa: wa,
                            item: cart.data[i].item,
                            qty: cart.data[i].qty,
                          });
                          // }
                        }
                      }
                      obj = Object.assign({}, ...ord.data);
                      console.log("--", ord.data);
                      console.log("==", ord);
                      times = Date.now();
                      axios
                        .all([
                          axios({
                            method: "post",
                            url: sheetInsertOrder + "insert",
                            headers: {},
                            data: {
                              orderid: orderid,
                              wa: wa,
                              total_item: route[m].total_item,
                              total: route[m].subtotal,
                              times: times,
                            },
                          }),
                          axios({
                            method: "post",
                            url: sheetInsertOrderDetail + "insert",
                            headers: {},
                            data: obj,
                          }),
                        ])
                        .then(
                          axios.spread((data1, data2) => {
                            // output of req.
                            // console.log("data1", data1, "data2", data2);
                            sock.sendMessage(msg.key.remoteJid, {
                              text: "Terimakasih Banyak Atas Orderan anda",
                            });
                          })
                        );
                      // axios({
                      //   method: "post",
                      //   url: sheetInsertOrderDetail + "insert",
                      //   headers: {},
                      //   data: ord.data,
                      //   //  {
                      //   //   orderid: orderid,
                      //   //   wa: wa,
                      //   //   item: cart.data[i].item,
                      //   //   qty: cart.data[i].qty, // This is the body part
                      //   // },
                      // })
                      // axios
                      //   .post(sheetInsertOrderDetail + "insert", {

                      // orderid: orderid,
                      // wa: wa,
                      // item: cart.data[i].item,
                      // qty: cart.data[i].qty,
                      //   })
                      // .then(
                      //   console.log(
                      //     "send data to order detail.. ",
                      //     ord.data
                      //   )
                      // )
                      //   (res) => {
                      // await(console.log(res.data));
                      // })
                      // .catch(function (error) {
                      //   // your action on error success
                      //   console.log(error);
                      // });
                      // keranjang = keranjang.join("\n\n");
                      // console.log(keranjang);

                      // console.log(times);
                      // axios
                      //   .post(sheetInsertOrder + "insert", {
                      //     orderid: orderid,
                      //     wa: wa,
                      //     total_item: route[m].total_item,
                      //     total: route[m].subtotal,
                      //     times: times,
                      //   })
                      //   .then(
                      //     // console.log("respon ", response);
                      //     console.log("send data to order")
                      //     // await sock.sendMessage(msg.key.remoteJid, {
                      //     //   text: "Terimakasih Banyak Atas Orderan anda",
                      //     // })
                      //   );
                    });
                    // return;
                  });
                  // .then(
                  //   await sock.sendMessage(msg.key.remoteJid, {
                  //     text: "Terimakasih Banyak Atas Orderan anda",
                  //   })
                  // );
                  break;
              }

              // } else {
            } else if (code) {
              console.log(code);
              axios.get(sheetItems + "OSRAM 4W").then(async (res) => {
                const data = res.data.data;
                l = data.length;
                console.log(l);
                catalogid.length = 0;
                let arr = [];
                for (i = 0; i < l; i++) {
                  j = data[i].sub_fix;
                  j = j.split(" ");
                  if (j[0].match(code.toUpperCase())) {
                    console.log(j);
                    console.log("-", data[i].item_desc);
                    // if (res.data[f].type == "TL") {
                    p = data[i].sub_fix;
                    u = data[i].item_desc;
                    q = data[i].type;
                    id = data[i].item_no;
                    // if (!arr.includes(p)) {
                    n = arr.length + 1;
                    arr.push(n + " . " + p + " | " + u + " | " + q);
                    catalogid.push(id);
                  }
                }
                console.log(arr);
                console.log("catalog id " + catalogid);
                arr = arr.join("\n\n");
                // route.push("order"); //masukin sesuai nomer wa nya
                m = route.findIndex(
                  (x) =>
                    x.wa === msg.key.remoteJid.replace("@s.whatsapp.net", "")
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
                    text: "Silahkan kirim chat untuk memesan barang dengan format \n\n[nomer item]=[jumlah barang] \n\ncontoh : 10=25 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25) \n\ncontoh : 10=25,15=20 **tanpa spasi** \n(anda memesan item nomer 10, dengan jumlah barang 25 dan item nomer 15, dengan jumlah barang 20)",
                  }
                  // listMessagef3
                );
              });
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
              axios.get(sheetOrder).then(async (resp) => {
                const id = resp.data.data;
                console.log(pad(id.length + 1, 4));
                const today = new Date();
                dd = pad(today.getDate(), 2);
                mm = pad(today.getMonth() + 1, 2);
                yy = today.getFullYear().toString().substr(-2);
                const orderid = `STPO-${yy}${mm}-${dd}${pad(id.length, 4)}`;
                console.log("orderid", orderid);
                // return;
              });
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
                        // oid: orderid,
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
                      // oid: orderid,
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
              cartFunc();
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
                    text: "##### Keranjang 🛒 #####\n\n" + keranjang.toString(),
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
                // if (m != -1) {
                // }
                if (qty == 00) {
                  m = cart.data.findIndex(
                    (e) =>
                      e.item === cart.data[idx].item &&
                      e.wa == msg.key.remoteJid.replace("@s.whatsapp.net", "")
                  );
                  // delete cart.data[m];
                  console.log("1--", cart.data[idx].item);
                  cart.data.splice(m, 1);
                  // cartFunc();
                }
                cartFunc();
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
                    text: "##### Keranjang 🛒 #####\n\n" + keranjang.toString(),
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
