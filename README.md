# Custom Logo Builder

A full-stack web application for creating custom logos with AI-powered branding suggestions.

## Features

- **Drag & Drop Canvas**: Create logos using shapes, text, and drawing tools
- **AI Branding Suggestions**: Get color palettes, fonts, and layout ideas based on industry and keywords
- **Save & Load**: Persist logos to H2 database
- **Interactive Tools**: Selection, drawing, shapes (rectangle, circle, triangle), and text tools

## Tech Stack

- **Backend**: Java Spring Boot, H2 Database, Gemini AI API
- **Frontend**: React.js, Fabric.js for canvas manipulation
- **AI Integration**: Google Gemini API for branding suggestions

## Setup Instructions

### Backend (Spring Boot)

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

3. The backend will start on `http://localhost:8080`
4. H2 Console available at `http://localhost:8080/h2-console`

### Frontend (React)

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The frontend will start on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Use the toolbar to select tools and add shapes/text to the canvas
3. Fill in industry and brand keywords to get AI suggestions
4. Apply suggested colors by clicking on color swatches
5. Save your logo with a custom name

## API Endpoints

- `GET /api/logos` - Get all logos
- `POST /api/logos` - Save a new logo
- `PUT /api/logos/{id}` - Update a logo
- `DELETE /api/logos/{id}` - Delete a logo
- `POST /api/ai/branding-suggestions` - Get AI branding suggestions