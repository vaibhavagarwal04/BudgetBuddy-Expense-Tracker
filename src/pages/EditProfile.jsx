import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import supabase from "../../supabase-client";

function EditProfile() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        gender: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                navigate("/login", { replace: true });
                return;
            }

            const { data: profile } = await supabase
                .from("account_summary")
                .select("gender")
                .eq("id", user.id)
                .maybeSingle();

            setForm({
                firstName: user.user_metadata?.first_name || "",
                lastName: user.user_metadata?.last_name || "",
                phone: user.user_metadata?.phone || "",
                gender: profile?.gender || "",
            });
            setLoading(false);
        };

        loadProfile();
    }, [navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSaving(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                navigate("/login", { replace: true });
                return;
            }

            const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    first_name: form.firstName.trim(),
                    last_name: form.lastName.trim(),
                    phone: form.phone.trim(),
                },
            });

            if (authError) throw authError;

            const { error: profileError } = await supabase
                .from("account_summary")
                .update({ name: fullName || null, gender: form.gender || null })
                .eq("id", user.id);

            if (profileError) throw profileError;
            navigate("/dashboard/profile");
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Unable to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-600">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/profile")}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                    <ArrowLeft size={17} /> Back to profile
                </button>

                <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
                <p className="mt-1 text-sm text-slate-500">Update the details shown on your profile.</p>

                {errorMessage && (
                    <p role="alert" className="mt-5 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {errorMessage}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="text-sm font-semibold text-slate-700">
                            First name
                            <input
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                            />
                        </label>
                        <label className="text-sm font-semibold text-slate-700">
                            Last name
                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                            />
                        </label>
                    </div>

                    <label className="block text-sm font-semibold text-slate-700">
                        Phone number
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            pattern="[6-9][0-9]{9}"
                            required
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                        />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                        Gender
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                        >
                            <option value="">Prefer not to say</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </label>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={18} />
                        {saving ? "Saving changes..." : "Save changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
