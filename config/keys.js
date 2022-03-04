
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


module.exports = {
    mongoURI : ("mongodb+srv://anurag4992:Anhourlat6@cluster0.j80jq.mongodb.net/userDB"),
    PORT : port
}