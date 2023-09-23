"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gps = void 0;
class Gps {
    constructor(long, lati) {
        this.long = long;
        this.lati = lati;
    }
    walkN() {
        this.lati += 0.1;
    }
    walkS() {
        this.lati -= 0.1;
    }
    walkE() {
        this.long += 0.1;
    }
    walkW() {
        this.long -= 0.1;
    }
}
exports.Gps = Gps;
