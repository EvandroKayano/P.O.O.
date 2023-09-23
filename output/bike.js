"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bike = void 0;
class Bike {
    constructor(name, type, bodySize, maxLoad, hourly, // preço por hora
    description, ratings, imageUrls, available = true, // vago para uso
    local, id) {
        this.name = name;
        this.type = type;
        this.bodySize = bodySize;
        this.maxLoad = maxLoad;
        this.hourly = hourly;
        this.description = description;
        this.ratings = ratings;
        this.imageUrls = imageUrls;
        this.available = available;
        this.local = local;
        this.id = id;
    }
}
exports.Bike = Bike;
