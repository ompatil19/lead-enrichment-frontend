import React, { useState } from 'react';
import axios from 'axios';
import { db } from '../../firebase_config';
import { collection, addDoc } from "firebase/firestore";
import '../../App.css';
function Dashboard() {
    const [companyName, setCompanyName] = useState('');
    const [website, setWebsite] = useState('');
    const [enrichedData, setEnrichedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setEnrichedData(null);

        try {
            // Step 1: Send data to the API and get enriched data
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL, {
                company_name: companyName,
                website: website
            });

            const fetchedData = response.data;  // Capture enriched data in a local variable
            setEnrichedData(fetchedData);  // Set enriched data in state for display

            // Step 2: Save the enriched data to Firestore
            await addDoc(collection(db, "companies"), {
                Name: fetchedData.name,  // Use fetchedData directly
                Description: fetchedData.description,
                Industry: fetchedData.industry,
                Employees_Count: fetchedData.employees_count,
                Type: fetchedData.type
            });

            console.log("Data successfully saved to Firestore");

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex p-6 justify-around w-screen">
            <div>

                <h1 className="text-2xl font-bold mb-4">Lead Capture Form</h1>
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Website URL</label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? 'Enriching...' : 'Enrich Lead'}
                    </button>
                </form>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {enrichedData && (
                <div className="mt-6 w-full bg-gray-50 p-4 rounded-md shadow-md max-w-2xl">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Enriched Company Information</h2>
                    <div className="grid grid-cols-2 gap-4 ">
                        <div><img src={enrichedData.logo_url} alt="Company logo does not exist" /></div>
                        <div>
                            <div><span className="font-bold">Name:</span> {enrichedData.name}</div>
                            {/* <div><span className="font-bold">Website:</span> <a href={enrichedData.website} className='text-indigo-950'>{enrichedData.website}</a></div> */}
                            <div>
                                <span className="font-bold">Description:</span>
                                {enrichedData.description ?
                                    enrichedData.description.split(" ").slice(0, 60).join(" ") + (enrichedData.description.split(" ").length > 60 ? "..." : "")
                                    : ""
                                }
                            </div>

                            <div><span className="font-bold">Industry:</span> {enrichedData.industry}</div>
                            {/* <div><span className="font-bold">Location:</span> {enrichedData.location}</div> */}
                            <div><span className="font-bold">Employees Count:</span> {enrichedData.employees_count}</div>
                            <div><span className="font-bold">Type:</span> {enrichedData.type}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
