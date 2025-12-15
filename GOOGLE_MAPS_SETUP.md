# Google Maps Integration Setup Guide

## Overview

This guide will help you set up Google Maps API to replace OpenStreetMap in your Route Pro application with advanced routing functionality.

## Prerequisites

- Google Cloud Platform account
- Credit card for Google Cloud (required for API access, but you get $200 free credits)

## Step 1: Set up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make sure billing is enabled for your project

## Step 2: Enable Required APIs

Enable the following APIs in your Google Cloud project:

1. **Maps JavaScript API** - For displaying maps
2. **Places API** - For finding nearby attractions
3. **Directions API** - For calculating routes
4. **Geocoding API** - For converting addresses to coordinates

To enable APIs:

1. Go to "APIs & Services" > "Library"
2. Search for each API and click "Enable"

## Step 3: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. **IMPORTANT**: Restrict the API key for security:
   - Click on the API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domains (e.g., `localhost:3000`, `yourdomain.com`)
   - Under "API restrictions", select "Restrict key" and choose the 4 APIs mentioned above

## Step 4: Configure Your Application

1. Create a `.env` file in your project root (if not exists):

   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

2. Replace `your_actual_api_key_here` with your actual Google Maps API key

3. Add `.env` to your `.gitignore` file to keep your API key secure:
   ```
   .env
   ```

## Step 5: Features Included

The new Google Maps implementation includes:

### ✅ **Route Planning**

- Real-time route calculation
- Turn-by-turn directions
- Multiple route options
- Draggable route modification
- Accurate distance and duration

### ✅ **Places Integration**

- Nearby tourist attractions
- Restaurants and hotels
- Museums and landmarks
- Real ratings and reviews
- Place photos

### ✅ **Advanced Features**

- Traffic-aware routing
- Alternative route suggestions
- Real-time road conditions
- Street view integration
- Satellite/terrain view options

### ✅ **Better Accuracy**

- More accurate geocoding
- Better address recognition
- Real-time traffic data
- Updated road information

## Step 6: Cost Considerations

Google Maps has usage-based pricing:

- **Maps JavaScript API**: $7 per 1,000 requests
- **Directions API**: $5 per 1,000 requests
- **Places API**: $32 per 1,000 requests
- **Geocoding API**: $5 per 1,000 requests

**Monthly free usage:**

- You get $200 free credits monthly
- Approximately 28,000 map loads or 40,000 directions requests per month for free

## Step 7: Testing

1. Restart your development server:

   ```bash
   npm start
   ```

2. Navigate to the route planning page
3. Enter origin and destination
4. Verify that:
   - Map loads correctly
   - Route is calculated and displayed
   - Nearby places are shown
   - Distance and duration are accurate

## Troubleshooting

### Common Issues:

1. **"Google Maps API key not found"**

   - Check that your `.env` file is in the project root
   - Verify the variable name is `REACT_APP_GOOGLE_MAPS_API_KEY`
   - Restart your development server

2. **"This API project is not authorized to use this API"**

   - Make sure you've enabled all required APIs
   - Check that billing is enabled on your Google Cloud project

3. **"RefererNotAllowedMapError"**

   - Add your domain to the API key restrictions
   - For development, add `localhost:3000`

4. **"OverQueryLimit"**
   - You've exceeded your daily quota
   - Check your usage in Google Cloud Console
   - Consider upgrading your plan if needed

## Security Best Practices

1. **Never commit your API key to version control**
2. **Always restrict your API key to specific domains**
3. **Monitor your API usage regularly**
4. **Use API key restrictions to limit which APIs can be accessed**
5. **Consider using server-side API calls for sensitive operations**

## Migration Notes

The new Google Maps component maintains the same interface as the previous OpenStreetMap component, so existing code should work with minimal changes. The main differences:

- More accurate route calculations
- Better place search results
- Real-time traffic data
- Professional mapping interface

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your Google Cloud setup
3. Check your API quotas and billing
4. Refer to [Google Maps documentation](https://developers.google.com/maps/documentation)
