import { Navigate, Route, Routes } from "react-router-dom";

import { routeElements } from "@/app/router/route-config";

export function AppRoutes() {
  return (
    <Routes>
      {routeElements}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
