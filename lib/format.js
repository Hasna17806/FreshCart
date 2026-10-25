export const inr = (n) => '₹' + Number(n).toFixed(2);
export const billNo = (id) => 'FC-' + String(id).padStart(5, '0');
