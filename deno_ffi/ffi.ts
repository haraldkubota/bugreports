// ffi.ts

import {format} from "https://deno.land/x/bytes_formater@v1.4.0/mod.ts";

const libName = `./libeth.so`;

const dylib = Deno.dlopen(
    libName,
    {
        "socket_open": {parameters: ["buffer"], result: "i32"},
        "socket_close": {parameters: ["i32"], result: "i32"},
        "get_mac_addr": {parameters: ["void"], result: "u64"},
        // "get_ifrindex": {parameters: ["void"], result: "i64"},
        // "socket_send": {parameters: ["i32", "u64", "u64", "u32", "buffer", "u32", "u32"], result: "i32"},
    } as const,
);


const DevNameLength = 128;

function socketOpen(dev: string): number {
    if (dev.length >= DevNameLength) return -1;
    const buf = new Uint8Array(DevNameLength);
    for (let i = 0; i < dev.length; ++i) buf[i] = dev.charCodeAt(i)
    buf[dev.length] = 0;
    // console.log(format(buf));
    return dylib.symbols.socket_open(buf);
}

function socketClose(socket: number): number {
    return dylib.symbols.socket_close(socket);
}

function getMACAddr(): bigint {
    return dylib.symbols.get_mac_addr();
}

let socket = socketOpen("enp1s0");
console.log(socket);

// The next line is where Deno crashes
let srcMac = getMACAddr();

console.log(`srcMAC = 0x${srcMac.toString(16)}`);
let res = socketClose(socket);
console.log(res);
