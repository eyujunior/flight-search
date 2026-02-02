# Flight Search Engine

A modern, responsive flight search engine built with **Next.js**, **Typescript**, **TanStack Query**, **Material UI**, and the **Amadeus Self-Service API**.

---

## Live Demo

[Live App](https://flight-search-ivory.vercel.app/)

[Loom Walkthrough](https://www.loom.com/share/9a35383e104942b9b4c732041c9ae2de)

---

## Features

### Flight Search

- Airport autocomplete powered by Amadeus API
- Origin, destination, dates, and passenger inputs
- Real flight offers from Amadeus Self-Service API

### Live Price Graph

- Built with Recharts
- Shows average price by departure hour
- Updates instantly when filters change

### Advanced Filtering

- Stops (nonstop, 1 stop, 2+ stops)
- Price range slider
- Airline selection
- Real-time updates to both results and graph

### Sorting

- Sort by price (low → high / high → low)

### UX Enhancements

- Skeleton loaders for better perceived performance
- "Best Deal" badge highlights cheapest flight
- Layover tooltips show stop airports
- Friendly empty state with animation
- Fully responsive (mobile + desktop)

---

## Tech Stack

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **TanStack Query**
- **Material UI (MUI)**
- **Recharts**
- **Amadeus Self-Service API**
- **Lottie animations**

---

## Technical Decisions

### Client-Side Filtering

Filtering and sorting are done client-side to:

- Provide instant feedback
- Reduce API calls
- Keep UI highly responsive

### TanStack Query

Used for:

- Data fetching
- Caching
- Managing server state cleanly

### Derived State

Filters and sorting are derived from the same dataset rather than duplicated state, reducing bugs and improving maintainability.

---

## Responsiveness

- Mobile-first layout
- Sidebar filters collapse naturally on small screens
- Cards and charts scale across devices

---
