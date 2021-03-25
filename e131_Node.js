const wasm = require ('./e131.js')


module.exports = function(RED){
	function E131Node (config){
		RED.nodes.createNode(this, config);
		const node = this;
		wasm().then(inst => {
			node.on('input', function (msg) {
				//if (!Array.isArray(msg.payload)) {
				//	node.warn("[E131] expected msg.payload to be of type array");
				//	node.warn(msg.payload);
				//	return
				//}
				const output_configuration = RED.nodes.getNode(config.output_configuration);
				const base_package_size = 126;
				const universe =	  output_configuration.universe;
				const universe_size = output_configuration.universe_size;
				const package_size =  base_package_size + universe_size;
				const input = msg.payload;
				const universes = Math.floor(input.length / universe_size);
				const overflow	= input.length % universe_size;
				const has_overflow = (overflow != 0);
				const output_size = package_size * universes + ((overflow + base_package_size) * has_overflow);
				const output_pointer = inst._malloc(output_size);
				const input_pointer =  inst._malloc(input.length);

				inst.HEAPU8.set(
					input,
					input_pointer
				);

				inst._makePackages(
					input_pointer, //data
					input.length,
					universe,
					universe_size,
					output_pointer // out
				);
				
				for (let i = 0; i < universes; i++)
					output_configuration.send(
						new Uint8Array(
							inst.HEAPU8.buffer,
							output_pointer + i * package_size,
							package_size
						)
					);

				if (has_overflow)
					output_configuration.send(
						new Uint8Array(
							inst.HEAPU8.buffer,
							output_pointer + universes * package_size,
							overflow + base_package_size
						)
					);

				inst._free(input_pointer);
				inst._free(output_pointer);
			});
		});
	}
	RED.nodes.registerType("E131", E131Node);
}




