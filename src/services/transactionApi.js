// Change this to match your actual backend URL/port if needed!
const API_URL = "http://localhost:5001/api/transactions";

// Helper function to grab the token and format the headers securely
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` // This is the digital "ID Card" we send to the database
  };
};

export const getTransactions = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(), // Attach the ID card
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch transactions");
  }

  return response.json();
};

export const createTransaction = async (transactionData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(), // Attach the ID card
    body: JSON.stringify(transactionData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create transaction");
  }

  return response.json();
};

export const deleteTransaction = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(), // Attach the ID card
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete transaction");
  }

  return response.json();
};