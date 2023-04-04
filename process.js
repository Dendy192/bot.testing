const { default: axios } = require("axios");

function orderFunc(str, msg, response) {
  var sheet1 =
    "https://script.google.com/macros/s/AKfycbwvMuUIwKJCzmbGV61S9zG5DijC8dfqfkH8sf6yGC7UNZyljiVL8JodmsAJAB7U86qq/exec?whatsapp=";
  axios
    .get(sheet1 + msg.key.remoteJid.replace("@s.whatsapp.net", ""))
    .then(async (response) => {
      console.log(response.data);
      //kirim data
      const { data } = response.data;
      let str;

      str = `Hallo kak ${data.nama}! \n\nStatus pembayaran anda \nNo Order : ${data.no_order} \nJenis Barang : ${data.jenis_barang} \nJumlah : ${data.jumlah} \nTotal : ${data.total_bayar} \n\nStatus : ${data.status} \nTerima Kasih telah belanja di toko kami.`;
      return str, response;
    });
}
