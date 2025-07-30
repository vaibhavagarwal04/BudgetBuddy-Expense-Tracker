import supabase from "../../supabase-client";


export const fetchIncomes = async (userId) => {
  const { data, error } = await supabase
    .from("income")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching incomes:", error);
    return [];
  }
  return data;
};
