"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationCreated = void 0;
exports.generateReservationsId = generateReservationsId;
const reservations_schema_1 = require("./reservations.schema");
function generateReservationsId() {
    const idLength = 10;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let reservationId = `res`;
    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        reservationId += characters.charAt(randomIndex);
    }
    return reservationId;
}
const reservationCreated = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    const reservations = yield reservations_schema_1.Reservations.find({ profileId });
    const totalReservationsCreated = reservations.reduce((accumulator, currentValue) => accumulator + currentValue.totalReservations, 0);
    console.log(totalReservationsCreated);
    return totalReservationsCreated;
});
exports.reservationCreated = reservationCreated;
