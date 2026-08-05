import React from 'react';
import { Navigate } from 'react-router-dom';

/** Detail pages disabled while Events is Coming soon. */
const EventDetailPage: React.FC = () => <Navigate to="/events" replace />;

export default EventDetailPage;
