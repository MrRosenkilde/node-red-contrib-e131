#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <err.h>
#include "e131.h"

#define MIN_SIZE 126
uint8_t sequence = 0;

void makePackages(uint8_t* data, size_t length, uint16_t universe, uint16_t universe_size, uint8_t* out) {
	const uint16_t packages = length / universe_size;
	const uint16_t remainder = length % universe_size;
	const uint16_t package_size = MIN_SIZE + universe_size;
	e131_packet_t packet;
	sequence++;
	for (uint16_t i = 0; i < packages; i++) {
		e131_pkt_init(&packet, universe + i, universe_size);
		packet.frame.seq_number = sequence;
		memcpy(packet.dmp.prop_val + 1, data + (i * universe_size), universe_size);
		memcpy(&packet.frame.source_name, "pa_package", 11);
		memcpy(out + (package_size * i), &packet, package_size);
	}
	if (remainder > 0) {
		e131_pkt_init(&packet, universe + packages, remainder);
		packet.frame.seq_number = sequence;
		memcpy(packet.dmp.prop_val + 1, data + length - remainder, remainder);
		memcpy(&packet.frame.source_name, "pa_package", 11);
		memcpy(out + (package_size * packages), &packet, MIN_SIZE + remainder);
	}
}
