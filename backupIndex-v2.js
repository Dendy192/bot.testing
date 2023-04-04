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

          axios
            .get(sheet1 + msg.key.remoteJid.replace("@s.whatsapp.net", ""))
            .then(async (response) => {
              // console.log(response.data);
              const { success } = response.data;
              if (success) {
                let items =
                  msg.message.buttonsResponseMessage?.selectedButtonId;
                console.log("items = " + items);
                if (msg.message.buttonsResponseMessage?.selectedButtonId) {
                  // order switch
                  switch (items) {
                    case "b1":
                      // items part
                      const buttons = [
                        {
                          buttonId: "c1",
                          buttonText: { displayText: "FDR" },
                          type: 1,
                        },
                        {
                          buttonId: "c2",
                          buttonText: { displayText: "OSRAM 2W" },
                          type: 1,
                        },
                        {
                          buttonId: "c3",
                          buttonText: { displayText: "OSRAM 4W" },
                          type: 1,
                        },
                      ];
                      str = `Hallo ka ${msg.pushName}! \n\nSilahkan pilih Product kami yang tersedia dibawah ini:`;
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
                      break;
                  }
                  // items switch
                  switch (items) {
                    case "c1":
                      // FDR Part
                      console.log("FDR");
                      axios.get(sheetFDR).then(async (response) => {
                        const { data } = response.data;
                        console.log(response.data[0].name);
                        let size = response.data.length;
                        let arr = [];
                        for (let f = 0; f < size; f++) {
                          strfdr = `Name: FDR ${response.data[f].name} | Type : ${response.data[f].type}\n`;
                          // arr.join("-");
                          arr.push(strfdr);
                        }
                        arr = arr.join("");
                        console.log("arr = " + arr.toString());
                        await sock.sendMessage(msg.key.remoteJid, {
                          // text: "### FDR ITEMS ###",
                          text: "### FDR ITEMS ###\n" + arr.toString(),
                        });
                      });
                      // .catch((err) => {
                      //   console.log(err);
                      // });
                      break;
                    case "c2":
                      // OSRAM 2W
                      break;
                    case "c3":
                      //OSRAM 4W
                      break;
                  }
                } else {
                  const buttons = [
                    {
                      buttonId: "b1",
                      buttonText: { displayText: "Order" },
                      type: 1,
                    },
                    // {
                    //   buttonId: "b2",
                    //   buttonText: { displayText: "Exit" },
                    //   type: 1,
                    // },
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
              } else {
                await sock.sendMessage(msg.key.remoteJid, {
                  text: "Mohon maaf nomor anda belum terdaftar di aplikasi ini, \nsilahkan menghubungi sales kami.",
                });
              }
            });
        }
      }
    }
  });
};

startSock();
