import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../../supabase-client";

function PrivateRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };
        getSession();
    },[]);

    if(loading) return <div>Loading...</div>
    return session?children:<Navigate to="/login"/>
}

export default PrivateRoute;
