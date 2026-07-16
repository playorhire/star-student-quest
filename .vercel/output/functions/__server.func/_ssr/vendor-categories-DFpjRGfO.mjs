const PRODUCT_CATEGORIES = [
  { key: "Books", label: "Books", emoji: "📚" },
  { key: "Stationery", label: "Stationery", emoji: "✏️" },
  { key: "SchoolBags", label: "School Bags", emoji: "🎒" },
  { key: "WaterBottles", label: "Water Bottles", emoji: "💧" },
  { key: "LunchBoxes", label: "Lunch Boxes", emoji: "🍱" },
  { key: "Toys", label: "Toys", emoji: "🧸" },
  { key: "Sports", label: "Sports", emoji: "⚽" },
  { key: "GiftCards", label: "Gift Cards", emoji: "🎁" },
  { key: "Electronics", label: "Electronics", emoji: "🎧" },
  { key: "Others", label: "Others", emoji: "📦" }
];
function categoryLabel(key) {
  return PRODUCT_CATEGORIES.find((c) => c.key === key)?.label || key;
}
function categoryEmoji(key) {
  return PRODUCT_CATEGORIES.find((c) => c.key === key)?.emoji || "📦";
}
export {
  PRODUCT_CATEGORIES as P,
  categoryLabel as a,
  categoryEmoji as c
};
