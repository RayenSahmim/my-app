"use client";
import React, { useState } from "react";
import { InputNumber, Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function PredictionForm() {
  const [features, setFeatures] = useState([0, 0, 0, 0, 0]);
  const [prediction, setPrediction] = useState<{
    purchase_decision: number;
    purchase_probability: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setPrediction(result.prediction);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center ">
      <div className=" w-full ">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        ) : (
          <>
            <h2 className="text-3xl text-center font-semibold text-blue-700 mb-8">
              AI Purchase Prediction
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center justify-center " >
              <div className="flex flex-col lg:flex-row  gap-4 items-center justify-center">
              <div>
                <label className="block text-xl font-medium text-gray-700">Age</label>
                <InputNumber
                  className="w-full min-w-40"
                  value={features[0]}
                  onChange={(value : number) => {
                    const newFeatures = [...features];
                    newFeatures[0] = value || 0; // Handle null case
                    setFeatures(newFeatures);
                  }}
                />
              </div>

              <div>
                <label className="block text-xl font-medium text-gray-700">Gender</label>
                <Select
                  options={[
                    { value: 0, label: "Male" },
                    { value: 1, label: "Female" },
                  ]}
                  className="w-full min-w-40"
                  value={features[1]}
                  onChange={(value: number) => {
                    const newFeatures = [...features];
                    newFeatures[1] = value;
                    setFeatures(newFeatures);
                  }}
                />
              </div>

              <div>
                <label className="block text-xl font-medium text-gray-700">Time on Site</label>
                <InputNumber
                  className="w-full min-w-40"
                  value={features[2]}
                  onChange={(value : number) => {
                    const newFeatures = [...features];
                    newFeatures[2] = value || 0; // Handle null case
                    setFeatures(newFeatures);
                  }}
                />
              </div>

              <div>
                <label className="block text-xl font-medium text-gray-700">Past Purchases</label>
                <InputNumber
                  className="w-full min-w-40"
                  value={features[3]}
                  onChange={(value : number) => {
                    const newFeatures = [...features];
                    newFeatures[3] = value || 0; 
                    setFeatures(newFeatures);
                  }}
                />
              </div>

              <div>
                <label className="block text-xl font-medium text-gray-700">Cart Items</label>
                <InputNumber
                  className="w-full min-w-40"
                  value={features[4]}
                  onChange={(value : number) => {
                    const newFeatures = [...features];
                    newFeatures[4] = value || 0; // Handle null case
                    setFeatures(newFeatures);
                  }}
                />
              </div>
              </div>

              <button
                type="submit"
                className="w-40 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300"
              >
                Submit Prediction
              </button>
            </form>

            {prediction !== null && (
              <div
                className="mt-6 bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3"
                role="alert"
              >
                <span className="text-green-900 font-bold ">
                  Purchase Probability: {prediction.purchase_probability}
                  <br />
                  Purchase Decision: {prediction.purchase_decision === 1
                    ? "Yes"
                    : "No"}
                </span>
              </div>
            )}

            {error && (
              <div
                className="mt-6 bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3"
                role="alert"
              >
                <span className="text-red-900 font-bold">{error}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
