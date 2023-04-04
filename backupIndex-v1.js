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
      var orders =
        msg.message.conversation == ""
          ? msg.message.extendedTextMessage.text.toUpperCase()
          : msg.message.conversation.toLocaleUpperCase();
      // console.log("data jason" + JSON.stringify(msg));
      if (msg.key.remoteJid.includes("@s.whatsapp.net")) {
        if (msg.message) {
          if (orders == "ORDER") {
            //cek api dan nomor
            axios
              .get(sheet1 + msg.key.remoteJid.replace("@s.whatsapp.net", ""))
              .then(async (response) => {
                console.log(response.data);
                //kirim data
                const { success, data, message } = response.data;
                let str;
                if (success) {
                  str = `Hallo kak ${msg.pushName}! \n\nStatus pembayaran anda \nNo Order : ${data.no_order} \nJenis Barang : ${data.jenis_barang} \nJumlah : ${data.jumlah} \nTotal : ${data.total_bayar} \n\nStatus : ${data.status} \nTerima Kasih telah belanja di toko kami.`;
                  await sock.sendMessage(msg.key.remoteJid, {
                    text: str,
                  });
                } else {
                  await sock.sendMessage(msg.key.remoteJid, {
                    text: "Mohon maaf nomor anda belum terdaftar di aplikasi ini, \nsilahkan menghubungi sales kami.",
                  });
                }
              });
          } else {
            // send a buttons message!
            const buttons = [
              {
                buttonId: "order",
                buttonText: { displayText: "Order" },
                type: 1,
              },
            ];

            const buttonMessage = {
              text: "Selamat Datang di StarPart. \n\nIni Robot Order. \n\nSilahkan pilih button dibawah ini untuk melakukan pemesanan.",
              footer: "StarPart Motor ~ The Bigest Supplier in west",
              buttons: buttons,
              headerType: 1,
            };

            const sendMsg = await sock.sendMessage(
              msg.key.remoteJid,
              buttonMessage
            );

            // await sock.sendMessage(msg.key.remoteJid, {
            //   text: 'Selamat Datang di StarPart. \n\nIni Robot Order. \n\nSilahkan tulis "Order" untuk melakukan pemesanan.',
            // });
          }
        }
      }
    }
  });
};

startSock();
