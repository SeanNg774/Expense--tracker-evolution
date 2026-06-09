const API_BASE_URL = "http://localhost:5001/api";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Unable to complete the request");
  }

  return data;
};

export const getTransactions = () => {
  return request("/transactions");
};

export const createTransaction = (transactionData) => {
  return request("/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  });
};

export const deleteTransaction = (id) => {
  return request(`/transactions/${id}`, {
    method: "DELETE",
  });
};
