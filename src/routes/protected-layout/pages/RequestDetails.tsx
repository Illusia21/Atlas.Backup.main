import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col">
            <h1>Request Details - ID: {id}</h1>
            <button onClick={() => navigate(-1)}>← Back</button>
        </div>
    );
}