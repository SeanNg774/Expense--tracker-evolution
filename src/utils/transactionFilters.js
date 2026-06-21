export const filterTransactions = (
  items,
  searchTerm = "",
  selectedCategory = "All"
) => {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  return items.filter((item) => {
    const category = item.category || "Other";
    const matchesSearch =
      normalizedSearchTerm === "" ||
      item.title.toLowerCase().includes(normalizedSearchTerm) ||
      category.toLowerCase().includes(normalizedSearchTerm);
    const matchesCategory =
      selectedCategory === "All" || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
};
