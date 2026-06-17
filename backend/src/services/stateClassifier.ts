/**
 * Klasifikasi state pemakaian terminal berdasarkan nilai power (Watt).
 *
 * Threshold ini adalah titik awal yang umum untuk charger HP/laptop.
 * Disarankan dikalibrasi ulang setelah beberapa hari observasi data riil,
 * karena setiap charger/device punya karakteristik power berbeda.
 *
 *  - idle             : < 2W      (tidak ada device tersambung / standby)
 *  - charging_small   : 2 - 30W   (HP, earbud, perangkat kecil)
 *  - charging_laptop  : 30 - 100W (laptop charger umum)
 *  - multi_device     : > 100W    (kemungkinan beberapa device sekaligus)
 */
const THRESHOLDS = {
  IDLE_MAX: 2,
  SMALL_MAX: 30,
  LAPTOP_MAX: 100,
};

function classifyState(power) {
  if (power < THRESHOLDS.IDLE_MAX) return "idle";
  if (power < THRESHOLDS.SMALL_MAX) return "charging_small";
  if (power < THRESHOLDS.LAPTOP_MAX) return "charging_laptop";

  return "multi_device";
}

export {
  classifyState,
  THRESHOLDS,
};
