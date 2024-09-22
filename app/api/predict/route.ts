import { NextResponse } from 'next/server';

// Server action function to make a POST request to the prediction API
export async function POST(request : Request) {
  const { features } = await request.json();

  // Get the input features from the request body
  const [age, gender, time_on_site, past_purchases, cart_items] = features;

  try {
    // Make the POST request to the Flask API running locally or on a server
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ age, gender, time_on_site, past_purchases, cart_items }),
    });

    // If the Flask API returns a successful response, forward it to the client
    if (response.ok) {
      const prediction = await response.json();
      console.log('Prediction:', prediction);
      return NextResponse.json({ prediction});
    } else {
      throw new Error('Failed to get a prediction from the API.');
    }
  } catch (error) {
    console.error('Error fetching prediction:', error);
    return NextResponse.json({ error: 'An error occurred during prediction.' }, { status: 500 });
  }
}
