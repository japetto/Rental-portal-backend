import { Reservations } from "./reservations.schema";

export function generateReservationsId() {
  const idLength = 10;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let reservationId = `res`;

  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    reservationId += characters.charAt(randomIndex);
  }

  return reservationId;
}

export const reservationCreated = async (
  profileId: string,
): Promise<number> => {
  const reservations = await Reservations.find({ profileId });

  const totalReservationsCreated = reservations.reduce(
    (accumulator, currentValue) => accumulator + currentValue.totalReservations,
    0,
  );
  console.log(totalReservationsCreated);

  return totalReservationsCreated;
};
