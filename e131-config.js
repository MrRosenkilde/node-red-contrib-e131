const dgram = require('dgram');

module.exports = function (RED) {
    function e131_configNode(n) {
        const _socket = dgram.createSocket('udp4');
        RED.nodes.createNode(this, n);

        this.name = n.name;
        this.universe = Number(n.universe);
        this.universe_size = Number(n.universe_size);
        this.port = n.port;
        this.ip = n.ip;
        this.send = function (payload) {
            _socket.send(payload, this.port, this.ip);
        }
    }
    RED.nodes.registerType("e131-config", e131_configNode);
}
//module.exports = function (RED) {
//    function RemoteServerNode(n) {
//        RED.nodes.createNode(this, n);
//        this.host = n.host;
//        this.port = n.port;
//    }
//    RED.nodes.registerType("remote-server", RemoteServerNode);
//}